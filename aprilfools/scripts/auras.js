document.addEventListener('DOMContentLoaded', function() {
    // Auras data: name, file name, type (image or video), and rarity
    const auras = [
        { name: "Pixelation", file: "Pixelation.png", type: "image", rarity: "1 in 1,073,741,824" },
        { name: "Ruins : Withered", file: "Withered.png", type: "image", rarity: "1 in 800,000,000" },
        { name: "Glock : shieldofthesky", file: "Glockofthesky.png", type: "image", rarity: "1 in 170,000,000" },
        { name: "Helios", file: "Helios.png", type: "image", rarity: "1 in 9,000,000" },
        { name: "Velocity", file: "Velocity.png", type: "image", rarity: "1 in 7,630,000" },
        { name: "Cosmos", file: "Cosmos.png", type: "image", rarity: "1 in 1,520,000" },
        { name: "Flushed : Troll", file: "Troll.png", type: "image", rarity: "2 in 1" },
        { name: "Origin : Onion", file: "", type: "image", rarity: "1 in ?"},
        { name: "pukeko", file: "", type: "image", rarity: "1 in ?" },
    ];
    
    const auraList = document.getElementById('aura-list');
    const auraDisplay = document.getElementById('aura-display');
    const selectedAuraName = document.getElementById('selected-aura-name');
    const rarityDisplay = document.getElementById('rarity-display');
    
    // Create buttons for each aura
    auras.forEach(aura => {
        const button = document.createElement('div');
        button.className = 'aura-button';
        button.textContent = aura.name;
        button.addEventListener('click', () => displayAura(aura));
        auraList.appendChild(button);
    });
    
    // Function to display the selected aura
    function displayAura(aura) {
        // Clear the display area
        auraDisplay.innerHTML = '';
        
        // Update the selected aura name
        selectedAuraName.textContent = aura.name;
        
        // Update the rarity information
        rarityDisplay.textContent = `Rarity: ${aura.rarity}`;
        
        // Remove active class from all buttons
        document.querySelectorAll('.aura-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        const activeButton = Array.from(document.querySelectorAll('.aura-button'))
            .find(btn => btn.textContent === aura.name);
        if (activeButton) {
            activeButton.classList.add('active');
        }
        
        // Create the appropriate element based on type
        if (aura.type === 'video') {
            const video = document.createElement('video');
            video.src = aura.file;
            video.controls = true;
            video.autoplay = true;
            video.loop = true;
            auraDisplay.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = aura.file;
            img.alt = aura.name;
            img.loading = 'lazy';
            auraDisplay.appendChild(img);
        }
    }
});
