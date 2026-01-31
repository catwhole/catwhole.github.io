// ==================== AUDIO SYSTEM ====================
const AUDIO_CONFIG = {
    sfxVolume: 0.25,     // SFX volume (0-1) - 50% default, max 0.5 for safety
    bgmVolume: 0.25,     // Background music volume (0-1) - 50% default, max 0.5 for safety
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
 * Switch background video with fade transition
 * @param {string} videoSrc - Path to the new video file (e.g. "Media/limbo.mp4")
 * @param {number} fadeDuration - Fade duration in milliseconds (default 1000ms)
 */
function switchBackgroundVideo(videoSrc, fadeDuration = 1000) {
    const bgVideo = document.querySelector('.background-video');
    if (!bgVideo) return;
    
    // If already playing this video, do nothing
    const currentSrc = bgVideo.querySelector('source').src;
    const newFullSrc = new URL(videoSrc, window.location.href).href;
    if (currentSrc === newFullSrc) return;
    
    // Get current brightness value, defaulting to 0.3 if not set
    let currentBrightness = 0.3;
    const filterMatch = bgVideo.style.filter.match(/brightness\(([\d.]+)\)/);
    if (filterMatch) {
        currentBrightness = parseFloat(filterMatch[1]);
    }
    
    bgVideo.style.transition = `filter ${fadeDuration}ms ease-out`;
    bgVideo.style.filter = 'brightness(0)';
    
    setTimeout(() => {
        // Change video source
        const source = bgVideo.querySelector('source');
        if (source) {
            source.src = videoSrc;
            bgVideo.load();
            
            // Wait for video to be ready, then fade in from black
            bgVideo.addEventListener('loadeddata', function onLoaded() {
                bgVideo.removeEventListener('loadeddata', onLoaded);
                bgVideo.style.filter = `brightness(${currentBrightness})`;
            });
            
            // Start playing
            bgVideo.play().catch(err => console.log('Video play failed:', err));
        }
    }, fadeDuration);
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
 * Toggle SFX slider visibility and hide BGM slider
 */
function toggleSfxSlider() {
    const sfxContainer = document.getElementById('sfxSliderContainer');
    const bgmContainer = document.getElementById('bgmSliderContainer');
    const sfxBtn = document.getElementById('sfxVolumeBtn');
    const bgmBtn = document.getElementById('bgmVolumeBtn');
    if (sfxContainer) {
        const isVisible = sfxContainer.style.display !== 'none';
        sfxContainer.style.display = isVisible ? 'none' : 'flex';
        if (isVisible) {
            // Closing - remove data-enabled to restore default state
            if (sfxBtn) sfxBtn.removeAttribute('data-enabled');
            if (bgmBtn) bgmBtn.removeAttribute('data-enabled');
        } else {
            // Opening - highlight this button, dim the other
            if (sfxBtn) sfxBtn.setAttribute('data-enabled', 'true');
            if (bgmBtn) bgmBtn.setAttribute('data-enabled', 'false');
            if (bgmContainer) bgmContainer.style.display = 'none';
        }
    }
}

/**
 * Toggle BGM slider visibility and hide SFX slider
 */
function toggleBgmSlider() {
    const sfxContainer = document.getElementById('sfxSliderContainer');
    const bgmContainer = document.getElementById('bgmSliderContainer');
    const sfxBtn = document.getElementById('sfxVolumeBtn');
    const bgmBtn = document.getElementById('bgmVolumeBtn');
    if (bgmContainer) {
        const isVisible = bgmContainer.style.display !== 'none';
        bgmContainer.style.display = isVisible ? 'none' : 'flex';
        if (isVisible) {
            // Closing - remove data-enabled to restore default state
            if (sfxBtn) sfxBtn.removeAttribute('data-enabled');
            if (bgmBtn) bgmBtn.removeAttribute('data-enabled');
        } else {
            // Opening - highlight this button, dim the other
            if (bgmBtn) bgmBtn.setAttribute('data-enabled', 'true');
            if (sfxBtn) sfxBtn.setAttribute('data-enabled', 'false');
            if (sfxContainer) sfxContainer.style.display = 'none';
        }
    }
}

/**
 * Update SFX volume from slider (0-100 maps to 0-0.5)
 */
function updateSfxVolume(value) {
    const percent = parseInt(value);
    const actualVolume = (percent / 100) * 0.5;
    setAudioVolumes(actualVolume, undefined);
    const label = document.getElementById('sfxVolumeLabel');
    if (label) label.textContent = percent + '%';
}

/**
 * Update BGM volume from slider (0-100 maps to 0-0.5)
 */
function updateBgmVolume(value) {
    const percent = parseInt(value);
    const actualVolume = (percent / 100) * 0.5;
    setAudioVolumes(undefined, actualVolume);
    const label = document.getElementById('bgmVolumeLabel');
    if (label) label.textContent = percent + '%';
}

/**
 * Mute SFX by setting slider to 0
 */
function muteSfx() {
    const slider = document.getElementById('sfxVolumeSlider');
    if (slider) {
        slider.value = 0;
        updateSfxVolume(0);
    }
}

/**
 * Mute BGM by setting slider to 0
 */
function muteBgm() {
    const slider = document.getElementById('bgmVolumeSlider');
    if (slider) {
        slider.value = 0;
        updateBgmVolume(0);
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
const sfxVolumeBtn = document.getElementById('sfxVolumeBtn');
const bgmVolumeBtn = document.getElementById('bgmVolumeBtn');
const sfxVolumeSlider = document.getElementById('sfxVolumeSlider');
const bgmVolumeSlider = document.getElementById('bgmVolumeSlider');
const introScreen = document.getElementById('introScreen');
const bgVideo = document.querySelector('.background-video');

// Initialize sliders with default value (50%)
if (sfxVolumeSlider) {
    sfxVolumeSlider.value = 50;
    sfxVolumeSlider.addEventListener('input', (e) => updateSfxVolume(e.target.value));
}
if (bgmVolumeSlider) {
    bgmVolumeSlider.value = 50;
    bgmVolumeSlider.addEventListener('input', (e) => updateBgmVolume(e.target.value));
}

// Volume button listeners
if (sfxVolumeBtn) sfxVolumeBtn.addEventListener('click', toggleSfxSlider);
if (bgmVolumeBtn) bgmVolumeBtn.addEventListener('click', toggleBgmSlider);

// Mute button listeners
const sfxMuteBtn = document.getElementById('sfxMuteBtn');
const bgmMuteBtn = document.getElementById('bgmMuteBtn');
if (sfxMuteBtn) sfxMuteBtn.addEventListener('click', () => muteSfx());
if (bgmMuteBtn) bgmMuteBtn.addEventListener('click', () => muteBgm());

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
	const rollPanelContainer = document.getElementById('rollOptionsPanelContainer');
	const settingsPanel = document.getElementById('settingsPanel');
	if (rollPanelContainer) rollPanelContainer.classList.remove('open');
	if (settingsPanel) settingsPanel.classList.remove('open');
	const rollBtn = document.getElementById('rollOptionsBtn');
	const settingsBtn = document.getElementById('settingsBtn');
	if (!panel) return;
	if (!isOpen) {
		// Opening panel - remember what was showing, dim the other button
		wasSingleResultShowing = singleResult && singleResult.style.display === 'flex';
		panel.classList.add('open');
		if (btn) btn.setAttribute('data-enabled', 'true');
		// Dim the other button
		if (btnId === 'rollOptionsBtn' && settingsBtn) settingsBtn.setAttribute('data-enabled', 'false');
		if (btnId === 'settingsBtn' && rollBtn) rollBtn.setAttribute('data-enabled', 'false');
		if (resultsBox) resultsBox.style.display = 'none';
		// Use visibility to hide single result so animations keep running (no restart on restore)
		if (singleResult && wasSingleResultShowing) {
			singleResult.style.visibility = 'hidden';
			singleResult.classList.remove('flash'); // Remove flash so it doesn't replay
		}
	} else {
		// Closing panel - restore default state for both buttons
		if (rollBtn) rollBtn.removeAttribute('data-enabled');
		if (settingsBtn) settingsBtn.removeAttribute('data-enabled');
		if (wasSingleResultShowing && singleResult) {
			singleResult.style.visibility = 'visible';
		} else if (resultsBox && resultsBox.dataset.hasResults === 'true') {
			resultsBox.style.display = 'block';
		}
	}
}

// ==================== LIMBO BIOME SPECIAL HANDLING ====================
// Store original luck presets HTML to restore later
let originalLuckPresetsHTML = null;

// Biome media configuration - add new biomes here
const BIOME_CONFIG = {
	'limbo': {
		bgm: 'bgmLimbo',
		video: 'Media/limbo.mp4',
		modeClass: 'limbo-mode'
	},
	'glitch': {
		bgm: 'bgmGlitch',
		video: 'Media/glitch.mp4',
		modeClass: 'glitch-mode'
	},
	'dreamspace': {
		bgm: 'bgmDreamspace',
		video: 'Media/dreamspace.mp4',
		modeClass: 'dreamspace-mode'
	},
	// Default for all other biomes
	'default': {
		bgm: 'bgmMain',
		video: 'Media/normal day.mp4',
		modeClass: null
	}
};

/**
 * Handle biome change - switch BGM, video, and UI for LIMBO
 * @param {string} biome - Selected biome value
 */
function handleBiomeChange(biome) {
	// Get config for this biome, or use default
	const config = BIOME_CONFIG[biome] || BIOME_CONFIG['default'];
	const isLimbo = biome === 'limbo';
	
	// Remove all mode classes
	document.body.classList.remove('limbo-mode', 'dreamspace-mode', 'glitch-mode');
	
	// Add specific mode class if defined
	if (config.modeClass) {
		document.body.classList.add(config.modeClass);
	}
	
	// Switch BGM and video only if actually changing
	if (currentBgmId !== config.bgm) {
		switchBgm(config.bgm, 1000, 0);
		switchBackgroundVideo(config.video, 1000);
	}
	
	// Handle luck presets (only for LIMBO currently)
	handleLimboLuckPresets(isLimbo);
	
	// Handle special aura toggles (only for LIMBO currently)
	handleLimboSpecialToggles(isLimbo);
}

/**
 * Replace luck presets with Void Heart option for LIMBO, or restore original presets
 * @param {boolean} isLimbo - Whether LIMBO biome is selected
 */
function handleLimboLuckPresets(isLimbo) {
	const luckPresetsDropdown = document.getElementById('luckPresetsDropdown');
	if (!luckPresetsDropdown) return;
	
	if (isLimbo) {
		// Save original HTML if not already saved
		if (!originalLuckPresetsHTML) {
			originalLuckPresetsHTML = luckPresetsDropdown.innerHTML;
		}
		
		// Replace with single Void Heart option
		luckPresetsDropdown.innerHTML = '<button class="preset-btn" data-luck="300000">Void Heart - 300,000</button>';
		
		// Re-wire the button
		const voidHeartBtn = luckPresetsDropdown.querySelector('.preset-btn[data-luck]');
		if (voidHeartBtn) {
			voidHeartBtn.addEventListener('click', () => {
				const luckInput = document.getElementById('luckInput');
				if (luckInput) {
					luckInput.value = '300000';
					luckInput.dispatchEvent(new Event('input', { bubbles: true }));
				}
				// Close dropdown
				const luckPresetsBtn = document.getElementById('luckPresetsBtn');
				if (luckPresetsDropdown) luckPresetsDropdown.classList.remove('open');
				if (luckPresetsBtn) luckPresetsBtn.classList.remove('active');
				playSound('clickSound');
			});
		}
	} else {
		// Restore original presets
		if (originalLuckPresetsHTML) {
			luckPresetsDropdown.innerHTML = originalLuckPresetsHTML;
			
			// Re-wire all luck preset buttons
			document.querySelectorAll('.preset-btn[data-luck]').forEach(btn => {
				btn.addEventListener('click', () => {
					const luckInput = document.getElementById('luckInput');
					const oblivionToggle = document.getElementById('oblivionToggle');
					const duneToggle = document.getElementById('duneToggle');
					if (luckInput) {
						luckInput.value = btn.dataset.luck;
						luckInput.dispatchEvent(new Event('input', { bubbles: true }));
					}
					// If this preset has data-oblivion, enable oblivion and disable dune
					if (btn.dataset.oblivion === 'true') {
						if (oblivionToggle) oblivionToggle.checked = true;
						if (duneToggle) duneToggle.checked = false;
						updateSpecialToggleStates();
					}
					// If this preset has data-dune, enable dune and disable oblivion
					if (btn.dataset.dune === 'true') {
						if (duneToggle) duneToggle.checked = true;
						if (oblivionToggle) oblivionToggle.checked = false;
						updateSpecialToggleStates();
					}
					// Close dropdown
					const luckPresetsBtn = document.getElementById('luckPresetsBtn');
					if (luckPresetsDropdown) luckPresetsDropdown.classList.remove('open');
					if (luckPresetsBtn) luckPresetsBtn.classList.remove('active');
					playSound('clickSound');
				});
			});
		}
	}
}

/**
 * Disable/enable special aura toggles for LIMBO
 * @param {boolean} isLimbo - Whether LIMBO biome is selected
 */
function handleLimboSpecialToggles(isLimbo) {
	const oblivionToggle = document.getElementById('oblivionToggle');
	const duneToggle = document.getElementById('duneToggle');
	
	if (isLimbo) {
		// Disable and uncheck both toggles
		if (oblivionToggle) {
			oblivionToggle.checked = false;
			oblivionToggle.disabled = true;
		}
		if (duneToggle) {
			duneToggle.checked = false;
			duneToggle.disabled = true;
		}
	} else {
		// Re-enable toggles (but respect mutual exclusivity)
		if (oblivionToggle) oblivionToggle.disabled = false;
		if (duneToggle) duneToggle.disabled = false;
		// Update states to ensure mutual exclusivity is applied
		updateSpecialToggleStates();
	}
}

// Wire panel toggle buttons
document.addEventListener('DOMContentLoaded', () => {
	const rollOptionsBtn = document.getElementById('rollOptionsBtn');
	const settingsBtn = document.getElementById('settingsBtn');
	if (rollOptionsBtn) rollOptionsBtn.addEventListener('click', () => togglePanel('rollOptionsPanelContainer', 'rollOptionsBtn'));
	if (settingsBtn) settingsBtn.addEventListener('click', () => togglePanel('settingsPanel', 'settingsBtn'));
	
	// Wire preset dropdown toggles
	const rollPresetsBtn = document.getElementById('rollPresetsBtn');
	const rollPresetsDropdown = document.getElementById('rollPresetsDropdown');
	const luckPresetsBtn = document.getElementById('luckPresetsBtn');
	const luckPresetsDropdown = document.getElementById('luckPresetsDropdown');
	
	if (rollPresetsBtn && rollPresetsDropdown) {
		rollPresetsBtn.addEventListener('click', () => {
			const isOpen = rollPresetsDropdown.classList.contains('open');
			rollPresetsDropdown.classList.toggle('open', !isOpen);
			rollPresetsBtn.classList.toggle('active', !isOpen);
			// Close other dropdown
			if (luckPresetsDropdown) luckPresetsDropdown.classList.remove('open');
			if (luckPresetsBtn) luckPresetsBtn.classList.remove('active');
		});
	}
	
	if (luckPresetsBtn && luckPresetsDropdown) {
		luckPresetsBtn.addEventListener('click', () => {
			const isOpen = luckPresetsDropdown.classList.contains('open');
			luckPresetsDropdown.classList.toggle('open', !isOpen);
			luckPresetsBtn.classList.toggle('active', !isOpen);
			// Close other dropdown
			if (rollPresetsDropdown) rollPresetsDropdown.classList.remove('open');
			if (rollPresetsBtn) rollPresetsBtn.classList.remove('active');
		});
	}
	
	// Wire roll preset buttons
	document.querySelectorAll('.preset-btn[data-rolls]').forEach(btn => {
		btn.addEventListener('click', () => {
			const rollsInput = document.getElementById('rollsInput');
			if (rollsInput) {
				rollsInput.value = btn.dataset.rolls;
				rollsInput.dispatchEvent(new Event('input', { bubbles: true }));
			}
			// Close dropdown
			if (rollPresetsDropdown) rollPresetsDropdown.classList.remove('open');
			if (rollPresetsBtn) rollPresetsBtn.classList.remove('active');
			playSound('clickSound');
		});
	});
	
	// Wire luck preset buttons
	document.querySelectorAll('.preset-btn[data-luck]').forEach(btn => {
		btn.addEventListener('click', () => {
			const luckInput = document.getElementById('luckInput');
			const oblivionToggle = document.getElementById('oblivionToggle');
			const duneToggle = document.getElementById('duneToggle');
			if (luckInput) {
				luckInput.value = btn.dataset.luck;
				luckInput.dispatchEvent(new Event('input', { bubbles: true }));
			}
			// If this preset has data-oblivion, enable oblivion and disable dune
			if (btn.dataset.oblivion === 'true') {
				if (oblivionToggle) oblivionToggle.checked = true;
				if (duneToggle) duneToggle.checked = false;
				updateSpecialToggleStates();
			}
			// If this preset has data-dune, enable dune and disable oblivion
			if (btn.dataset.dune === 'true') {
				if (duneToggle) duneToggle.checked = true;
				if (oblivionToggle) oblivionToggle.checked = false;
				updateSpecialToggleStates();
			}
			// Close dropdown
			if (luckPresetsDropdown) luckPresetsDropdown.classList.remove('open');
			if (luckPresetsBtn) luckPresetsBtn.classList.remove('active');
			playSound('clickSound');
		});
	});
	
	// Wire quick biome buttons
	document.querySelectorAll('.quick-biome-btn[data-biome]').forEach(btn => {
		btn.addEventListener('click', () => {
			const biomeSelect = document.getElementById('biomeSelect');
			if (biomeSelect) {
				biomeSelect.value = btn.dataset.biome;
				biomeSelect.dispatchEvent(new Event('change', { bubbles: true }));
			}
			playSound('clickSound');
		});
	});
	
	// Wire biome select change handler for LIMBO special handling
	const biomeSelect = document.getElementById('biomeSelect');
	if (biomeSelect) {
		biomeSelect.addEventListener('change', (e) => {
			handleBiomeChange(e.target.value);
		});
	}
	
	// Wire special aura toggle mutual exclusivity
	const oblivionToggle = document.getElementById('oblivionToggle');
	const duneToggle = document.getElementById('duneToggle');
	
	function updateSpecialToggleStates() {
		const oblivionChecked = oblivionToggle && oblivionToggle.checked;
		const duneChecked = duneToggle && duneToggle.checked;
		
		if (oblivionToggle) {
			oblivionToggle.disabled = duneChecked;
		}
		if (duneToggle) {
			duneToggle.disabled = oblivionChecked;
		}
	}
	
	if (oblivionToggle) {
		oblivionToggle.addEventListener('change', updateSpecialToggleStates);
	}
	if (duneToggle) {
		duneToggle.addEventListener('change', updateSpecialToggleStates);
	}
});

/**
 * Close intro screen and lighten background
 */
function closeIntro() {
    bgVideo.style.filter = 'brightness(0.3)';
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
