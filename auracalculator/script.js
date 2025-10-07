const auras = [
    { name: "Equinox - 2,500,000,000", chance: 2500000000 },
    { name: "Luminosity - 1,200,000,000", chance: 1200000000 },
    { name: "Pixelation - 1,073,741,824", chance: 1073741824 },
    { name: "Dreamscape - 850,000,000", chance: 850000000 },
    { name: "Aegis : Watergun - 825,000,000", chance: 825000000 },
    { name: "Aegis - 825,000,000", chance: 825000000 },
    { name: "Ruins : Withered - 800,000,000", chance: 800000000 },
    { name: "Sovereign - 750,000,000", chance: 750000000 },
    { name: "PROLOGUE - 666,616,111", chance: 666616111 },
    { name: "Matrix : Reality - 601,020,102", chance: 601020102 },
    { name: "Sophyra - 570,000,000", chance: 570000000 },
    { name: "Elude - 555,555,555", chance: 555555555 },
    { name: "Dreammetric - 520,000,000", chance: 520000000 },
    { name: "Matrix : Overdrive - 503,000,000", chance: 503000000 },
    { name: "Ruins - 500,000,000", chance: 500000000 },
    { name: "Kyawthite : Remembrance - 450,000,000", chance: 450000000 },
    { name: "unknown - 444,444,444", chance: 444444444 },
    { name: "Apostolos - 444,000,000", chance: 444000000 },
    { name: "Gargantua - 430,000,000", chance: 430000000 },
    { name: "Abyssal Hunter - 400,000,000", chance: 400000000 },
    { name: "CHILLSEAR - 375,000,000", chance: 375000000 },
    { name: "Atlas - 360,000,000", chance: 360000000 },
    { name: "Jazz : Orchestra - 336,870,912", chance: 300000000 },
    { name: "LOTUSFALL- 320,000,000", chance: 320000000 },
    { name: "Maelstrom - 309,999,999", chance: 309999999 },
    { name: "Manta - 300,000,000", chance: 300000000 },
    { name: "Overture : History - 300,000,000", chance: 300000000 },
    { name: "Bloodlust - 300,000,000", chance: 300000000 },
    { name: "Astral : Legendarium - 267,200,000", chance: 267200000 },
    { name: "Archangel - 250,000,000", chance: 250000000 },
    { name: "HYPER-VOLT : EVER-STORM - 225,000,000", chance: 225000000 },
    { name: "Oppression - 220,000,000", chance: 220000000 },
    { name: "Impeached - 200,000,000", chance: 200000000 },
    { name: "Twilight : Withering Grace - 180,000,000", chance: 180000000 },
    { name: "Symphony - 175,000,000", chance: 175000000 },
    { name: "Overture - 150,000,000", chance: 150000000 },
    { name: "Starscourge : Radiant - 100,000,000", chance: 100000000 },
    { name: "Chromatic : GENESIS - 99,999,999", chance: 99999999 },
    { name: "Virtual : Worldwide - 87,500,000", chance: 87500000 },
    { name: "Harnessed : Elements - 85,000,000", chance: 85000000 },
    { name: "Carriage - 80,000,000", chance: 80000000 },
    { name: "Sailor : Flying Dutchman - 80,000,000", chance: 80000000 },
    { name: "SENTINEL - 60,000,000", chance: 60000000 },
    { name: "Twilight : Iridescent Memory - 60,000,000", chance: 60000000 },
    { name: "Matrix - 50,000,000", chance: 50000000 },
    { name: "Runic - 50,000,000", chance: 50000000 },
    { name: "Exotic : APEX - 49,999,500", chance: 49999500 },
    { name: "Overseer - 45,000,000", chance: 45000000 },
    { name: "{Juxtaposition} - 40,440,400", chance: 40440400 },
    { name: "Virtual : Fatal Error - 40,413,000", chance: 40413000 },
    { name: "Ethereal - 35,000,000", chance: 35000000 },
    { name: "Arcane : Dark - 30,000,000", chance: 30000000 },
    { name: "Exotic : Void - 29,999,999", chance: 29999999 },
    { name: "Blizzard - 27,315,000", chance: 27315000 },
    { name: "Aviator - 24,000,000", chance: 24000000 },
    { name: "Chromatic - 20,000,000", chance: 20000000 },
    { name: "Lullaby - 17,000,000", chance: 17000000 },
    { name: "Arcane : Legacy - 15,000,000", chance: 15000000 },
    { name: "Sirius - 14,000,000", chance: 14000000 },
    { name: "Stormal : Hurricane - 13,500,000", chance: 13500000 },
    { name: "Glitch - 12,210,110", chance: 12210110 },
    { name: "Sailor - 12,000,000", chance: 12000000 },
    { name: "Starscourge - 10,000,000", chance: 10000000 },
    { name: "Harnessed - 8,500,000", chance: 85000000 },
    { name: "Stargazer - 9,200,000", chance: 9200000 },
    { name: "Helios - 9,000,000", chance: 9000000 },
    { name: "Nihility - 9,000,000", chance: 9000000 },
    { name: "Nautilus : Lost - 7,700,000", chance: 7700000 },
    { name: "Velocity - 7,630,000", chance: 7630000 },
    { name: "HYPER-VOLT - 7,500,000", chance: 7500000 },
    { name: "Anubis - 7,200,000", chance: 7200000 },
    { name: "Hades - 6,666,666", chance: 6666666 },
    { name: "Origin - 6,500,000", chance: 6500000 },
    { name: "Twilight - 6,000,000", chance: 6000000 },
    { name: "Anima - 5,730,000", chance: 5730000 },
    { name: "Galaxy - 5,000,000", chance: 5000000 },
    { name: "Lunar : Full Moon - 5,000,000", chance: 5000000 },
    { name: "Solar : Solstice - 5,000,000", chance: 5000000 },
    { name: "Aquatic : Flame - 4,000,000", chance: 4000000 },
    { name: "Poseidon - 4,000,000", chance: 4000000 },
    { name: "Savior - 3,200,000", chance: 3200000 },
    { name: "Parasite - 3,000,000", chance: 3000000 },
    { name: "Virtual - 2,500,000", chance: 2500000 },
    { name: "Bounded : Unbound - 2,000,000", chance: 2000000 },
    { name: "Gravitational - 2,000,000", chance: 2000000 },
    { name: "Cosmos - 1,520,000", chance: 1520000 },
    { name: "Astral - 1,336,000", chance: 1336000 },
    { name: "Rage : Brawler - 1,280,000", chance: 1280000 },
    { name: "Undefined - 1,111,000", chance: 1111000 },
    { name: "Magnetic : Reverse Polarity - 1,024,000", chance: 1024000 },
    { name: "Arcane - 1,000,000", chance: 1000000 },
    { name: "Kyawthuite - 850,000", chance: 850000 },
    { name: "Warlock - 666,000", chance: 666000 },
    { name: "Raven - 500,000", chance: 500000 },
    { name: "Terror - 400,000", chance: 400000 },
    { name: "Celestial - 350,000", chance: 350000 },
    { name: "Bounded - 200,000", chance: 200000 },
    { name: "Aether - 180,000", chance: 180000 },
    { name: "Jade - 125,000", chance: 125000 },
    { name: "Divinus : Angel - 120,000", chance: 120000 },
    { name: "Comet - 120,000", chance: 120000 },
    { name: "Undead : Devil - 120,000", chance: 120000 },
    { name: "Diaboli : Void - 100,400", chance: 100400 },
    { name: "Exotic - 99,999", chance: 99999 },
    { name: "Stormal - 90,000", chance: 90000 },
    { name: "Flow - 87,000", chance: 87000 },
    { name: "Permafrost - 73,500", chance: 73500 },
    { name: "Nautilus - 70,000", chance: 70000 },
    { name: "Hazard : Rays - 70,000", chance: 70000 },
    { name: "Flushed : Lobotomy - 69,000", chance: 69000 },
    { name: "Solar - 50,000", chance: 50000 },
    { name: "Lunar - 50,000", chance: 50000 },
    { name: "Starlight - 50,000", chance: 50000 },
    { name: "Star Rider - 50,000", chance: 50000 },
    { name: "Aquatic - 40,000", chance: 40000 },
    { name: "Watt - 32,768", chance: 32768 },
    { name: "Copper - 29,000", chance: 29000 },
    { name: "Powered - 16,384", chance: 16384 },
    { name: "LEAK - 14,000", chance: 14000 },
    { name: "Rage : Heated - 12,800", chance: 12800 },
    { name: "Corrosive - 12,000", chance: 12000 },
    { name: "Undead - 12,000", chance: 12000 },
    { name: "★★★ - 10,000", chance: 10000 },
    { name: "Atomic : Riboneucleic - 9876", chance: 9876 },
    { name: "Lost Soul - 9,200", chance: 9200 },
    { name: "Honey - 8,335", chance: 8335 },
    { name: "Quartz - 8,192", chance: 8192 },
    { name: "Hazard - 7,000", chance: 7000 },
    { name: "Flushed - 6,900", chance: 6900 },
    { name: "Megaphone - 5000", chance: 5000 },
    { name: "Bleeding - 4,444", chance: 4444 },
    { name: "Sidereum - 4,096", chance: 4096 },
    { name: "Flora - 3,700", chance: 3700 },
    { name: "Player - 3,000", chance: 3000 },
    { name: "Fault - 3,000", chance: 3000 },
    { name: "Glacier - 2,304", chance: 2304 },
    { name: "Ash - 2,300", chance: 2300 },
    { name: "Magnetic - 2,048", chance: 2048 },
    { name: "Glock - 1,700", chance: 1700 },
    { name: "Atomic - 1,180", chance: 1180 },
    { name: "Precious - 1,024", chance: 1024 },
    { name: "Diaboli - 1,004", chance: 1004 },
    { name: "★★ - 1,000", chance: 1000 },
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
    { name: "★ - 100", chance: 100 },
    { name: "Crystallized - 64", chance: 64 },
    { name: "Divinus - 32", chance: 32 },
    { name: "Rare - 16", chance: 16 },
    { name: "Natural - 8", chance: 8 },
    { name: "Good - 5", chance: 5 },
    { name: "Uncommon - 4", chance: 4 },
    { name: "Common - 2", chance: 2 },
    { name: "Nothing - 1", chance: 1 },
];

const nativeAuras = [
    { name: "[Native] CHILLSEAR - 125,000,000", chance: 125000000 },
    { name: "[Native] Maelstrom - 103,333,333", chance: 103333333 },
    { name: "[Native] Abyssal Hunter - 100,000,000", chance: 100000000 },
    { name: "[Native] Atlas - 90,000,000", chance: 90000000 },
    { name: "[Native] Gargantua - 86,000,000", chance: 86000000 },
    { name: "[Native] Astral : Legendarium - 53,440,000", chance: 53440000 },
    { name: "[Native] Bloodlust - 50,000,000", chance: 50000000 },
    { name: "[Native] Impeached - 40,000,000", chance: 40000000 },
    { name: "[Native] Sailor : Flying Dutchman - 20,000,000", chance: 20000000 },
    { name: "[Native] Starscourge : Radiant - 20,000,000", chance: 20000000 },
    { name: "[Native] Twilight : Withering Grace - 18,000,000", chance: 18000000 },
    { name: "[Native] Blizzard - 9,105,000", chance: 9105000 },
    { name: "[Native] Twilight : Iridescent Memory - 6,000,000", chance: 6000000 },
    { name: "[Native] Stormal : Hurricane - 4,500,000", chance: 4500000 },
    { name: "[Native] Sailor - 3,000,000", chance: 3000000 },
    { name: "[Native] Sirius - 2,800,000", chance: 2800000 },
    { name: "[Native] Stargazer - 1,840,000", chance: 1840000 },
    { name: "[Native] Anubis - 1,800,000", chance: 1800000 },
    { name: "[Native] LOTUSFALL - 1,700,000", chance: 1700000 },
    { name: "[Native] Starscourge - 2,000,000", chance: 2000000 },
    { name: "[Native] Hades - 1,111,111", chance: 1111111 },
    { name: "[Native] Galaxy - 1,000,000", chance: 1000000 },
    { name: "[Native] Poseidon - 1,000,000", chance: 1000000 },
    { name: "[Native] Parasite - 600,000", chance: 600000 },
    { name: "[Native] Twilight - 600,000", chance: 600000 },
    { name: "[Native] Solar : Solstice - 500,000", chance: 500000 },
    { name: "[Native] Lunar : Full Moon - 500,000", chance: 500000 },
    { name: "[Native] Astral - 267,200", chance: 267200 },
    { name: "[Native] Stormal - 30,000", chance: 30000 },
    { name: "[Native] Flow - 29,000", chance: 29000 },
    { name: "[Native] Permafrost - 24,500", chance: 24500 },
    { name: "[Native] Comet - 24,000", chance: 24000 },
    { name: "[Native] Undead : Devil - 20,000", chance: 20000 },
    { name: "[Native] Hazard : Rays - 14,000", chance: 14000 },
    { name: "[Native] Star Rider - 10,000", chance: 10000 },
    { name: "[Native] Starlight - 10,000", chance: 10000 },
    { name: "[Native] Nihility - 9,000", chance: 9000 },
    { name: "[Native] Solar - 5,000", chance: 5000 },
    { name: "[Native] Lunar - 5,000", chance: 5000 },
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

// Add formatPercentage helper function
function formatPercentage(value) {
    if (value < 0.00000001) return "< 0.00000001";
    
    // Convert to string with 8 decimal places
    const fixed = value.toFixed(8);
    
    // If it's a whole number (all decimals are 0), return without decimals
    if (fixed.endsWith('00000000')) return Math.round(value).toString();
    
    // Find the position of first non-zero decimal
    const decimalPart = fixed.split('.')[1];
    let firstNonZero = 0;
    while (firstNonZero < decimalPart.length && decimalPart[firstNonZero] === '0') {
        firstNonZero++;
    }
    
    // Return with number of decimals needed (position of first non-zero + 1)
    return value.toFixed(firstNonZero + 1);
}

function getSpeed() {
let gauntletSpeed = parseFloat(document.getElementById("gauntletSpeed").value);
let elementSpeed = (parseFloat(document.getElementById("elementSpeed").value)) / 100;
if (isNaN(elementSpeed)) elementSpeed = 0;

// Get value from haste potion radio buttons
let hastePotion = parseFloat(document.querySelector('input[name="hastePotion"]:checked').value);

// Get value from rage/diver potion radio buttons
let ragePotion = parseFloat(document.querySelector('input[name="ragePotion"]:checked').value);

// Get value from godly potion radio buttons
let godlyPotion = parseFloat(document.querySelector('input[name="godlyPotion"]:checked').value);

// Get value from seasonal potion radio buttons
let seasonalPotion = parseFloat(document.querySelector('input[name="seasonalPotion"]:checked').value);

var knowledge = parseFloat(document.querySelector('input[name="knowledge"]:checked').value);

// Update speed potion value from 0.25 to 0.1
let speedPotion = document.getElementById("speedPotion").checked ? 0.1 : 0;
let transcendant = document.getElementById("transcendant").checked ? 10 : 0;
let bank = document.getElementById("bank").checked ? 0.07 : 0;

// Add Forbidden potions
let forbidden1 = document.getElementById("forbidden1").checked ? 0.10 : 0;
let forbidden2 = document.getElementById("forbidden2").checked ? 0.25 : 0;
let forbidden3 = document.getElementById("forbidden3").checked ? 0.75 : 0;

return speed = 1 + gauntletSpeed + elementSpeed + hastePotion + speedPotion + transcendant + knowledge + seasonalPotion + bank + ragePotion + godlyPotion
    + forbidden1 + forbidden2 + forbidden3;
}

function calculateTime(adjustedChance, speed) {
    const seconds = adjustedChance / speed;
    if (seconds < 60) return `${seconds.toFixed(2)} seconds`;
    const minutes = seconds / 60;
    if (minutes < 60) return `${minutes.toFixed(2)} minutes`;
    const hours = minutes / 60;
    if (hours < 24) return `${hours.toFixed(2)} hours`;
    const days = hours / 24;
    if (days < 7) return `${days.toFixed(2)} days`;
    const weeks = days / 7;
    if (weeks < 4) return `${weeks.toFixed(2)} weeks`;
    const months = weeks / 4.34524;
    if (months < 12) return `${months.toFixed(2)} months`;
    const years = months / 12;
    return `${years.toFixed(2)} years`;
}

function calculateChance() {
    const selectedAura = getSelectedAura();
    const luck = parseFloat(document.getElementById('luck').value);
    const speed = getSpeed();
    const advancedOptions = document.getElementById('advancedOptions');

    if (!selectedAura || !luck) {
        document.getElementById('modalResult').innerHTML = `
            <h2 style="color: #ff4444; text-align: center;">Error</h2>
            <div class="result-line">Please enter valid values for both aura and luck</div>`;
        document.getElementById('resultModal').style.display = 'block';
        return;
    }

    const baseName = selectedAura.name.split(' - ')[0];
    
    const nativeVersion = nativeAuras.find(aura => 
        aura.name.replace(/^\[Native\]\s*/, '').split(' - ')[0] === baseName
    );

    const baseChance = selectedAura.chance;
    let adjustedChance = baseChance / luck;
    if (adjustedChance < 1) {
        adjustedChance = 1;
    }
    const formattedAdjusted = adjustedChance.toLocaleString();
    const percentage = formatPercentage((1 / adjustedChance) * 100);

    let resultHTML = `
        <h2 style="color: #2dd4bf; text-align: center;">Results</h2>
        <p class="warning-text" style="margin: 10px 0 10px;">Note: The results are entirely statistical, not based on simulations. This means that there is a very high possibility you will get this aura faster/easier than displayed.</p>
        <div class="result-line">
            <span class="highlight">Aura:</span> <span class="${getRarityClass(baseChance)}">${selectedAura.name}</span>
        </div>
        <div class="result-line">
            <span class="highlight">Chance:</span> 1 in ${formattedAdjusted}
        </div>
        <div class="result-line">
            <span class="highlight">Percentage:</span> ${percentage}%
        </div>`;

    if (advancedOptions.style.display === 'block') {
        const timeToGetAura = calculateTime(adjustedChance, speed);
        resultHTML += `
            <div class="result-line">
                <span class="highlight">Your Speed:</span> ${speed.toFixed(2)}x
            </div>
            <div class="result-line">
                <span class="highlight">Average Time to Get Aura:</span> ${timeToGetAura}
            </div>`;
    }

    if (nativeVersion) {
        let nativeAdjustedChance = nativeVersion.chance / luck;
        if (nativeAdjustedChance < 1) {
            nativeAdjustedChance = 1;
        }
        const nativeFormattedAdjusted = nativeAdjustedChance.toLocaleString();
        const nativePercentage = formatPercentage((1 / nativeAdjustedChance) * 100);

        resultHTML += `
            <div class="result-line" style="margin-top: 20px;">
                <span class="highlight">Native Version:</span> <span class="${getRarityClass(nativeVersion.chance)}">${nativeVersion.name}</span>
            </div>
            <div class="result-line">
                <span class="highlight">Chance:</span> 1 in ${nativeFormattedAdjusted}
            </div>
            <div class="result-line">
                <span class="highlight">Percentage:</span> ${nativePercentage}%
            </div>`;

        if (advancedOptions.style.display === 'block') {
            const nativeTimeToGetAura = calculateTime(nativeAdjustedChance, speed);
            resultHTML += `
            <div class="result-line">
                <span class="highlight">Your Speed:</span> ${speed.toFixed(2)}x
            </div>
            <div class="result-line">
                <span class="highlight">Average Time to Get Aura:</span> ${nativeTimeToGetAura}
            </div>`;
        }
    }




    document.getElementById('modalResult').innerHTML = resultHTML;
    document.getElementById('resultModal').style.display = 'block';
}

// Add simulation function
function simulateRolls() {
    const selectedAura = getSelectedAura();
    const luck = parseFloat(document.getElementById('luck').value);
    
    if (!selectedAura || !luck) {
        document.getElementById('modalResult').innerHTML = `
            <h2 style="color: #ff4444; text-align: center;">Error</h2>
            <div class="result-line">Please enter valid values for both aura and luck</div>`;
        document.getElementById('resultModal').style.display = 'block';
        return;
    }
    
    // Implementation of Random function from rollingsim
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
    
    // Start simulation
    document.getElementById('modalResult').innerHTML = `
        <h2 style="color: #2dd4bf; text-align: center;">Simulation Running...</h2>
        <div class="result-line">
            Please wait while we simulate rolling for ${selectedAura.name}
        </div>`;
    document.getElementById('resultModal').style.display = 'block';
    
    // Run simulation after a short delay to allow modal to show
    setTimeout(() => {
        let rolls = 0;
        let auraFound = false;
        const maxRolls = 500000000; // 500 million limit
        
        const adjustedChance = Math.max(1, Math.floor(selectedAura.chance / luck));
        
        while (!auraFound && rolls < maxRolls) {
            rolls++;
            if (Random(1, adjustedChance) === 1) {
                auraFound = true;
            }
        }
        
        // Display results
        let resultHTML;
        if (auraFound) {
            resultHTML = `
                <h2 style="color: #2dd4bf; text-align: center;">Simulation Results</h2>
                <p class="warning-text" style="margin: 10px 0 10px;">Note: Results vary A LOT per simulation. Please run a few simulations for a more accurate result.</p>
                <div class="result-line">
                    <span class="highlight">Aura:</span> <span class="${getRarityClass(selectedAura.chance)}">${selectedAura.name}</span>
                </div>
                <div class="result-line">
                    <span class="highlight">Luck Used:</span> ${luck.toLocaleString()}
                </div>
                <div class="result-line">
                    <span class="highlight">Rolls Required:</span> ${rolls.toLocaleString()}
                </div>
                <button onclick="simulateRolls()" class="button-secondary" style="width: 100%; margin-top: 20px;">Simulate Again</button>`;
        } else {
            resultHTML = `
                <h2 style="color: #ff4444; text-align: center;">Simulation Aborted</h2>
                <p class="warning-text" style="margin: 10px 0 10px;">Note: Results vary A LOT per simulation. Please run a few simulations for a more accurate result.</p>
                <div class="result-line">
                    Rolls exceeded 500 million - aborted simulation
                </div>
                <div class="result-line">
                    <span class="highlight">Aura:</span> <span class="${getRarityClass(selectedAura.chance)}">${selectedAura.name}</span>
                </div>
                <div class="result-line">
                    <span class="highlight">Luck Used:</span> ${luck.toLocaleString()}
                </div>
                <button onclick="simulateRolls()" class="button-secondary" style="width: 100%; margin-top: 20px;">Simulate Again</button>`;
        }
        
        document.getElementById('modalResult').innerHTML = resultHTML;
    }, 100);
}

function closeModal() {
    document.getElementById('resultModal').style.display = 'none';
}


window.addEventListener('click', function(event) {
    if (event.target == document.getElementById('resultModal')) {
        closeModal();
    }
});

// Add toggleRollSpeed function
function toggleRollSpeed() {
    const rollSpeedOptions = document.getElementById('rollSpeedOptions');
    if (rollSpeedOptions.style.display === 'none') {
        rollSpeedOptions.style.display = 'block';
    } else {
        rollSpeedOptions.style.display = 'none';
    }
}

// Add mode toggle function
function toggleMode() {
    const modeToggle = document.getElementById('modeToggle');
    const advancedOptions = document.getElementById('advancedOptions');
    const isAdvanced = advancedOptions.style.display === 'block';
    
    advancedOptions.style.display = isAdvanced ? 'none' : 'block';
    modeToggle.textContent = isAdvanced ? 'Switch to Advanced Mode' : 'Switch to Simple Mode';
    
    // Reset roll speed options when switching to simple mode
    if (isAdvanced) {
        document.getElementById('rollSpeedOptions').style.display = 'none';
    }

    // Switch background music
    const bgMusic = document.getElementById('bgMusic');
    const bgMusicSource = document.getElementById('bgMusicSource');
    bgMusicSource.src = isAdvanced ? 'elevator.mp3' : 'elevator_slowed.mp3';
    bgMusic.load();
    bgMusic.currentTime = 0;
    bgMusic.play().catch(function(error) {
        console.log("Audio play failed:", error);
    });
}

// Modify the toggleMusic function to stop and restart the music when the button is pressed
function toggleMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    
    if (bgMusic.muted) {
        bgMusic.currentTime = 0;
        bgMusic.muted = false;
        bgMusic.play().catch(function(error) {
            console.log("Audio play failed:", error);
        });
        musicToggle.textContent = 'Stop Music';
    } else {
        bgMusic.pause();
        bgMusic.currentTime = 0;
        bgMusic.muted = true;
        musicToggle.textContent = 'Play Music';
    }
}

// Store the base luck value (before multipliers) and a flag for programmatic updates
let baseLuckValue = 0;
let isProgrammaticUpdate = false;

// Function to update luck value based on presets and multipliers
function updateLuckValue(newBaseValue = null) {
    // Set flag to prevent input handler from resetting multipliers during programmatic updates
    isProgrammaticUpdate = true;
    
    const luckInput = document.getElementById('luck');
    // Get selected radio button value
    const vipMultiplier = parseFloat(document.querySelector('input[name="vipStatus"]:checked').value);
    const xyzMultiplier = document.getElementById('xyzBuff').checked ? 2 : 1;
    const davesHopeMultiplier = parseFloat(document.getElementById('davesHopeSelect')?.value || 1);

    // Update base value if provided
    if (newBaseValue !== null) {
        baseLuckValue = newBaseValue;
    }
    
    // Calculate final luck value with multipliers (no rounding, allow decimals)
    const finalValue = baseLuckValue * vipMultiplier * xyzMultiplier * davesHopeMultiplier;
    
    // Update input field (preserve decimals)
    luckInput.value = finalValue;

    // Reset flag after update
    setTimeout(() => { isProgrammaticUpdate = false; }, 0);
}

// Function to reset multipliers
function resetMultipliers() {
    document.getElementById('vipNone').checked = true;
    document.getElementById('xyzBuff').checked = false;
    document.getElementById('davesHopeSelect').value = "1";
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const bgMusic = document.getElementById('bgMusic');
    
    // Set initial volume and play state
    bgMusic.volume = 0.05;
    bgMusic.play().catch(function(error) {
        console.log("Audio play failed:", error);
    });
    
    // Add event listeners for luck presets
    document.querySelectorAll('.luck-preset').forEach(button => {
        button.addEventListener('click', function() {
            const luckValue = parseInt(this.getAttribute('data-luck'));
            updateLuckValue(luckValue);
        });
    });

    // Dave's Hope dropdown event
    document.getElementById('davesHopeSelect').addEventListener('change', function() {
        updateLuckValue();
    });
    
    // Add event listeners for multipliers
    document.querySelectorAll('input[name="vipStatus"]').forEach(radio => {
        radio.addEventListener('change', function() {
            updateLuckValue();
        });
    });
    
    document.getElementById('xyzBuff').addEventListener('change', function() {
        updateLuckValue();
    });
    
    // Track manual changes to the luck input
    const luckInput = document.getElementById('luck');
    
    // Use the input event to detect changes to the luck input
    luckInput.addEventListener('input', function() {
        // Only reset multipliers if the change wasn't triggered programmatically
        if (!isProgrammaticUpdate) {
            // Keep the current value but reset multipliers
            const currentValue = parseFloat(this.value) || 0;
            baseLuckValue = currentValue;
            resetMultipliers();
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const bgMusic = document.getElementById('bgMusic');
    
    // Set initial volume and play state
    bgMusic.volume = 0.05;
    bgMusic.play().catch(function(error) {
        console.log("Audio play failed:", error);
    });
});

function updateLimboState() {
    const forbidden1 = document.getElementById('forbidden1').checked;
    const forbidden2 = document.getElementById('forbidden2').checked;
    const forbidden3 = document.getElementById('forbidden3').checked;
    const anyLimbo = forbidden1 || forbidden2 || forbidden3;

    const speedBuffs = document.getElementById('speed-buffs');
    if (speedBuffs) {
        if (anyLimbo) {
            // Hide the speed buffs section
            speedBuffs.style.display = 'none';
            
            // Disable and reset all speed buff elements
            const speedPotion = document.getElementById('speedPotion');
            const bank = document.getElementById('bank');
            const transcendant = document.getElementById('transcendant');
            const elementSpeed = document.getElementById('elementSpeed');
            
            if (speedPotion) { speedPotion.checked = false; speedPotion.disabled = true; }
            if (bank) { bank.checked = false; bank.disabled = true; }
            if (transcendant) { transcendant.checked = false; transcendant.disabled = true; }
            if (elementSpeed) { elementSpeed.value = ''; elementSpeed.disabled = true; }

            // Reset and disable all radio groups
            const radioGroups = ['knowledge', 'seasonalPotion', 'hastePotion', 'ragePotion', 'godlyPotion'];
            radioGroups.forEach(groupName => {
                const radios = document.querySelectorAll(`input[name="${groupName}"]`);
                radios.forEach(radio => {
                    radio.disabled = true;
                    // Check the "None" option for each group
                    if (radio.id === `${groupName}None` || radio.value === '0') {
                        radio.checked = true;
                    } else {
                        radio.checked = false;
                    }
                });
            });
        } else {
            // Show the speed buffs section
            speedBuffs.style.display = 'block';
            
            // Re-enable all speed buff elements
            const speedPotion = document.getElementById('speedPotion');
            const bank = document.getElementById('bank');
            const transcendant = document.getElementById('transcendant');
            const elementSpeed = document.getElementById('elementSpeed');
            
            if (speedPotion) speedPotion.disabled = false;
            if (bank) bank.disabled = false;
            if (transcendant) transcendant.disabled = false;
            if (elementSpeed) elementSpeed.disabled = false;

            // Re-enable all radio groups
            const radioGroups = ['knowledge', 'seasonalPotion', 'hastePotion', 'ragePotion', 'godlyPotion'];
            radioGroups.forEach(groupName => {
                const radios = document.querySelectorAll(`input[name="${groupName}"]`);
                radios.forEach(radio => {
                    radio.disabled = false;
                });
            });
        }
    }
}

// Add event listeners for Limbo checkboxes after DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...

    // Limbo (Forbidden) logic
    ['forbidden1', 'forbidden2', 'forbidden3'].forEach(id => {
        document.getElementById(id).addEventListener('change', updateLimboState);
    });
    // Initialize state on load
    updateLimboState();
});