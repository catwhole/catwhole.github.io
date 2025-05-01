function sfc32(a, b, c, d) {
    return function() {
      a |= 0; b |= 0; c |= 0; d |= 0;
      let t = (a + b | 0) + d | 0;
      d = d + 1 | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = (c << 21 | c >>> 11);
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    }
}

const seedgen = () => (Math.random()*2**32)>>>0;
const getRand = sfc32(seedgen(), seedgen(), seedgen(), seedgen());

function Random(min, max) {
    return Math.floor(getRand() * (max - min + 1)) + min;
}

function jsRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let soundEnabled = false;
let videoPlaying = false;

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        || (window.matchMedia("(max-width: 768px)").matches)
        || ('ontouchstart' in window)
        || (navigator.maxTouchPoints > 0)
        || (navigator.msMaxTouchPoints > 0);
}

function playSound(audioElement) {
    if (!soundEnabled || videoPlaying) return;
    
    const newAudio = audioElement.cloneNode();
    newAudio.muted = false;
    newAudio.volume = 0.1;
    newAudio.loop = false;
    newAudio.play();

    newAudio.onended = () => newAudio.remove();
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const bgMusic = document.getElementById('bgMusic');
    const soundToggle = document.getElementById('soundToggle');
    bgMusic.volume = 0.02;
    
    if (soundEnabled) {
        playSound(document.getElementById('clickSound'));
        bgMusic.muted = false;
        bgMusic.play();
    } else {
        bgMusic.muted = true;
        bgMusic.pause();
        bgMusic.currentTime = 0;
    }
}

let baseLuck = 1;
let currentLuck = 1;
let lastVipMultiplier = 1;
let lastXyzMultiplier = 1;

function setLuck(value) {
    baseLuck = value;
    currentLuck = value;
    lastVipMultiplier = 1;
    lastXyzMultiplier = 1;
    document.getElementById('vip-select').value = "1";
    document.getElementById('xyz-luck').checked = false;
    document.getElementById('luck').value = value;
}

function updateLuckValue() {
    const vipMultiplier = parseFloat(document.getElementById('vip-select').value);
    const xyzMultiplier = document.getElementById('xyz-luck').checked ? 2 : 1;
    const luckInput = document.getElementById('luck');
    
    if (luckInput.value && parseFloat(luckInput.value) !== currentLuck) {
        baseLuck = parseFloat(luckInput.value);
        currentLuck = baseLuck;
        lastVipMultiplier = 1;
        lastXyzMultiplier = 1;
        document.getElementById('vip-select').value = "1";
        document.getElementById('xyz-luck').checked = false;
        return;
    }

    currentLuck = baseLuck * vipMultiplier * xyzMultiplier;
    lastVipMultiplier = vipMultiplier;
    lastXyzMultiplier = xyzMultiplier;
    luckInput.value = currentLuck;
}

function resetLuck() {
    document.getElementById('luck').value = 1;
    playSound(document.getElementById('clickSound'));
    updateLuckValue();
}

function resetRolls() {
    document.getElementById('rolls').value = 1;
    playSound(document.getElementById('clickSound'));
}

function setGlitch() {
    document.getElementById('biome-select').value = 'glitch';
    playSound(document.getElementById('clickSound'));
}

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('button');
    const inputs = document.querySelectorAll('input');
    const backButton = document.querySelector('.back-button');
    const clickSound = document.getElementById('clickSound');
    const hoverSound = document.getElementById('hoverSound');

    buttons.forEach(button => {
        button.addEventListener('click', () => playSound(clickSound));
        button.addEventListener('mouseenter', () => playSound(hoverSound));
    });

    inputs.forEach(input => {
        input.addEventListener('click', () => playSound(clickSound));
        input.addEventListener('mouseenter', () => playSound(hoverSound));
    });

    backButton.addEventListener('click', () => playSound(clickSound));
    backButton.addEventListener('mouseenter', () => playSound(hoverSound));

    document.getElementById('vip-select').addEventListener('change', updateLuckValue);
    document.getElementById('xyz-luck').addEventListener('change', updateLuckValue);
    document.getElementById('luck').addEventListener('input', function() {
        const value = parseInt(this.value) || 1;
        baseLuck = value;
        currentLuck = value;
        lastVipMultiplier = 1;
        lastXyzMultiplier = 1;
        document.getElementById('vip-select').value = "1";
        document.getElementById('xyz-luck').checked = false;
    });
});

function playAuraVideo(videoId) {
    if (isMobileDevice()) {
        const bgMusic = document.getElementById('bgMusic');
        if (bgMusic && !bgMusic.paused) {
            bgMusic.pause();
            setTimeout(() => {
                if (soundEnabled) bgMusic.play();
            }, 500);
        }
        return;
    }

    let overlay = document.getElementById('video-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'video-overlay';
        overlay.className = 'video-overlay';
        document.body.appendChild(overlay);
    }

    let skipButton = document.getElementById('skip-button');
    if (!skipButton) {
        skipButton = document.createElement('div');
        skipButton.id = 'skip-button';
        skipButton.className = 'skip-button';
        skipButton.textContent = 'Click to skip';
        document.body.appendChild(skipButton);
    }
    
    const video = document.getElementById(videoId);
    if (!video) return;
    
    videoPlaying = true;
    const bgMusic = document.getElementById('bgMusic');
    const wasPlaying = !bgMusic.paused;
    
    if (wasPlaying) {
        bgMusic.pause();
    }
    
    overlay.style.display = 'block';
    video.style.display = 'block';
    skipButton.style.display = 'block';
    video.currentTime = 0;
    video.muted = !soundEnabled;
    
    const videoDuration = video.duration;
    let endProtectionActive = false;
    
    video.play().catch(error => {
        console.error("Video play error:", error);
    });
    
    const restoreAudio = () => {
        videoPlaying = false;
        
        if (wasPlaying && soundEnabled) {
            bgMusic.play();
        }
        video.style.display = 'none';
        overlay.style.display = 'none';
        skipButton.style.display = 'none';
    };
    
    skipButton.onclick = () => {
        video.pause();
        restoreAudio();
    };
    
    overlay.onclick = null;
    
    video.onended = () => {
        if (!endProtectionActive) {
            restoreAudio();
        }
    };
    
    video.ontimeupdate = () => {
        if (Math.round(video.currentTime * 10) % 10 === 0) {
            console.log(`Video time: ${video.currentTime.toFixed(1)}s / ${videoDuration.toFixed(1)}s`);
        }
        
        if (videoDuration > 0 && video.currentTime < (videoDuration * 0.9)) {
            endProtectionActive = true;
        } else {
            endProtectionActive = false;
        }
    };
}

function getRarityClass(aura) {
    // Special case for Fault
    if (aura && aura.name === "Fault") return 'rarity-challenged';
    if (aura && aura.exclusiveTo) return 'rarity-challenged';
    const chance = aura.chance;
    if (chance >= 1000000000) return 'rarity-transcendent';
    if (chance >= 99999999) return 'rarity-glorious';
    if (chance >= 10000000) return 'rarity-exalted';
    if (chance >= 1000000) return 'rarity-mythic';
    if (chance >= 99999) return 'rarity-legendary';
    if (chance >= 10000) return 'rarity-unique';
    if (chance >= 1000) return 'rarity-epic';
    return 'rarity-basic';
}