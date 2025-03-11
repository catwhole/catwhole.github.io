document.getElementById('button-music').addEventListener('click', function() {
    var audio = document.getElementById('background-music');
    audio.volume = 0.05;
    if (audio.paused) {
        audio.play();
        this.textContent = 'Stop Music';
        audio.currentTime = 0;
    } else {
        audio.pause();
        this.textContent = 'Play Music';
    }
});