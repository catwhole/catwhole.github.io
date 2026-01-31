// ==================== AUDIO SYSTEM ====================
const AUDIO_CONFIG = {
    sfxVolume: 0.36,     // SFX volume (0-1) - slightly higher than BGM
    bgmVolume: 0.3,      // Background music volume (0-1) - lowered globally
    sfxEnabled: true,    // SFX toggle state
    bgmEnabled: true,    // BGM toggle state
};

// Track active fade intervals
let activeFadeIntervals = [];

// Track active rarity SFX element
let currentRaritySfxEl = null;

// Track active BGM
let currentBgmId = 'bgmDefault';

/**
 * Play sound effect by element ID
 * @param {string} soundId - HTML audio element id
 */
function playSound(soundId) {
    if (!AUDIO_CONFIG.sfxEnabled) return;
    
    const audio = document.getElementById(soundId);
    if (audio) {
        audio.currentTime = 0;
        audio.volume = AUDIO_CONFIG.sfxVolume;
        audio.play().catch(err => console.log('Audio play failed:', err));
    }
}

function playRaritySfx(soundId) {
    if (!AUDIO_CONFIG.sfxEnabled) return;
    const audio = document.getElementById(soundId);
    if (audio) {
        if (currentRaritySfxEl && currentRaritySfxEl !== audio) {
            currentRaritySfxEl.pause();
            currentRaritySfxEl.currentTime = 0;
        }
        currentRaritySfxEl = audio;
        audio.currentTime = 0;
        audio.volume = AUDIO_CONFIG.sfxVolume;
        audio.play().catch(err => console.log('Audio play failed:', err));
    }
}

/**
 * Switch background music with fade transition
 * @param {string} trackId - HTML audio element id for background music
 * @param {number} fadeDuration - Fade duration in milliseconds (default 1000ms)
 * @param {number} silenceDelay - Delay between fade out and fade in in milliseconds (default 0ms)
 */
function switchBgm(trackId, fadeDuration = 1000, silenceDelay = 0) {
    currentBgmId = trackId;
    if (!AUDIO_CONFIG.bgmEnabled) {
        // Stop all BGM if disabled
        const allBgm = document.querySelectorAll('[data-bgm]');
        allBgm.forEach(track => {
            track.pause();
            track.currentTime = 0;
        });
        return;
    }
    
    const track = document.getElementById(trackId);
    if (!track) return;
    
    // Clear any active fade intervals
    activeFadeIntervals.forEach(interval => clearInterval(interval));
    activeFadeIntervals = [];
    
    // Get all currently playing BGM tracks
    const allBgm = document.querySelectorAll('[data-bgm]');
    const fadeStep = 50; // Update every 50ms
    const steps = Math.max(1, fadeDuration / fadeStep);
    
    // Fade out all existing tracks
    let fadeOutStep = 0;
    const fadeOutInterval = setInterval(() => {
        fadeOutStep++;
        const progress = Math.min(1, fadeOutStep / steps); // Clamp between 0-1
        
        allBgm.forEach(bgmTrack => {
            if (bgmTrack.id !== trackId) {
                bgmTrack.volume = Math.max(0, AUDIO_CONFIG.bgmVolume * (1 - progress));
            }
        });
        
        if (fadeOutStep >= steps) {
            clearInterval(fadeOutInterval);
            activeFadeIntervals = activeFadeIntervals.filter(i => i !== fadeOutInterval);
            // Stop old tracks
            allBgm.forEach(bgmTrack => {
                if (bgmTrack.id !== trackId) {
                    bgmTrack.pause();
                    bgmTrack.currentTime = 0;
                    bgmTrack.volume = AUDIO_CONFIG.bgmVolume;
                }
            });
            
            // Start new track after silence delay
            setTimeout(() => {
                playNewTrack();
            }, silenceDelay);
        }
    }, fadeStep);
    
    activeFadeIntervals.push(fadeOutInterval);
    
    // Function to play and fade in new track
    function playNewTrack() {
        // Start new track with fade in
        track.currentTime = 0;
        track.volume = 0;
        track.loop = true;
        const playPromise = track.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                let fadeInStep = 0;
                const fadeInInterval = setInterval(() => {
                    fadeInStep++;
                    const progress = Math.min(1, fadeInStep / steps); // Clamp between 0-1
                    track.volume = AUDIO_CONFIG.bgmVolume * progress;
                    
                    if (fadeInStep >= steps) {
                        clearInterval(fadeInInterval);
                        activeFadeIntervals = activeFadeIntervals.filter(i => i !== fadeInInterval);
                        track.volume = AUDIO_CONFIG.bgmVolume;
                    }
                }, fadeStep);
                
                activeFadeIntervals.push(fadeInInterval);
            }).catch(err => {
                // Autoplay failed - reset track to playable state for user interaction
                console.log('BGM autoplay blocked:', trackId, err);
                track.volume = AUDIO_CONFIG.bgmVolume;
                track.currentTime = 0;
                track.pause();
            });
        }
    }
}

/**
 * Update global audio volumes
 * @param {number} sfxVol - SFX volume (0-1)
 * @param {number} bgmVol - BGM volume (0-1)
 */
function setAudioVolumes(sfxVol, bgmVol) {
    if (sfxVol !== undefined) AUDIO_CONFIG.sfxVolume = Math.max(0, Math.min(1, sfxVol));
    if (bgmVol !== undefined) AUDIO_CONFIG.bgmVolume = Math.max(0, Math.min(1, bgmVol));
    
    // Update all currently playing audio
    const allBgm = document.querySelectorAll('[data-bgm]');
    allBgm.forEach(track => {
        track.volume = AUDIO_CONFIG.bgmVolume;
    });
}

/**
 * Toggle SFX on/off
 */
function toggleSfx() {
    AUDIO_CONFIG.sfxEnabled = !AUDIO_CONFIG.sfxEnabled;
    const btn = document.getElementById('toggleSfx');
    if (btn) {
        btn.setAttribute('data-enabled', AUDIO_CONFIG.sfxEnabled);
    }
}

/**
 * Toggle BGM on/off
 */
function toggleBgm() {
    AUDIO_CONFIG.bgmEnabled = !AUDIO_CONFIG.bgmEnabled;
    const btn = document.getElementById('toggleBgm');
    if (btn) {
        btn.setAttribute('data-enabled', AUDIO_CONFIG.bgmEnabled);
    }
    
    // Stop or resume BGM
    const bgm = document.getElementById(currentBgmId);
    if (bgm) {
        if (AUDIO_CONFIG.bgmEnabled) {
            bgm.play().catch(err => console.log('BGM resume failed:', err));
        } else {
            bgm.pause();
        }
    }
}

// ==================== INTERACTIVE ELEMENT SFX SYSTEM ====================
/**
 * Universal SFX for interactive elements
 * Applies to: buttons, checkboxes, radio buttons, text inputs, selects
 */

// Hover sound - apply to all interactive elements
document.addEventListener('mouseenter', (e) => {
    const target = e.target;
    if (isInteractiveElement(target)) {
        playSound('hoverSound');
    }
}, true); // Use capture phase to catch all elements

// Click sound - apply to all interactive elements
document.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.closest && target.closest('#rollButton')) return;
    if (isInteractiveElement(target)) {
        playSound('clickSound');
    }
}, true);

/**
 * Check if element should trigger SFX
 * @param {Element} element
 * @returns {boolean}
 */
function isInteractiveElement(element) {
    if (!element || typeof element.matches !== 'function') return false;
    return element.matches('button, input, select, textarea');
}

// ==================== INTRO SCREEN ====================
const startButton = document.getElementById('startButton');
const toggleSfxBtn = document.getElementById('toggleSfx');
const toggleBgmBtn = document.getElementById('toggleBgm');
const introScreen = document.getElementById('introScreen');
const bgVideo = document.querySelector('.background-video');

// Initialize toggle buttons with state (safe check)
if (toggleSfxBtn) toggleSfxBtn.setAttribute('data-enabled', AUDIO_CONFIG.sfxEnabled);
if (toggleBgmBtn) toggleBgmBtn.setAttribute('data-enabled', AUDIO_CONFIG.bgmEnabled);

// Toggle button listeners
if (toggleSfxBtn) toggleSfxBtn.addEventListener('click', toggleSfx);
if (toggleBgmBtn) toggleBgmBtn.addEventListener('click', toggleBgm);

// Start background music on page load (will fail due to autoplay restrictions)
switchBgm('bgmDefault');

// Fallback: Start BGM on first user interaction if autoplay was blocked
let bgmStarted = false;

function startBgmOnInteraction() {
    if (bgmStarted) return;
    bgmStarted = true;
    
    // Try to play the current BGM track
    const bgm = document.getElementById(currentBgmId) || document.getElementById('bgmDefault');
    if (bgm && AUDIO_CONFIG.bgmEnabled && bgm.paused) {
        bgm.play().catch(err => console.log('BGM play on interaction failed:', err));
    }
}

document.addEventListener('click', startBgmOnInteraction, { once: true });
document.addEventListener('touchstart', startBgmOnInteraction, { once: true });

// Hover feedback
startButton.addEventListener('mouseenter', () => {
    playSound('hoverSound');
});

// Start interaction
startButton.addEventListener('click', closeIntro);

// ==================== PANEL TOGGLE ====================
// Track if single result was showing before panel opened
let wasSingleResultShowing = false;

function togglePanel(panelId, btnId) {
	const panel = document.getElementById(panelId);
	const btn = document.getElementById(btnId);
	const isOpen = !!(panel && panel.classList.contains('open'));
	const resultsBox = document.getElementById('resultsBox');
	const singleResult = document.getElementById('singleResult');
	const rollPanel = document.getElementById('rollOptionsPanel');
	const settingsPanel = document.getElementById('settingsPanel');
	if (rollPanel) rollPanel.classList.remove('open');
	if (settingsPanel) settingsPanel.classList.remove('open');
	const rollBtn = document.getElementById('rollOptionsBtn');
	const settingsBtn = document.getElementById('settingsBtn');
	if (rollBtn) rollBtn.setAttribute('data-enabled', 'false');
	if (settingsBtn) settingsBtn.setAttribute('data-enabled', 'false');
	if (!panel) return;
	if (!isOpen) {
		// Opening panel - remember what was showing
		wasSingleResultShowing = singleResult && singleResult.style.display === 'flex';
		panel.classList.add('open');
		if (btn) btn.setAttribute('data-enabled', 'true');
		if (resultsBox) resultsBox.style.display = 'none';
		// Use visibility to hide single result so animations keep running (no restart on restore)
		if (singleResult && wasSingleResultShowing) {
			singleResult.style.visibility = 'hidden';
			singleResult.classList.remove('flash'); // Remove flash so it doesn't replay
		}
	} else {
		// Closing panel - restore what was showing
		if (wasSingleResultShowing && singleResult) {
			singleResult.style.visibility = 'visible';
		} else if (resultsBox && resultsBox.dataset.hasResults === 'true') {
			resultsBox.style.display = 'block';
		}
	}
}

// Wire panel toggle buttons
document.addEventListener('DOMContentLoaded', () => {
	const rollOptionsBtn = document.getElementById('rollOptionsBtn');
	const settingsBtn = document.getElementById('settingsBtn');
	if (rollOptionsBtn) rollOptionsBtn.addEventListener('click', () => togglePanel('rollOptionsPanel', 'rollOptionsBtn'));
	if (settingsBtn) settingsBtn.addEventListener('click', () => togglePanel('settingsPanel', 'settingsBtn'));
});

/**
 * Close intro screen and lighten background
 */
function closeIntro() {
    bgVideo.style.filter = 'brightness(0.15)';
    introScreen.style.animation = 'fadeOut 0.6s ease-out forwards';
    
    // Check if intro music was actually playing
    const bgmDefault = document.getElementById('bgmDefault');
    const introWasPlaying = bgmDefault && !bgmDefault.paused;
    
    // Switch from intro music to main music with silence in between
    // Use shorter fade (300ms) if intro wasn't playing, full fade (1000ms) if it was
    switchBgm('bgmMain', introWasPlaying ? 1000 : 300, 0);
    
    setTimeout(() => {
        introScreen.style.display = 'none';
        const mainMenu = document.getElementById('mainMenu');
        if (mainMenu) mainMenu.classList.remove('hidden');
        const toggleControls = document.getElementById('toggleControls');
        const target = document.getElementById('bottomRightControls');
        if (toggleControls && target) target.appendChild(toggleControls);
    }, 600);
}
