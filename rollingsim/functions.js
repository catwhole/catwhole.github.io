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
let videoPlaying = false; // New variable to track if a video is currently playing

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
        soundToggle.textContent = 'Sounds Off';
    } else {
        bgMusic.muted = true;
        bgMusic.pause();
        bgMusic.currentTime = 0;
        soundToggle.textContent = 'Sounds On';
    }
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
});

function playAuraVideo(videoId) {
    // Create overlay if it doesn't exist
    let overlay = document.getElementById('video-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'video-overlay';
        overlay.className = 'video-overlay';
        document.body.appendChild(overlay);
    }
    
    const video = document.getElementById(videoId);
    if (!video) return;
    
    // Set flag that a video is playing - will prevent all other sounds
    videoPlaying = true;
    
    // Mute background music
    const bgMusic = document.getElementById('bgMusic');
    const wasPlaying = !bgMusic.paused;
    
    // Pause background music
    if (wasPlaying) {
        bgMusic.pause();
    }
    
    // Display overlay and video
    overlay.style.display = 'block';
    video.style.display = 'block';
    video.currentTime = 0;
    video.muted = !soundEnabled;
    
    // Store video duration for reliable end detection
    const videoDuration = video.duration;
    let endProtectionActive = false;
    
    video.play().catch(error => {
        console.error("Video play error:", error);
    });
    
    // Function to restore audio state
    const restoreAudio = () => {
        // Allow sounds to play again
        videoPlaying = false;
        
        if (wasPlaying && soundEnabled) {
            bgMusic.play();
        }
        video.style.display = 'none';
        overlay.style.display = 'none';
    };
    
    // Set up event handlers
    overlay.onclick = () => {
        video.pause();
        restoreAudio();
    };
    
    video.onended = () => {
        // Only process end event if we're not in the protection period
        if (!endProtectionActive) {
            restoreAudio();
        }
    };
    
    video.ontimeupdate = () => {
        // Only log occasionally to avoid flooding the console
        if (Math.round(video.currentTime * 10) % 10 === 0) {
            console.log(`Video time: ${video.currentTime.toFixed(1)}s / ${videoDuration.toFixed(1)}s`);
        }
        
        // If we're in the first 90% of the video, prevent the ended event from being processed
        if (videoDuration > 0 && video.currentTime < (videoDuration * 0.9)) {
            endProtectionActive = true;
        } else {
            endProtectionActive = false;
        }
    };
}