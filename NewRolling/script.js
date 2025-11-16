document.querySelector('.roll-btn').addEventListener('click', function() {
    const cooldownLine = this.querySelector('.cooldown-line');
    
    if (cooldownLine.classList.contains('active')) return;
    
    cooldownLine.classList.add('active');
    setTimeout(() => {
        cooldownLine.classList.remove('active');
    }, 200);
});
