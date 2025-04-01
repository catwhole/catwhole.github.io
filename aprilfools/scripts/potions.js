document.addEventListener('DOMContentLoaded', function() {
    // Potions data
    const potions = [
        { 
            name: "Jewelry Potion", 
            files: [
                "jewelryrecipe.png",
                "jewelrybuff (1).png",
                "jewelrybuff (2).png"
            ], 
            type: "multi-image", 
            rarity: "Unknown" 
        },
        { 
            name: "Zombie Potion", 
            files: [
                "zombierecipe.png",
                "zombiebuff.png",
                "zombiebuff2.png"
            ], 
            type: "multi-image", 
            rarity: "Unknown" 
        },
        { 
            name: "Rage Potion", 
            files: [
                "ragedrecipe.png",
                "ragedbuff.png",
                "ragedbuff2.png"
            ], 
            type: "multi-image", 
            rarity: "Unknown" 
        },
        { 
            name: "Diver Potion", 
            files: [
                "diverrecipe.png",
                "diverbuff.png",
                "diverbuff2.png"
            ], 
            type: "multi-image", 
            rarity: "Unknown" 
        },
        { 
            name: "Potion of bound", 
            files: [
                "boundrecipe.png",
                "boundbuff.png",
                "boundbuff2.png"
            ], 
            type: "multi-image", 
            rarity: "Unknown" 
        },
        { 
            name: "Godly Potion (Zeus)", 
            files: [
                "godlyzeusrecipe.png",
                "godlyzeusbuff.png",
                "godlyzeusbuff2.png"
            ], 
            type: "multi-image", 
            rarity: "Unknown" 
        },
        { 
            name: "Godly Potion (Poseidon)", 
            files: [
                "godlyposeidonrecipe.png",
                "godlyposeidonbuff.png",
                "godlyposeidonbuff2.png"
            ], 
            type: "multi-image", 
            rarity: "Unknown" 
        },
        { 
            name: "Godly Potion (Hades)", 
            files: [
                "godlyhadesrecipe.png",
                "godlyhadesbuff.png",
                "godlyhadesbuff2.png"
            ], 
            type: "multi-image", 
            rarity: "Unknown" 
        },
        { 
            name: "Godlike Potion", 
            files: [
                "godlikerecipe.png",
                "godlikebuff.png",
                "godlikebuff2.png"
            ], 
            type: "multi-image", 
            rarity: "Unknown" 
        }
        // Add more potions here when available
    ];
    
    const potionList = document.getElementById('potion-list');
    const potionDisplay = document.getElementById('potion-display');
    const selectedPotionName = document.getElementById('selected-potion-name');
    const rarityDisplay = document.getElementById('rarity-display');
    
    // Create buttons for each potion
    potions.forEach(potion => {
        const button = document.createElement('div');
        button.className = 'aura-button'; // Reusing the same button style
        button.textContent = potion.name;
        button.addEventListener('click', () => displayPotion(potion));
        potionList.appendChild(button);
    });
    
    // If no potions available, show a message
    if (potions.length === 0) {
        const message = document.createElement('p');
        message.textContent = "No potions available yet. Check back later!";
        message.style.color = "var(--accent-color)";
        message.style.textAlign = "center";
        potionList.appendChild(message);
    }
    
    // Function to display the selected potion
    function displayPotion(potion) {
        // Clear the display area
        potionDisplay.innerHTML = '';
        
        // Update the selected potion name
        selectedPotionName.textContent = potion.name;
        
        // Update the rarity information
        rarityDisplay.textContent = potion.rarity !== "Unknown" ? `Rarity: ${potion.rarity}` : "";
        
        // Remove active class from all buttons
        document.querySelectorAll('.aura-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        const activeButton = Array.from(document.querySelectorAll('.aura-button'))
            .find(btn => btn.textContent === potion.name);
        if (activeButton) {
            activeButton.classList.add('active');
        }
        
        // Handle different content types
        if (potion.type === 'video') {
            const video = document.createElement('video');
            video.src = potion.file;
            video.controls = true;
            video.autoplay = true;
            video.loop = true;
            potionDisplay.appendChild(video);
        } else if (potion.type === 'multi-image') {
            // Create a container for multiple images
            const imageContainer = document.createElement('div');
            imageContainer.className = 'potion-images-container';
            
            // Add each image to the container
            potion.files.forEach(file => {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'potion-img-container';
                
                const img = document.createElement('img');
                img.src = file;
                img.alt = `${potion.name} image`;
                img.loading = 'lazy';
                img.className = 'potion-img';
                
                imgContainer.appendChild(img);
                imageContainer.appendChild(imgContainer);
            });
            
            potionDisplay.appendChild(imageContainer);
        } else {
            // Single image
            const img = document.createElement('img');
            img.src = potion.file;
            img.alt = potion.name;
            img.loading = 'lazy';
            potionDisplay.appendChild(img);
        }
    }
});
