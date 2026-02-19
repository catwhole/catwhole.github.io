// ==================== AUDIO SYSTEM ====================
const AUDIO_CONFIG = {
    sfxVolume: 0.1,
    bgmVolume: 0.1,
    sfxEnabled: true,
    bgmEnabled: true,
};

let activeFadeIntervals = [];

let currentRaritySfxEl = null;

let currentBgmId = 'bgmDefault';

let baseLuckValue = 1;

const MAX_ROLLS_AND_LUCK = 10000000000;

let biomeSwitchLocked = false;
let biomeSwitchUnlockTimer = null;
let lastAcceptedBiome = null;
window._biomeSwitchLocked = false;
window.rollInProgress = false;
window.abortRollRequested = false;

// ==================== COMPATIBILITY CHECK ====================
function checkCompatibility() {
    const issues = [];
    
    const isWebKit = 'WebkitAppearance' in document.documentElement.style;
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    const isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
    const isEdge = /Edg/.test(navigator.userAgent);
    const isOpera = /OPR/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    
    if (!isWebKit && !isChrome && !isSafari && !isEdge && !isOpera) {
        if (isFirefox) {
            issues.push('You are using <strong>Firefox</strong>, which may not fully support all visual effects on this site.');
        } else {
            issues.push('Your browser may not support all features. For the best experience, use <strong>Chrome</strong>, <strong>Edge</strong>, <strong>Safari</strong>, or <strong>Opera</strong>.');
        }
    }
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    
    if (isMobile || (isTouchDevice && width <= 1024)) {
        issues.push('You are using a <strong>mobile device</strong>. This site is optimized for desktop browsers.');
    }
    
    if (!isMobile && aspectRatio > 3) {
        issues.push('Your screen has an <strong>ultra-wide aspect ratio</strong>. Layout may not display optimally.');
    } else if (!isMobile && aspectRatio < 0.4) {
        issues.push('Your screen has an <strong>ultra-tall aspect ratio</strong>. Layout may not display optimally.');
    }
    
    if (issues.length > 0) {
        const modal = document.getElementById('compatibilityModal');
        const message = document.getElementById('compatibilityMessage');
        const dismissBtn = document.getElementById('compatibilityDismiss');
        
        if (modal && message && dismissBtn) {
            let messageHTML = '<strong>Compatibility Notice</strong><br><br>';
            messageHTML += 'The following issues were detected:<br><br>';
            messageHTML += '<ul style="text-align: left; margin: 0 auto; max-width: 350px;">';
            issues.forEach(issue => {
                messageHTML += '<li style="margin-bottom: 8px;">' + issue + '</li>';
            });
            messageHTML += '</ul><br>';
            messageHTML += 'The site may not function or display as intended.';
            
            message.innerHTML = messageHTML;
            modal.classList.remove('hidden');

            dismissBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
                playSound('clickSound');
                showDisclaimerModal();
            }, { once: true });
        }
    } else {
        showDisclaimerModal();
    }
}

document.addEventListener('DOMContentLoaded', checkCompatibility);

function showDisclaimerModal() {
    const modal = document.getElementById('disclaimerModal');
    const dismissBtn = document.getElementById('disclaimerDismiss');
    if (!modal || !dismissBtn) return;
    modal.classList.remove('hidden');
    dismissBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        playSound('clickSound');
    }, { once: true });
}

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

function switchBgm(trackId, fadeDuration = 1000, silenceDelay = 0) {
    currentBgmId = trackId;
    if (!AUDIO_CONFIG.bgmEnabled) {
        const allBgm = document.querySelectorAll('[data-bgm]');
        allBgm.forEach(track => {
            track.pause();
            track.currentTime = 0;
        });
        return;
    }
    
    const track = document.getElementById(trackId);
    if (!track) return;
    
    activeFadeIntervals.forEach(interval => clearInterval(interval));
    activeFadeIntervals = [];
    
    const allBgm = document.querySelectorAll('[data-bgm]');
    const fadeStep = 50;
    const steps = Math.max(1, fadeDuration / fadeStep);
    
    let fadeOutStep = 0;
    const fadeOutInterval = setInterval(() => {
        fadeOutStep++;
        const progress = Math.min(1, fadeOutStep / steps);
        
        allBgm.forEach(bgmTrack => {
            if (bgmTrack.id !== trackId) {
                bgmTrack.volume = Math.max(0, AUDIO_CONFIG.bgmVolume * (1 - progress));
            }
        });
        
        if (fadeOutStep >= steps) {
            clearInterval(fadeOutInterval);
            activeFadeIntervals = activeFadeIntervals.filter(i => i !== fadeOutInterval);
            allBgm.forEach(bgmTrack => {
                if (bgmTrack.id !== trackId) {
                    bgmTrack.pause();
                    bgmTrack.currentTime = 0;
                    bgmTrack.volume = AUDIO_CONFIG.bgmVolume;
                }
            });
            
            setTimeout(() => {
                playNewTrack();
            }, silenceDelay);
        }
    }, fadeStep);
    
    activeFadeIntervals.push(fadeOutInterval);
    
    function playNewTrack() {
        track.currentTime = 0;
        track.volume = 0;
        track.loop = true;
        const playPromise = track.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                let fadeInStep = 0;
                const fadeInInterval = setInterval(() => {
                    fadeInStep++;
                    const progress = Math.min(1, fadeInStep / steps);
                    track.volume = AUDIO_CONFIG.bgmVolume * progress;
                    
                    if (fadeInStep >= steps) {
                        clearInterval(fadeInInterval);
                        activeFadeIntervals = activeFadeIntervals.filter(i => i !== fadeInInterval);
                        track.volume = AUDIO_CONFIG.bgmVolume;
                    }
                }, fadeStep);
                
                activeFadeIntervals.push(fadeInInterval);
            }).catch(err => {
                console.log('BGM autoplay blocked:', trackId, err);
                track.volume = AUDIO_CONFIG.bgmVolume;
                track.currentTime = 0;
                track.pause();
            });
        }
    }
}

let _bgVideoSwitchTimeout = null;
let _bgVideoLoadedHandler = null;
let _bgVideoTargetBrightness = 0.3;

function switchBackgroundVideo(videoSrc, fadeDuration = 1000) {
    const bgVideo = document.querySelector('.background-video');
    if (!bgVideo) return;
    
    const currentSrc = bgVideo.querySelector('source').src;
    const newFullSrc = new URL(videoSrc, window.location.href).href;
    if (currentSrc === newFullSrc) return;
    
    if (_bgVideoSwitchTimeout) {
        clearTimeout(_bgVideoSwitchTimeout);
        _bgVideoSwitchTimeout = null;
    }
    if (_bgVideoLoadedHandler) {
        bgVideo.removeEventListener('loadeddata', _bgVideoLoadedHandler);
        _bgVideoLoadedHandler = null;
    }
    
    const targetBrightness = _bgVideoTargetBrightness;
    
    bgVideo.style.transition = `filter ${fadeDuration}ms ease-out`;
    bgVideo.style.filter = 'brightness(0)';
    
    _bgVideoSwitchTimeout = setTimeout(() => {
        _bgVideoSwitchTimeout = null;
        const source = bgVideo.querySelector('source');
        if (source) {
            source.src = videoSrc;
            bgVideo.load();
            
            _bgVideoLoadedHandler = function onLoaded() {
                bgVideo.removeEventListener('loadeddata', _bgVideoLoadedHandler);
                _bgVideoLoadedHandler = null;
                bgVideo.style.filter = `brightness(${targetBrightness})`;
            };
            bgVideo.addEventListener('loadeddata', _bgVideoLoadedHandler);
            
            bgVideo.play().catch(err => console.log('Video play failed:', err));
        }
    }, fadeDuration);
}

function setAudioVolumes(sfxVol, bgmVol) {
    if (sfxVol !== undefined) AUDIO_CONFIG.sfxVolume = Math.max(0, Math.min(1, sfxVol));
    if (bgmVol !== undefined) AUDIO_CONFIG.bgmVolume = Math.max(0, Math.min(1, bgmVol));
    
    const allBgm = document.querySelectorAll('[data-bgm]');
    allBgm.forEach(track => {
        track.volume = AUDIO_CONFIG.bgmVolume;
    });
}

function toggleSfxSlider() {
    const sfxContainer = document.getElementById('sfxSliderContainer');
    const bgmContainer = document.getElementById('bgmSliderContainer');
    const sfxBtn = document.getElementById('sfxVolumeBtn');
    const bgmBtn = document.getElementById('bgmVolumeBtn');
    if (sfxContainer) {
        const isVisible = sfxContainer.style.display !== 'none';
        sfxContainer.style.display = isVisible ? 'none' : 'flex';
        if (isVisible) {
            if (sfxBtn) sfxBtn.removeAttribute('data-enabled');
            if (bgmBtn) bgmBtn.removeAttribute('data-enabled');
        } else {
            if (sfxBtn) sfxBtn.setAttribute('data-enabled', 'true');
            if (bgmBtn) bgmBtn.setAttribute('data-enabled', 'false');
            if (bgmContainer) bgmContainer.style.display = 'none';
        }
    }
}

function toggleBgmSlider() {
    const sfxContainer = document.getElementById('sfxSliderContainer');
    const bgmContainer = document.getElementById('bgmSliderContainer');
    const sfxBtn = document.getElementById('sfxVolumeBtn');
    const bgmBtn = document.getElementById('bgmVolumeBtn');
    if (bgmContainer) {
        const isVisible = bgmContainer.style.display !== 'none';
        bgmContainer.style.display = isVisible ? 'none' : 'flex';
        if (isVisible) {
            if (sfxBtn) sfxBtn.removeAttribute('data-enabled');
            if (bgmBtn) bgmBtn.removeAttribute('data-enabled');
        } else {
            if (bgmBtn) bgmBtn.setAttribute('data-enabled', 'true');
            if (sfxBtn) sfxBtn.setAttribute('data-enabled', 'false');
            if (sfxContainer) sfxContainer.style.display = 'none';
        }
    }
}

function updateSfxVolume(value) {
    const percent = parseInt(value);
    const actualVolume = (percent / 100) * 0.5;
    setAudioVolumes(actualVolume, undefined);
    const label = document.getElementById('sfxVolumeLabel');
    if (label) label.textContent = percent + '%';
    
    if (currentRaritySfxEl) {
        currentRaritySfxEl.volume = actualVolume;
    }
}

function updateBgmVolume(value) {
    const percent = parseInt(value);
    const actualVolume = (percent / 100) * 0.5;
    setAudioVolumes(undefined, actualVolume);
    const label = document.getElementById('bgmVolumeLabel');
    if (label) label.textContent = percent + '%';
}

function muteSfx() {
    const slider = document.getElementById('sfxVolumeSlider');
    if (slider) {
        slider.value = 0;
        updateSfxVolume(0);
    }
}

function muteBgm() {
    const slider = document.getElementById('bgmVolumeSlider');
    if (slider) {
        slider.value = 0;
        updateBgmVolume(0);
    }
}

// ==================== INTERACTIVE ELEMENT SFX SYSTEM ====================

document.addEventListener('mouseenter', (e) => {
    const target = e.target;
    if (isInteractiveElement(target)) {
        playSound('hoverSound');
    }
}, true);

document.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.closest && target.closest('#rollButton')) return;
    if (isInteractiveElement(target)) {
        playSound('clickSound');
    }
}, true);

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

if (sfxVolumeSlider) {
    sfxVolumeSlider.value = 20;
    sfxVolumeSlider.addEventListener('input', (e) => updateSfxVolume(e.target.value));
}
if (bgmVolumeSlider) {
    bgmVolumeSlider.value = 20;
    bgmVolumeSlider.addEventListener('input', (e) => updateBgmVolume(e.target.value));
}

if (sfxVolumeBtn) sfxVolumeBtn.addEventListener('click', toggleSfxSlider);
if (bgmVolumeBtn) bgmVolumeBtn.addEventListener('click', toggleBgmSlider);

const sfxMuteBtn = document.getElementById('sfxMuteBtn');
const bgmMuteBtn = document.getElementById('bgmMuteBtn');
if (sfxMuteBtn) sfxMuteBtn.addEventListener('click', () => muteSfx());
if (bgmMuteBtn) bgmMuteBtn.addEventListener('click', () => muteBgm());

switchBgm('bgmDefault');

let bgmStarted = false;

function startBgmOnInteraction() {
    if (bgmStarted) return;
    bgmStarted = true;
    
    const bgm = document.getElementById(currentBgmId) || document.getElementById('bgmDefault');
    if (bgm && AUDIO_CONFIG.bgmEnabled && bgm.paused) {
        bgm.play().catch(err => console.log('BGM play on interaction failed:', err));
    }
}

document.addEventListener('click', startBgmOnInteraction, { once: true });
document.addEventListener('touchstart', startBgmOnInteraction, { once: true });

startButton.addEventListener('mouseenter', () => {
    playSound('hoverSound');
});

startButton.addEventListener('click', closeIntro);

// ==================== PANEL TOGGLE ====================
let wasSingleResultShowing = false;

function togglePanel(panelId, btnId) {
	const panel = document.getElementById(panelId);
	const btn = document.getElementById(btnId);
	const isOpen = !!(panel && panel.classList.contains('open'));
	if (!isOpen && typeof window !== 'undefined' && window.rollInProgress) return;
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
		wasSingleResultShowing = singleResult && singleResult.style.display === 'flex';
		panel.classList.add('open');
		if (btn) btn.setAttribute('data-enabled', 'true');
		if (btnId === 'rollOptionsBtn' && settingsBtn) settingsBtn.setAttribute('data-enabled', 'false');
		if (btnId === 'settingsBtn' && rollBtn) rollBtn.setAttribute('data-enabled', 'false');
		if (resultsBox) resultsBox.style.display = 'none';
		if (singleResult && wasSingleResultShowing) {
			singleResult.style.visibility = 'hidden';
			singleResult.classList.remove('flash');
		}
	} else {
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
let originalLuckPresetsHTML = null;

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
	'cyberspace': {
		bgm: 'bgmCyberspace',
		video: 'Media/cyberspace.mp4',
		modeClass: 'cyberspace-mode'
	},
	'corruption': {
		bgm: 'bgmCorruption',
		video: 'Media/corruption.mp4',
		modeClass: null
	},
	'day': {
		bgm: 'bgmDay',
		video: 'Media/day.mp4',
		modeClass: null
	},
	'heaven': {
		bgm: 'bgmHeaven',
		video: 'Media/heaven.mp4',
		modeClass: null
	},
	'hell': {
		bgm: 'bgmHell',
		video: 'Media/hell.mp4',
		modeClass: null
	},
	'night': {
		bgm: 'bgmNight',
		video: 'Media/night.mp4',
		modeClass: null
	},
	'null': {
		bgm: 'bgmNull',
		video: 'Media/null.mp4',
		modeClass: null
	},
	'rainy': {
		bgm: 'bgmRainy',
		video: 'Media/rainy.mp4',
		modeClass: null
	},
	'sandstorm': {
		bgm: 'bgmSandstorm',
		video: 'Media/sandstorm.mp4',
		modeClass: null
	},
	'snowy': {
		bgm: 'bgmSnowy',
		video: 'Media/snowy.mp4',
		modeClass: null
	},
	'starfall': {
		bgm: 'bgmStarfall',
		video: 'Media/starfall.mp4',
		modeClass: null
	},
	'windy': {
		bgm: 'bgmWindy',
		video: 'Media/windy.mp4',
		modeClass: null
	},
	'default': {
		bgm: 'bgmMain',
		video: 'Media/normal day.mp4',
		modeClass: null
	}
};

function handleBiomeChange(biome) {
	if (biomeSwitchLocked) return;

	lastAcceptedBiome = biome || null;
	biomeSwitchLocked = true;
	window._biomeSwitchLocked = true;
	if (biomeSwitchUnlockTimer) clearTimeout(biomeSwitchUnlockTimer);
	biomeSwitchUnlockTimer = setTimeout(() => {
		biomeSwitchLocked = false;
		window._biomeSwitchLocked = false;
		biomeSwitchUnlockTimer = null;
	}, 1000);

	const config = BIOME_CONFIG[biome] || BIOME_CONFIG['default'];
	const isLimbo = biome === 'limbo';
	
	Object.values(BIOME_CONFIG).forEach(cfg => {
		if (cfg && cfg.modeClass) document.body.classList.remove(cfg.modeClass);
	});
	
	if (config.modeClass) {
		document.body.classList.add(config.modeClass);
	}
	
	if (currentBgmId !== config.bgm) {
		switchBgm(config.bgm, 1000, 0);
		switchBackgroundVideo(config.video, 1000);
	}
	
	handleLimboLuckPresets(isLimbo);
	
	handleLimboSpecialToggles(isLimbo);
} 

function handleLimboLuckPresets(isLimbo) {
	const luckPresetsDropdown = document.getElementById('luckPresetsDropdown');
	const davesHopeSection = document.getElementById('davesHopeSection');
	const davesHopeSelect = document.getElementById('davesHopeSelect');
	if (!luckPresetsDropdown) return;
	
	if (isLimbo) {
		if (davesHopeSection) davesHopeSection.style.display = 'block';
		
		if (!originalLuckPresetsHTML) {
			originalLuckPresetsHTML = luckPresetsDropdown.innerHTML;
		}
		
		luckPresetsDropdown.innerHTML = '<button class="preset-btn" data-luck="300000">Void Heart - 300,000</button>';
		
		const voidHeartBtn = luckPresetsDropdown.querySelector('.preset-btn[data-luck]');
		if (voidHeartBtn) {
			voidHeartBtn.addEventListener('click', () => {
				const luckInput = document.getElementById('luckInput');
				const vipSelect = document.getElementById('vipSelect');
				const davesHopeSelect = document.getElementById('davesHopeSelect');
				if (luckInput) {
					baseLuckValue = 300000;
					const vipMultiplier = vipSelect ? parseFloat(vipSelect.value) : 1;
					const davesHopeMultiplier = davesHopeSelect ? parseFloat(davesHopeSelect.value) : 1;
					const computed = Math.floor(baseLuckValue * vipMultiplier * davesHopeMultiplier);
					luckInput.value = String(Math.min(MAX_ROLLS_AND_LUCK, computed));
					luckInput.dispatchEvent(new Event('input', { bubbles: true }));
				}
				const luckPresetsBtn = document.getElementById('luckPresetsBtn');
				if (luckPresetsDropdown) luckPresetsDropdown.classList.remove('open');
				if (luckPresetsBtn) luckPresetsBtn.classList.remove('active');
				playSound('clickSound');
			});
		}
	} else {
		if (davesHopeSection) davesHopeSection.style.display = 'none';
		if (davesHopeSelect) davesHopeSelect.value = '1';
		
		const luckInput = document.getElementById('luckInput');
		const vipSelect = document.getElementById('vipSelect');
		if (luckInput) {
			const vipMultiplier = vipSelect ? parseFloat(vipSelect.value) : 1;
			luckInput.value = String(Math.min(MAX_ROLLS_AND_LUCK, Math.floor(baseLuckValue * vipMultiplier)));
			luckInput.dispatchEvent(new Event('input', { bubbles: true }));
		}
		
		if (originalLuckPresetsHTML) {
			luckPresetsDropdown.innerHTML = originalLuckPresetsHTML;
			
			document.querySelectorAll('.preset-btn[data-luck]').forEach(btn => {
				btn.addEventListener('click', () => {
					const luckInput = document.getElementById('luckInput');
					const oblivionToggle = document.getElementById('oblivionToggle');
					const duneToggle = document.getElementById('duneToggle');
					const vipSelect = document.getElementById('vipSelect');
					const davesHopeSelect = document.getElementById('davesHopeSelect');
					if (luckInput) {
						baseLuckValue = parseInt(btn.dataset.luck);
						const vipMultiplier = vipSelect ? parseFloat(vipSelect.value) : 1;
						const davesHopeMultiplier = davesHopeSelect ? parseFloat(davesHopeSelect.value) : 1;
					luckInput.value = String(Math.min(MAX_ROLLS_AND_LUCK, Math.floor(baseLuckValue * vipMultiplier * davesHopeMultiplier)));
						luckInput.dispatchEvent(new Event('input', { bubbles: true }));
					}
					if (btn.dataset.oblivion === 'true') {
						if (oblivionToggle) oblivionToggle.checked = true;
						if (duneToggle) duneToggle.checked = false;
						updateSpecialToggleStates();
					}
					if (btn.dataset.dune === 'true') {
						if (duneToggle) duneToggle.checked = true;
						if (oblivionToggle) oblivionToggle.checked = false;
						updateSpecialToggleStates();
					}
					const luckPresetsBtn = document.getElementById('luckPresetsBtn');
					if (luckPresetsDropdown) luckPresetsDropdown.classList.remove('open');
					if (luckPresetsBtn) luckPresetsBtn.classList.remove('active');
					playSound('clickSound');
				});
			});
		}
	}
}

function updateSpecialToggleStates() {
	const oblivionToggle = document.getElementById('oblivionToggle');
	const duneToggle = document.getElementById('duneToggle');
	const oblivionChecked = oblivionToggle && oblivionToggle.checked;
	const duneChecked = duneToggle && duneToggle.checked;
	if (oblivionToggle) oblivionToggle.disabled = duneChecked;
	if (duneToggle) duneToggle.disabled = oblivionChecked;
}

function handleLimboSpecialToggles(isLimbo) {
	const oblivionToggle = document.getElementById('oblivionToggle');
	const duneToggle = document.getElementById('duneToggle');
	
	if (isLimbo) {
		if (oblivionToggle) {
			oblivionToggle.checked = false;
			oblivionToggle.disabled = true;
		}
		if (duneToggle) {
			duneToggle.checked = false;
			duneToggle.disabled = true;
		}
	} else {
		if (oblivionToggle) oblivionToggle.disabled = false;
		if (duneToggle) duneToggle.disabled = false;
		updateSpecialToggleStates();
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const rollOptionsBtn = document.getElementById('rollOptionsBtn');
	const settingsBtn = document.getElementById('settingsBtn');
	const panelCloseBtn = document.getElementById('panelCloseBtn');
	
	if (rollOptionsBtn) rollOptionsBtn.addEventListener('click', () => togglePanel('rollOptionsPanelContainer', 'rollOptionsBtn'));
	if (settingsBtn) settingsBtn.addEventListener('click', () => togglePanel('settingsPanel', 'settingsBtn'));
	
	if (panelCloseBtn) {
		panelCloseBtn.addEventListener('click', () => {
			togglePanel('rollOptionsPanelContainer', 'rollOptionsBtn');
			playSound('clickSound');
		});
	}
	
	const rollPresetsBtn = document.getElementById('rollPresetsBtn');
	const rollPresetsDropdown = document.getElementById('rollPresetsDropdown');
	const luckPresetsBtn = document.getElementById('luckPresetsBtn');
	const luckPresetsDropdown = document.getElementById('luckPresetsDropdown');
	
	if (rollPresetsBtn && rollPresetsDropdown) {
		rollPresetsBtn.addEventListener('click', () => {
			const isOpen = rollPresetsDropdown.classList.contains('open');
			if (!isOpen && typeof window !== 'undefined' && window.rollInProgress) return;
			rollPresetsDropdown.classList.toggle('open', !isOpen);
			rollPresetsBtn.classList.toggle('active', !isOpen);
			if (luckPresetsDropdown) luckPresetsDropdown.classList.remove('open');
			if (luckPresetsBtn) luckPresetsBtn.classList.remove('active');
		});
	}
	
	if (luckPresetsBtn && luckPresetsDropdown) {
		luckPresetsBtn.addEventListener('click', () => {
			const isOpen = luckPresetsDropdown.classList.contains('open');
			if (!isOpen && typeof window !== 'undefined' && window.rollInProgress) return;
			luckPresetsDropdown.classList.toggle('open', !isOpen);
			luckPresetsBtn.classList.toggle('active', !isOpen);
			if (rollPresetsDropdown) rollPresetsDropdown.classList.remove('open');
			if (rollPresetsBtn) rollPresetsBtn.classList.remove('active');
		});
	}
	
	document.querySelectorAll('.preset-btn[data-rolls]').forEach(btn => {
		btn.addEventListener('click', () => {
			if (typeof window !== 'undefined' && window.rollInProgress) return;
			const rollsInput = document.getElementById('rollsInput');
			if (rollsInput) {
				rollsInput.value = String(Math.min(MAX_ROLLS_AND_LUCK, Number(btn.dataset.rolls)));
				rollsInput.dispatchEvent(new Event('input', { bubbles: true }));
			}
			if (rollPresetsDropdown) rollPresetsDropdown.classList.remove('open');
			if (rollPresetsBtn) rollPresetsBtn.classList.remove('active');
			playSound('clickSound');
		});
	});
	
	document.querySelectorAll('.preset-btn[data-luck]').forEach(btn => {
		btn.addEventListener('click', () => {
			if (typeof window !== 'undefined' && window.rollInProgress) return;
			const luckInput = document.getElementById('luckInput');
			const oblivionToggle = document.getElementById('oblivionToggle');
			const duneToggle = document.getElementById('duneToggle');
			const vipSelect = document.getElementById('vipSelect');
			const davesHopeSelect = document.getElementById('davesHopeSelect');
			if (luckInput) {
				baseLuckValue = parseInt(btn.dataset.luck);
				const vipMultiplier = vipSelect ? parseFloat(vipSelect.value) : 1;
				const davesHopeMultiplier = davesHopeSelect ? parseFloat(davesHopeSelect.value) : 1;
			luckInput.value = String(Math.min(MAX_ROLLS_AND_LUCK, Math.floor(baseLuckValue * vipMultiplier * davesHopeMultiplier)));
				luckInput.dispatchEvent(new Event('input', { bubbles: true }));
			}
			if (btn.dataset.oblivion === 'true') {
				if (oblivionToggle) oblivionToggle.checked = true;
				if (duneToggle) duneToggle.checked = false;
				updateSpecialToggleStates();
			}
			if (btn.dataset.dune === 'true') {
				if (duneToggle) duneToggle.checked = true;
				if (oblivionToggle) oblivionToggle.checked = false;
				updateSpecialToggleStates();
			}
			if (luckPresetsDropdown) luckPresetsDropdown.classList.remove('open');
			if (luckPresetsBtn) luckPresetsBtn.classList.remove('active');
			playSound('clickSound');
		});
	});
	
	const stopRollBtn = document.getElementById('stopRollBtn');
	if (stopRollBtn) {
		stopRollBtn.addEventListener('click', () => {
			if (typeof window !== 'undefined') window.abortRollRequested = true;
			stopRollBtn.disabled = true;
			playSound('clickSound');
		});
	}

	document.querySelectorAll('.quick-biome-btn[data-biome]').forEach(btn => {
		btn.addEventListener('click', () => {
			if (biomeSwitchLocked || (typeof window !== 'undefined' && window.rollInProgress)) return;
			const biomeSelect = document.getElementById('biomeSelect');
			if (biomeSelect) {
				biomeSelect.value = btn.dataset.biome;
				biomeSelect.dispatchEvent(new Event('change', { bubbles: true }));
			}
			playSound('clickSound');
		});
	});
	
	const biomeSelect = document.getElementById('biomeSelect');
	if (biomeSelect) {
		lastAcceptedBiome = biomeSelect.value || null;
		biomeSelect.addEventListener('change', (e) => {
			const requestedBiome = e.target.value || '';
			if (typeof window !== 'undefined' && window.rollInProgress) {
				e.target.value = lastAcceptedBiome || '';
				return;
			}
			if (biomeSwitchLocked) {
				e.target.value = lastAcceptedBiome || '';
				return;
			}
			handleBiomeChange(requestedBiome);
		});
	}
	
	const oblivionToggle = document.getElementById('oblivionToggle');
	const duneToggle = document.getElementById('duneToggle');
	
	if (oblivionToggle) {
		oblivionToggle.addEventListener('change', updateSpecialToggleStates);
	}
	if (duneToggle) {
		duneToggle.addEventListener('change', updateSpecialToggleStates);
	}
	
	const vipSelect = document.getElementById('vipSelect');
	const luckInput = document.getElementById('luckInput');
	const davesHopeSelect = document.getElementById('davesHopeSelect');
	
	if (vipSelect && luckInput) {
		vipSelect.addEventListener('change', () => {
			const vipMultiplier = parseFloat(vipSelect.value);
			const davesHopeMultiplier = davesHopeSelect ? parseFloat(davesHopeSelect.value) : 1;
			luckInput.value = String(Math.min(MAX_ROLLS_AND_LUCK, Math.floor(baseLuckValue * vipMultiplier * davesHopeMultiplier)));
			luckInput.dispatchEvent(new Event('input', { bubbles: true }));
			playSound('clickSound');
		});
		
		luckInput.addEventListener('input', () => {
			const currentVipMultiplier = parseFloat(vipSelect.value);
			const currentDavesHopeMultiplier = davesHopeSelect ? parseFloat(davesHopeSelect.value) : 1;
			if (currentVipMultiplier === 1 && currentDavesHopeMultiplier === 1) {
				baseLuckValue = parseInt(luckInput.value) || 1;
			}
		});
		
		luckInput.addEventListener('change', () => {
			const currentVipMultiplier = parseFloat(vipSelect.value);
			const currentDavesHopeMultiplier = davesHopeSelect ? parseFloat(davesHopeSelect.value) : 1;
			const currentValue = parseInt(luckInput.value) || 1;
			baseLuckValue = Math.floor(currentValue / (currentVipMultiplier * currentDavesHopeMultiplier));
		});
	}
	
	if (davesHopeSelect && luckInput) {
		davesHopeSelect.addEventListener('change', () => {
			const vipMultiplier = vipSelect ? parseFloat(vipSelect.value) : 1;
			const davesHopeMultiplier = parseFloat(davesHopeSelect.value);
			luckInput.value = String(Math.min(MAX_ROLLS_AND_LUCK, Math.floor(baseLuckValue * vipMultiplier * davesHopeMultiplier)));
			luckInput.dispatchEvent(new Event('input', { bubbles: true }));
			playSound('clickSound');
		});
	}

	const auraClassStopBtn = document.getElementById('auraClassStopBtn');
	const auraClassStopList = document.getElementById('auraClassStopList');
	if (auraClassStopBtn && auraClassStopList) {
		auraClassStopBtn.addEventListener('click', () => {
			const isOpen = auraClassStopList.classList.contains('open');
			if (!isOpen && typeof window !== 'undefined' && window.rollInProgress) return;
			auraClassStopList.classList.toggle('open', !isOpen);
			auraClassStopBtn.classList.toggle('active', !isOpen);
		});
	}

	document.addEventListener('click', (e) => {
		const el = e.target.closest('button, label, select, input');
		if (!el) return;
		if (el.id === 'autoRollBtn') return;

		const isMenuControl =
			el.closest('.menu-panel') ||
			el.closest('.menu-panel-container') ||
			el.closest('.toggle-controls') ||
			el.classList.contains('preset-btn') ||
			el.classList.contains('btn-preset-toggle') ||
			el.classList.contains('panel-close-btn') ||
			el.classList.contains('quick-biome-btn') ||
			el.classList.contains('btn-toggle') ||
			el.id === 'startButton';

		if (isMenuControl && typeof stopAutoRoll === 'function') {
			if (typeof autoRollEnabled !== 'undefined' && autoRollEnabled) stopAutoRoll();
		}
	});
});

function closeIntro() {
    _bgVideoTargetBrightness = 0.3;
    bgVideo.style.filter = 'brightness(0.3)';
    introScreen.style.animation = 'fadeOut 0.6s ease-out forwards';
    
    const bgmDefault = document.getElementById('bgmDefault');
    const introWasPlaying = bgmDefault && !bgmDefault.paused;
    
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
