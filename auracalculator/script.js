const auras = [
    { name: "Luminosity - 1,200,000,000", chance: 1200000000 },
    { name: "Aegis - 825,000,000", chance: 825000000 },
    { name: "Sovereign - 750,000,000", chance: 750000000 },
    { name: "Matrix : Reality - 601,020,102", chance: 601020102 },
    { name: "Atlas : Yuletide - 510,000,000", chance: 510000000 }, ///////////// ev
    { name: "Matrix : Overdrive - 503,000,000", chance: 503000000 },
    { name: "Ruins - 500,000,000", chance: 500000000 },
    { name: "Apostolos - 444,000,000", chance: 444000000 },
    { name: "Gargantua - 430,000,000", chance: 430000000 },
    { name: "Abyssal Hunter - 400,000,000", chance: 400000000 },
    { name: "Atlas - 360,000,000", chance: 360000000 },
    { name: "Overture : History - 300,000,000", chance: 300000000 },
    { name: "Bloodlust - 300,000,000", chance: 300000000 },
    { name: "Archangel - 250,000,000", chance: 250000000 },
    { name: "Impeached - 200,000,000", chance: 200000000 },
    { name: "Symphony - 175,000,000", chance: 175000000 },
    { name: "Overture - 150,000,000", chance: 150000000 },
    { name: "Abomitable - 120,000,000", chance: 120000000 }, ///////////// ev
    { name: "Starscourge : Radiant - 100,000,000", chance: 100000000 },
    { name: "Chromatic : GENESIS - 99,999,999", chance: 99999999 },
    { name: "Express - 90,000,000", chance: 90000000 }, ///////////// ev
    { name: "Sailor : Flying Dutchman - 80,000,000", chance: 80000000 },
    { name: "Winter Fantasy - 72,000,000", chance: 72000000 }, ///////////// ev
    { name: "Twilight : Iridescent Memory - 60,000,000", chance: 60000000 },
    { name: "Matrix - 50,000,000", chance: 50000000 },
    { name: "Exotic : APEX - 49,999,500", chance: 49999500 },
    { name: "Santa Frost - 45,000,000", chance: 45000000 }, ///////////// ev
    { name: "Overseer - 45,000,000", chance: 45000000 },
    { name: "Ethereal - 35,000,000", chance: 35000000 },
    { name: "Arcane : Dark - 30,000,000", chance: 30000000 },
    { name: "Exotic : Void - 29,999,999", chance: 29999999 },
    { name: "Aviator - 24,000,000", chance: 24000000 },
    { name: "Chromatic - 20,000,000", chance: 20000000 },
    { name: "Arcane : Legacy - 15,000,000", chance: 15000000 },
    { name: "Sirius - 14,000,000", chance: 14000000 },
    { name: "Wonderland - 12,000,000", chance: 12000000 }, ///////////// ev
    { name: "Sailor - 12,000,000", chance: 12000000 },
    { name: "Starscourge - 10,000,000", chance: 10000000 },
    { name: "Nihility - 9,000,000", chance: 9000000 },
    { name: "HYPER-VOLT - 7,500,000", chance: 7500000 },
    { name: "Hades - 6,666,666", chance: 6666666 },
    { name: "Origin - 6,500,000", chance: 6500000 },
    { name: "Twilight - 6,000,000", chance: 6000000 },
    { name: "Galaxy - 5,000,000", chance: 5000000 },
    { name: "Lunar : FullMoon - 5,000,000", chance: 5000000 },
    { name: "Solar : Solstice - 5,000,000", chance: 5000000 },
    { name: "Aquatic : Flame - 4,000,000", chance: 4000000 },
    { name: "Poseidon - 4,000,000", chance: 4000000 },
    { name: "Savior - 3,200,000", chance: 3200000 },
    { name: "Virtual - 2,500,000", chance: 2500000 },
    { name: "Bounded : Unbound - 2,000,000", chance: 2000000 },
    { name: "Gravitational - 2,000,000", chance: 2000000 },
    { name: "Astral - 1,336,000", chance: 1336000 },
    { name: "Rage : Brawler - 1,280,000", chance: 1280000 },
    { name: "Magnetic : Reverse Polarity - 1,024,000", chance: 1024000 },
    { name: "Arcane - 1,000,000", chance: 1000000 },
    { name: "Kyawthuite - 850,000", chance: 850000 },
    { name: "Celestial - 350,000", chance: 350000 },
    { name: "Bounded - 200,000", chance: 200000 },
    { name: "Aether - 180,000", chance: 180000 },
    { name: "Jade - 125,000", chance: 125000 },
    { name: "Comet - 120,000", chance: 120000 },
    { name: "Undead : Devil - 120,000", chance: 120000 },
    { name: "Diaboli : Void - 100,400", chance: 100400 },
    { name: "Exotic - 99,999", chance: 99999 },
    { name: "Stormal - 90,000", chance: 90000 },
    { name: "Permafrost - 73,500", chance: 73500 },
    { name: "Nautilus - 70,000", chance: 70000 },
    { name: "Hazard : Rays - 70,000", chance: 70000 },
    { name: "Flushed : Lobotomy - 69,000", chance: 69000 },
    { name: "Solar - 50,000", chance: 50000 },
    { name: "Lunar - 50,000", chance: 50000 },
    { name: "Starlight - 50,000", chance: 50000 },
    { name: "Star Rider - 50,000", chance: 50000 },
    { name: "Aquatic - 40,000", chance: 40000 },
    { name: "Powered - 16,384", chance: 16384 },
    { name: "LEAK - 14,000", chance: 14000 },
    { name: "Rage : Heated - 12,800", chance: 12800 },
    { name: "Corrosive - 12,000", chance: 12000 },
    { name: "Undead - 12,000", chance: 12000 },
    { name: "Lost Soul - 9,200", chance: 9200 },
    { name: "Quartz - 8,192", chance: 8192 },
    { name: "Hazard - 7,000", chance: 7000 },
    { name: "Flushed - 6,900", chance: 6900 },
    { name: "Bleeding - 4,444", chance: 4444 },
    { name: "Sidereum - 4,096", chance: 4096 },
    { name: "Player - 3,000", chance: 3000 },
    { name: "Glacier - 2,304", chance: 2304 },
    { name: "Ash - 2,300", chance: 2300 },
    { name: "Magnetic - 2,048", chance: 2048 },
    { name: "Glock - 1,700", chance: 1700 },
    { name: "Precious - 1,024", chance: 1024 },
    { name: "Diaboli - 1,004", chance: 1004 },
    { name: "Wind - 900", chance: 900 },
    { name: "Aquamarine - 900", chance: 900 },
    { name: "Sapphire - 800", chance: 800 },
    { name: "Jackpot - 777", chance: 777 },
    { name: "Ink - 700", chance: 700 },
    { name: "Gilded - 512", chance: 512 },
    { name: "Emerald - 500", chance: 500 },
    { name: "Forbidden - 404", chance: 404 },
    { name: "Ruby - 350", chance: 350 },
    { name: "Topaz - 150", chance: 150 },
    { name: "Rage - 128", chance: 128 },
    { name: "Crystallized - 64", chance: 64 },
    { name: "Divinus - 32", chance: 32 },
    { name: "Rare - 16", chance: 16 },
    { name: "Natural - 8", chance: 8 },
    { name: "Good - 5", chance: 5 },
    { name: "Uncommon - 4", chance: 4 },
    { name: "Common - 2", chance: 1 }
];

const nativeAuras = [
    { name: "[Native] Atlas : Yuletide - 170,000,000", chance: 170000000 },
    { name: "[Native] Abyssal Hunter - 100,000,000", chance: 100000000 },
    { name: "[Native] Atlas - 90,000,000", chance: 90000000 },
    { name: "[Native] Bloodlust - 50,000,000", chance: 50000000 },
    { name: "[Native] Gargantua - 43,000,000", chance: 43000000 },
    { name: "[Native] Impeached - 40,000,000", chance: 40000000 },
    { name: "[Native] Abomitable - 40,000,000", chance: 40000000 },
    { name: "[Native] Express - 30,000,000", chance: 30000000 },
    { name: "[Native] Winter Fantasy - 24,000,000", chance: 24000000 },
    { name: "[Native] Sailor : Flying Dutchman - 20,000,000", chance: 20000000 },
    { name: "[Native] Santa Frost - 15,000,000", chance: 15000000 },
    { name: "[Native] Starscourge : Radiant - 10,000,000", chance: 10000000 },
    { name: "[Native] Twilight : Iridescent Memory - 6,000,000", chance: 6000000 },
    { name: "[Native] Stormal : Hurricane - 4,500,000", chance: 4500000 },
    { name: "[Native] Wonderland - 4,000,000", chance: 4000000 },
    { name: "[Native] Sailor - 3,000,000", chance: 3000000 },
    { name: "[Native] Poseidon - 1,000,000", chance: 1000000 },
    { name: "[Native] Starscourge - 1,000,000", chance: 1000000 },
    { name: "[Native] Twilight - 600,000", chance: 600000 },
    { name: "[Native] Solar : Solstice - 500,000", chance: 500000 },
    { name: "[Native] Lunar : Full Moon - 500,000", chance: 500000 },
    { name: "[Native] Galaxy - 500,000", chance: 500000 },
    { name: "[Native] Astral - 267,200", chance: 267200 },
    { name: "[Native] Stormal - 30,000", chance: 30000 },
    { name: "[Native] Permafrost - 24,500", chance: 24500 },
    { name: "[Native] Undead : Devil - 20,000", chance: 20000 },
    { name: "[Native] Hazard : Rays - 14,000", chance: 14000 },
    { name: "[Native] Comet - 12,000", chance: 12000 },
    { name: "[Native] Corrosive - 2,400", chance: 2400 },
    { name: "[Native] Undead - 2,000", chance: 2000 },
    { name: "[Native] Hazard - 1,400", chance: 1400 },
    { name: "[Native] Undefined - 1,111", chance: 1111 },
    { name: "[Native] Glacier - 768", chance: 768 },
    { name: "[Native] Wind - 300", chance: 300 },
    { name: "[Native] Jackpot - 194", chance: 194 },
    { name: "[Native] Gilded - 128", chance: 128 }
];

// Add getRarityClass function after auras declaration
function getRarityClass(chance) {
    if (chance >= 1000000000) return 'rarity-transcendent';
    if (chance >= 100000000) return 'rarity-glorious';
    if (chance >= 10000000) return 'rarity-exalted';
    if (chance >= 1000000) return 'rarity-mythic';
    if (chance >= 100000) return 'rarity-legendary';
    if (chance >= 10000) return 'rarity-unique';
    if (chance >= 1000) return 'rarity-epic';
    return 'rarity-basic';
}

// Populate select with original auras sorted by rarity
const auraSelect = document.getElementById('auraSelect');
const sortedAuras = auras.sort((a, b) => b.chance - a.chance);
sortedAuras.forEach(aura => {
    const selectOption = document.createElement('option');
    selectOption.value = aura.name;
    selectOption.textContent = aura.name;
    selectOption.className = getRarityClass(aura.chance);
    auraSelect.appendChild(selectOption);
});

// Get selected aura details
function getSelectedAura() {
    const input = document.getElementById('auraInput');
    const select = document.getElementById('auraSelect');
    const auraName = input.value || select.value;

    // First try to find the aura in Native list
    const nativeAura = nativeAuras.find(aura => aura.name === auraName);
    if (nativeAura) return nativeAura;

    // If not Native or Native aura not found, look in regular auras
    const baseAura = auras.find(aura => aura.name === auraName);
    if (baseAura) return baseAura;

    return null;
}

// Modify the search functionality
document.getElementById('auraInput').addEventListener('input', function(e) {
    updateAuraList();
});

// Auto-fill input box when selecting from dropdown
document.getElementById('auraSelect').addEventListener('change', function(e) {
    const selectedAura = e.target.value;
    document.getElementById('auraInput').value = selectedAura;
    auraSelect.style.display = 'none';
});

// Update function to only show regular auras
function updateAuraList() {
    const searchTerm = document.getElementById('auraInput').value.toLowerCase();
    const filteredAuras = auras.filter(aura => 
        aura.name.toLowerCase().includes(searchTerm)
    ).sort((a, b) => b.chance - a.chance);

    const auraSelect = document.getElementById('auraSelect');
    auraSelect.innerHTML = '';
    
    filteredAuras.forEach(aura => {
        const selectOption = document.createElement('option');
        selectOption.value = aura.name;
        selectOption.textContent = aura.name;
        selectOption.className = getRarityClass(aura.chance);
        auraSelect.appendChild(selectOption);
    });

    auraSelect.style.display = 'block';
    document.getElementById('resetSearch').style.display = 'inline-block';
}

// Reset search functionality
function resetSearch() {
    document.getElementById('auraInput').value = '';
    document.getElementById('auraSelect').style.display = 'none';
    document.getElementById('resetSearch').style.display = 'none';
}

// Update calculation function with new Native terminology
function calculateChance() {
    const luck = parseFloat(document.getElementById('luck').value);
    const selectedAura = getSelectedAura();
    
    if (!luck || luck <= 0) {
        alert("Please enter a valid luck value greater than 0");
        return;
    }
    
    if (!selectedAura) {
        alert("Please select a valid aura from the list");
        return;
    }

    const baseName = selectedAura.name.split(' - ')[0];
    
    const nativeVersion = nativeAuras.find(aura => 
        aura.name.replace(/^\[Native\]\s*/, '').split(' - ')[0] === baseName
    );

    const baseChance = selectedAura.chance;
    const adjustedChance = baseChance / luck;
    const formattedAdjusted = adjustedChance.toLocaleString();
    const percentage = ((1 / adjustedChance) * 100).toFixed(8);

    let resultHTML = `
        <h2 style="color: #2dd4bf; text-align: center;">Results</h2>
        <div class="result-line">
            <span class="highlight">Aura:</span> <span class="${getRarityClass(baseChance)}">${selectedAura.name}</span>
        </div>
        <div class="result-line">
            <span class="highlight">Chance:</span> 1 in ${formattedAdjusted}
        </div>
        <div class="result-line">
            <span class="highlight">Percentage:</span> ${percentage}%
        </div>`;

    if (nativeVersion) {
        const nativeAdjustedChance = nativeVersion.chance / luck;
        const nativeFormattedAdjusted = nativeAdjustedChance.toLocaleString();
        const nativePercentage = ((1 / nativeAdjustedChance) * 100).toFixed(8);

        resultHTML += `
            <div class="result-line" style="margin-top: 20px;">
                <span class="highlight">Native:</span> <span class="${getRarityClass(nativeVersion.chance)}">${nativeVersion.name}</span>
            </div>
            <div class="result-line">
                <span class="highlight">Chance:</span> 1 in ${nativeFormattedAdjusted}
            </div>
            <div class="result-line">
                <span class="highlight">Percentage:</span> ${nativePercentage}%
            </div>`;
    }

    document.getElementById('modalResult').innerHTML = resultHTML;
    document.getElementById('resultModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('resultModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target == document.getElementById('resultModal')) {
        closeModal();
    }
}