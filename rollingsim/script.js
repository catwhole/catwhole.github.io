let results = document.getElementById('result-text');
let luck = document.getElementById('luck');

const auras = [
    { name: "Luminosity - 1,200,000,000", chance: 1200000000, wonCount: 0, cutscene: "lumi" },
    { name: "Pixelation - 1,073,741,824", chance: 1073741824, wonCount: 0, cutscene: "pixelation" },
    { name: "Aegis - 825,000,000", chance: 825000000, wonCount: 0, cutscene: "aegis" },
    { name: "Ruins : Withered - 800,000,000", chance: 800000000, wonCount: 0, cutscene: "ruinswithered" },
    { name: "Sovereign - 750,000,000", chance: 750000000, wonCount: 0, cutscene: "sovereign" },
    { name: "Matrix : Reality - 601,020,102", chance: 601020102, wonCount: 0 },
    { name: "Matrix : Overdrive - 503,000,000", chance: 503000000, wonCount: 0 },
    { name: "Ruins - 500,000,000", chance: 500000000, wonCount: 0 },
    { name: "Apostolos - 444,000,000", chance: 444000000, wonCount: 0 },
    { name: "Gargantua - 430,000,000", chance: 430000000, wonCount: 0 },
    { name: "Abyssal Hunter - 400,000,000", chance: 400000000, wonCount: 0 },
    { name: "Atlas - 360,000,000", chance: 360000000, wonCount: 0 },
    { name: "Overture : History - 300,000,000", chance: 300000000, wonCount: 0 },
    { name: "Bloodlust - 300,000,000", chance: 300000000, wonCount: 0 },
    { name: "Exotic : Void - 299,999,999", chance: 299999999, wonCount: 0 },
    { name: "Archangel - 250,000,000", chance: 250000000, wonCount: 0 },
    { name: "Oppression - 220,000,000", chance: 220000000, wonCount: 0 },
    { name: "Impeached - 200,000,000", chance: 200000000, wonCount: 0 },
    { name: "Symphony - 175,000,000", chance: 175000000, wonCount: 0 },
    { name: "Glock : shieldofthesky - 170,000,000", chance: 170000000, wonCount: 0 }, ////event
    { name: "Overture - 150,000,000", chance: 150000000, wonCount: 0 },
    { name: "Starscourge : Radiant - 100,000,000", chance: 100000000, wonCount: 0 },
    { name: "Chromatic : GENESIS - 99,999,999", chance: 99999999, wonCount: 0 },
    { name: "Sailor : Flying Dutchman - 80,000,000", chance: 80000000, wonCount: 0 },
    { name: "Twilight : Iridescent Memory - 60,000,000", chance: 60000000, wonCount: 0 },
    { name: "Matrix - 50,000,000", chance: 50000000, wonCount: 0 },
    { name: "Exotic : APEX - 49,999,500", chance: 49999500, wonCount: 0 },
    { name: "Overseer - 45,000,000", chance: 45000000, wonCount: 0 },
    { name: "Ethereal - 35,000,000", chance: 35000000, wonCount: 0 },
    { name: "Arcane : Dark - 30,000,000", chance: 30000000, wonCount: 0 },
    { name: "Aviator - 24,000,000", chance: 24000000, wonCount: 0 },
    { name: "Chromatic - 20,000,000", chance: 20000000, wonCount: 0 },
    { name: "Arcane : Legacy - 15,000,000", chance: 15000000, wonCount: 0 },
    { name: "Sirius - 14,000,000", chance: 14000000, wonCount: 0 },
    { name: "Stormal : Hurricane - 13,500,000", chance: 13500000, wonCount: 0 },
    { name: "Glitch - 12,210,110", chance: 12210110, wonCount: 0 },
    { name: "Sailor - 12,000,000", chance: 12000000, wonCount: 0 },
    { name: "Starscourge - 10,000,000", chance: 10000000, wonCount: 0 },
    { name: "Helios - 9,000,000", chance: 9000000, wonCount: 0 },
    { name: "Nihility - 9,000,000", chance: 9000000, wonCount: 0 },
    { name: "Origin : Onion - 8,000,000", chance: 8000000, wonCount: 0 }, ////event
    { name: "Velocity - 7,630,000", chance: 7630000, wonCount: 0 },
    { name: "HYPER-VOLT - 7,500,000", chance: 7500000, wonCount: 0 },
    { name: "Hades - 6,666,666", chance: 6666666, wonCount: 0 },
    { name: "Origin - 6,500,000", chance: 6500000, wonCount: 0 },
    { name: "Twilight - 6,000,000", chance: 6000000, wonCount: 0 },
    { name: "Galaxy - 5,000,000", chance: 5000000, wonCount: 0 },
    { name: "Lunar : Full Moon - 5,000,000", chance: 5000000, wonCount: 0 },
    { name: "Solar : Solstice - 5,000,000", chance: 5000000, wonCount: 0 },
    { name: "Aquatic : Flame - 4,000,000", chance: 4000000, wonCount: 0 },
    { name: "Poseidon - 4,000,000", chance: 4000000, wonCount: 0 },
    { name: "Savior - 3,200,000", chance: 3200000, wonCount: 0 },
    { name: "Virtual - 2,500,000", chance: 2500000, wonCount: 0 },
    { name: "Bounded : Unbound - 2,000,000", chance: 2000000, wonCount: 0 },
    { name: "Gravitational - 2,000,000", chance: 2000000, wonCount: 0 },
    { name: "Cosmos - 1,520,000", chance: 1520000, wonCount: 0 },
    { name: "Astral - 1,336,000", chance: 1336000, wonCount: 0 },
    { name: "Rage : Brawler - 1,280,000", chance: 1280000, wonCount: 0 },
    { name: "Undefined - 1,111,000", chance: 1111000, wonCount: 0 },
    { name: "Magnetic : Reverse Polarity - 1,024,000", chance: 1024000, wonCount: 0 },
    { name: "Arcane - 1,000,000", chance: 1000000, wonCount: 0 },
    { name: "Flushed : Troll - 2 in 1", chance: 1000000, wonCount: 0 }, ////event
    { name: "Kyawthuite - 850,000", chance: 850000, wonCount: 0 },
    { name: "Celestial - 350,000", chance: 350000, wonCount: 0 },
    { name: "Bounded - 200,000", chance: 200000, wonCount: 0 },
    { name: "Aether - 180,000", chance: 180000, wonCount: 0 },
    { name: "Jade - 125,000", chance: 125000, wonCount: 0 },
    { name: "Comet - 120,000", chance: 120000, wonCount: 0 },
    { name: "Undead : Devil - 120,000", chance: 120000, wonCount: 0 },
    { name: "Diaboli : Void - 100,400", chance: 100400, wonCount: 0 },
    { name: "Exotic - 99,999", chance: 99999, wonCount: 0 },
    { name: "Stormal - 90,000", chance: 90000, wonCount: 0 },
    { name: "Permafrost - 73,500", chance: 73500, wonCount: 0 },
    { name: "Nautilus - 70,000", chance: 70000, wonCount: 0 },
    { name: "Hazard : Rays - 70,000", chance: 70000, wonCount: 0 },
    { name: "Flushed : Lobotomy - 69,000", chance: 69000, wonCount: 0 },
    { name: "Solar - 50,000", chance: 50000, wonCount: 0 },
    { name: "Lunar - 50,000", chance: 50000, wonCount: 0 },
    { name: "Starlight - 50,000", chance: 50000, wonCount: 0 },
    { name: "Star Rider - 50,000", chance: 50000, wonCount: 0 },
    { name: "Aquatic - 40,000", chance: 40000, wonCount: 0 },
    { name: "Powered - 16,384", chance: 16384, wonCount: 0 },
    { name: "LEAK - 14,000", chance: 14000, wonCount: 0 },
    { name: "Rage : Heated - 12,800", chance: 12800, wonCount: 0 },
    { name: "Corrosive - 12,000", chance: 12000, wonCount: 0 },
    { name: "Undead - 12,000", chance: 12000, wonCount: 0 },
    { name: "Lost Soul - 9,200", chance: 9200, wonCount: 0 },
    { name: "Quartz - 8,192", chance: 8192, wonCount: 0 },
    { name: "Hazard - 7,000", chance: 7000, wonCount: 0 },
    { name: "Flushed - 6,900", chance: 6900, wonCount: 0 },
    { name: "Bleeding - 4,444", chance: 4444, wonCount: 0 },
    { name: "Sidereum - 4,096", chance: 4096, wonCount: 0 },
    { name: "pukeko - 3,198", chance: 3198, wonCount: 0 }, ////event
    { name: "Player - 3,000", chance: 3000, wonCount: 0 },
    { name: "Fault - 3,000", chance: 3000, wonCount: 0 },
    { name: "Glacier - 2,304", chance: 2304, wonCount: 0 },
    { name: "Ash - 2,300", chance: 2300, wonCount: 0 },
    { name: "Magnetic - 2,048", chance: 2048, wonCount: 0 },
    { name: "Glock - 1,700", chance: 1700, wonCount: 0 },
    { name: "Precious - 1,024", chance: 1024, wonCount: 0 },
    { name: "Diaboli - 1,004", chance: 1004, wonCount: 0 },
    { name: "Wind - 900", chance: 900, wonCount: 0 },
    { name: "Aquamarine - 900", chance: 900, wonCount: 0 },
    { name: "Sapphire - 800", chance: 800, wonCount: 0 },
    { name: "Jackpot - 777", chance: 777, wonCount: 0 },
    { name: "Ink - 700", chance: 700, wonCount: 0 },
    { name: "Gilded - 512", chance: 512, wonCount: 0 },
    { name: "Emerald - 500", chance: 500, wonCount: 0 },
    { name: "Forbidden - 404", chance: 404, wonCount: 0 },
    { name: "Ruby - 350", chance: 350, wonCount: 0 },
    { name: "Topaz - 150", chance: 150, wonCount: 0 },
    { name: "Rage - 128", chance: 128, wonCount: 0 },
    { name: "Crystallized - 64", chance: 64, wonCount: 0 },
    { name: "Divinus - 32", chance: 32, wonCount: 0 },
    { name: "Rare - 16", chance: 16, wonCount: 0 },
    { name: "Natural - 8", chance: 8, wonCount: 0 },
    { name: "Good - 5", chance: 5, wonCount: 0 },
    { name: "Uncommon - 4", chance: 4, wonCount: 0 },
    { name: "Common - 2", chance: 1, wonCount: 0 }
];

function roll() {
    playSound(document.getElementById('rollSound'));
    if (isNaN(parseInt(document.getElementById('rolls').value))) {
        document.getElementById('rolls').value = 1;
    }
    if (isNaN(parseInt(luck.value))) {
        luck.value = 1;
    }
    results.innerHTML = `Rolling...`;
    let rolls = 0;
    const total = parseInt(document.getElementById('rolls').value);
    const jsEnabled = document.getElementById('cbx').checked;

    const startTime = performance.now();

    auras.forEach(aura => aura.wonCount = 0);
    
    if (jsEnabled) {
        for (let i = 0; i < total; i++) {
            for (let aura of auras) {
                if (jsRandom(1, Math.floor(aura.chance/luck.value)) === 1) {
                    aura.wonCount++;
                    break;
                }
            }
            rolls += 1;
        }        
    } else {
        for (let i = 0; i < total; i++) {
            for (let aura of auras) {
                if (Random(1, Math.floor(aura.chance/luck.value)) === 1) {
                    aura.wonCount++;
                    break;
                }
            }
            rolls += 1;
        }     
    }
    
    const endTime = performance.now();
    const executionTime = ((endTime - startTime) / 1000).toFixed(0);

    if (total === 1) {
        for (let aura of auras) {
            if (aura.wonCount > 0 && aura.cutscene) {
                playAuraVideo(aura.cutscene);
                break; // Only play the first matching video
            }
        }
    }

    let highestChance = 0;
    for (let aura of auras) {
        if (aura.wonCount > 0 && aura.chance > highestChance) {
            highestChance = aura.chance;
        }
    }

    if (highestChance >= 100000000) {
        playSound(document.getElementById('100mSound'));
    } else if (highestChance >= 10000000) {
        playSound(document.getElementById('10mSound'));
    } else if (highestChance >= 100000) {
        playSound(document.getElementById('100kSound'));
    } else if (highestChance >= 10000) {
        playSound(document.getElementById('10kSound'));
    } else if (highestChance >= 1000) {
        playSound(document.getElementById('1kSound'));
    }

    let resultText = `
    Execution time: ${executionTime} seconds. <br> 
    Rolls: ${rolls.toLocaleString()}<br><br>
    `;
    for (let aura of auras) {
        if (aura.wonCount > 0) {
            resultText += `${aura.name} | Times Rolled: ${aura.wonCount.toLocaleString()}<br>`;
        }
    }

    results.innerHTML = resultText;
}

