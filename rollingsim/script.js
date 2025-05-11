let results = document.getElementById('result-text');
let luck = document.getElementById('luck');
let isRolling = false;

const auras = [
    { name: "Luminosity - 1,200,000,000", chance: 1200000000, wonCount: 0, cutscene: "lumi" },
    { name: "Pixelation - 1,073,741,824", chance: 1073741824, wonCount: 0, cutscene: "pixelation" },
    { name: "Aegis - 825,000,000", chance: 825000000, wonCount: 0, cutscene: "aegis" },
    { name: "Ruins : Withered - 800,000,000", chance: 800000000, wonCount: 0, cutscene: "ruinswithered" },
    { name: "Sovereign - 750,000,000", chance: 750000000, wonCount: 0, cutscene: "sovereign" },
    { name: "Matrix : Reality - 601,020,102", chance: 601020102, wonCount: 0 },
    { name: "Matrix : Overdrive - 503,000,000", chance: 503000000, wonCount: 0 },
    { name: "Ruins - 500,000,000", chance: 500000000, wonCount: 0 },
    { name: "Kyawthuite : Remembrance - 450,000,000", chance: 450000000, wonCount: 0 },
    { name: "Apostolos - 444,000,000", chance: 444000000, wonCount: 0 },
    { name: "Gargantua - 430,000,000", chance: 430000000, wonCount: 0, breakthrough: { starfall: 5 } },
    { name: "Abyssal Hunter - 400,000,000", chance: 400000000, wonCount: 0, breakthrough: { rainy: 4 } },
    { name: "Atlas - 360,000,000", chance: 360000000, wonCount: 0, breakthrough: { sandstorm: 4 } },
    { name: "Jazz : Orchestra - 336,870,912", chance: 336870912, wonCount: 0 },
    { name: "Overture : History - 300,000,000", chance: 300000000, wonCount: 0 },
    { name: "Bloodlust - 300,000,000", chance: 300000000, wonCount: 0, breakthrough: { hell: 6 } },
    { name: "Exotic : Void - 299,999,999", chance: 299999999, wonCount: 0 },
    { name: "Astral : Legendarium - 267,200,000", chance: 267200000, wonCount: 0, breakthrough: { starfall: 5 } },
    { name: "Archangel - 250,000,000", chance: 250000000, wonCount: 0 },
    { name: "Oppression - 220,000,000", chance: 220000000, wonCount: 0, exclusiveTo: ["glitch"] },
    { name: "Impeached - 200,000,000", chance: 200000000, wonCount: 0, breakthrough: { corruption: 5 } },
    { name: "Symphony - 175,000,000", chance: 175000000, wonCount: 0 },
    { name: "Overture - 150,000,000", chance: 150000000, wonCount: 0 },
    { name: "Starscourge : Radiant - 100,000,000", chance: 100000000, wonCount: 0, breakthrough: { starfall: 5 } },
    { name: "Chromatic : GENESIS - 99,999,999", chance: 99999999, wonCount: 0 },
    { name: "Sailor : Flying Dutchman - 80,000,000", chance: 80000000, wonCount: 0, breakthrough: { rainy: 4 } },
    { name: "Twilight : Iridescent Memory - 60,000,000", chance: 60000000, wonCount: 0, breakthrough: { night: 10 } },
    { name: "Matrix - 50,000,000", chance: 50000000, wonCount: 0 },
    { name: "Exotic : APEX - 49,999,500", chance: 49999500, wonCount: 0 },
    { name: "Overseer - 45,000,000", chance: 45000000, wonCount: 0 },
    { name: "Virtual : Fatal Error - 40,413,000", chance: 40413000, wonCount: 0 },
    { name: "Ethereal - 35,000,000", chance: 35000000, wonCount: 0 },
    { name: "Arcane : Dark - 30,000,000", chance: 30000000, wonCount: 0 },
    { name: "Aviator - 24,000,000", chance: 24000000, wonCount: 0 },
    { name: "Chromatic - 20,000,000", chance: 20000000, wonCount: 0 },
    { name: "Blizzard - 27,315,000", chance: 27315000, wonCount: 0, breakthrough: { snowy: 3 } },
    { name: "Arcane : Legacy - 15,000,000", chance: 15000000, wonCount: 0 },
    { name: "Sirius - 14,000,000", chance: 14000000, wonCount: 0, breakthrough: { starfall: 5 } },
    { name: "Stormal : Hurricane - 13,500,000", chance: 13500000, wonCount: 0, breakthrough: { windy: 3 } },
    { name: "Glitch - 12,210,110", chance: 12210110, wonCount: 0, exclusiveTo: ["glitch"] },
    { name: "Sailor - 12,000,000", chance: 12000000, wonCount: 0, breakthrough: { rainy: 4 } },
    { name: "Starscourge - 10,000,000", chance: 10000000, wonCount: 0, breakthrough: { starfall: 5 } },
    { name: "Harnessed - 9,740,000", chance: 9740000, wonCount: 0 },
    { name: "Stargazer - 9,200,000", chance: 9200000, wonCount: 0, breakthrough: { starfall: 5 } },
    { name: "Helios - 9,000,000", chance: 9000000, wonCount: 0 },
    { name: "Nihility - 9,000,000", chance: 9000000, wonCount: 0, breakthrough: { null: 1000 } },
    { name: "Velocity - 7,630,000", chance: 7630000, wonCount: 0 },
    { name: "HYPER-VOLT - 7,500,000", chance: 7500000, wonCount: 0 },
    { name: "Anubis - 7,200,000", chance: 7200000, wonCount: 0, breakthrough: { sandstorm: 4 } },
    { name: "Hades - 6,666,666", chance: 6666666, wonCount: 0, breakthrough: { hell: 6 } },
    { name: "Origin - 6,500,000", chance: 6500000, wonCount: 0 },
    { name: "Twilight - 6,000,000", chance: 6000000, wonCount: 0, breakthrough: { night: 10 } },
    { name: "Galaxy - 5,000,000", chance: 5000000, wonCount: 0, breakthrough: { starfall: 5 } },
    { name: "Lunar : Full Moon - 5,000,000", chance: 5000000, wonCount: 0, breakthrough: { night: 10 } },
    { name: "Solar : Solstice - 5,000,000", chance: 5000000, wonCount: 0, breakthrough: { day: 10 } },
    { name: "Aquatic : Flame - 4,000,000", chance: 4000000, wonCount: 0 },
    { name: "Poseidon - 4,000,000", chance: 4000000, wonCount: 0, breakthrough: { rainy: 4 } },
    { name: "Savior - 3,200,000", chance: 3200000, wonCount: 0 },
    { name: "Virtual - 2,500,000", chance: 2500000, wonCount: 0 },
    { name: "Bounded : Unbound - 2,000,000", chance: 2000000, wonCount: 0 },
    { name: "Gravitational - 2,000,000", chance: 2000000, wonCount: 0 },
    { name: "Cosmos - 1,520,000", chance: 1520000, wonCount: 0 },
    { name: "Astral - 1,336,000", chance: 1336000, wonCount: 0, breakthrough: { starfall: 5 } },
    { name: "Rage : Brawler - 1,280,000", chance: 1280000, wonCount: 0 },
    { name: "Undefined - 1,111,000", chance: 1111000, wonCount: 0, breakthrough: { null: 1000 } },
    { name: "Magnetic : Reverse Polarity - 1,024,000", chance: 1024000, wonCount: 0 },
    { name: "Arcane - 1,000,000", chance: 1000000, wonCount: 0 },
    { name: "Kyawthuite - 850,000", chance: 850000, wonCount: 0 },
    { name: "Celestial - 350,000", chance: 350000, wonCount: 0 },
    { name: "Bounded - 200,000", chance: 200000, wonCount: 0 },
    { name: "Aether - 180,000", chance: 180000, wonCount: 0 },
    { name: "Jade - 125,000", chance: 125000, wonCount: 0 },
    { name: "Comet - 120,000", chance: 120000, wonCount: 0, breakthrough: { starfall: 5 } },
    { name: "Undead : Devil - 120,000", chance: 120000, wonCount: 0, breakthrough: { hell: 6 } },
    { name: "Diaboli : Void - 100,400", chance: 100400, wonCount: 0 },
    { name: "Exotic - 99,999", chance: 99999, wonCount: 0 },
    { name: "Stormal - 90,000", chance: 90000, wonCount: 0, breakthrough: { windy: 3 } },
    { name: "Permafrost - 73,500", chance: 73500, wonCount: 0, breakthrough: { snowy: 3 } },
    { name: "Nautilus - 70,000", chance: 70000, wonCount: 0 },
    { name: "Hazard : Rays - 70,000", chance: 70000, wonCount: 0, breakthrough: { corruption: 5 } },
    { name: "Flushed : Lobotomy - 69,000", chance: 69000, wonCount: 0 },
    { name: "Solar - 50,000", chance: 50000, wonCount: 0, breakthrough: { day: 10 } },
    { name: "Lunar - 50,000", chance: 50000, wonCount: 0, breakthrough: { night: 10 } },
    { name: "Starlight - 50,000", chance: 50000, wonCount: 0, breakthrough: { starfall: 5 } },
    { name: "Star Rider - 50,000", chance: 50000, wonCount: 0, breakthrough: { starfall: 5 } },
    { name: "Aquatic - 40,000", chance: 40000, wonCount: 0 },
    { name: "Powered - 16,384", chance: 16384, wonCount: 0 },
    { name: "LEAK - 14,000", chance: 14000, wonCount: 0 },
    { name: "Rage : Heated - 12,800", chance: 12800, wonCount: 0 },
    { name: "Corrosive - 12,000", chance: 12000, wonCount: 0, breakthrough: { corruption: 5 } },
    { name: "Undead - 12,000", chance: 12000, wonCount: 0, breakthrough: { hell: 6 } },
    { name: "★★★ - 10,000", chance: 10000, wonCount: 0, exclusiveTo: ["glitch", "dreamspace"] },
    { name: "Lost Soul - 9,200", chance: 9200, wonCount: 0 },
    { name: "Quartz - 8,192", chance: 8192, wonCount: 0 },
    { name: "Hazard - 7,000", chance: 7000, wonCount: 0, breakthrough: { corruption: 5 } },
    { name: "Flushed - 6,900", chance: 6900, wonCount: 0 },
    { name: "Bleeding - 4,444", chance: 4444, wonCount: 0 },
    { name: "Sidereum - 4,096", chance: 4096, wonCount: 0 },
    { name: "Player - 3,000", chance: 3000, wonCount: 0 },
    { name: "Fault - 3,000", chance: 3000, wonCount: 0, exclusiveTo: ["glitch"] },
    { name: "Glacier - 2,304", chance: 2304, wonCount: 0, breakthrough: { snowy: 3 } },
    { name: "Ash - 2,300", chance: 2300, wonCount: 0 },
    { name: "Magnetic - 2,048", chance: 2048, wonCount: 0 },
    { name: "Glock - 1,700", chance: 1700, wonCount: 0 },
    { name: "Precious - 1,024", chance: 1024, wonCount: 0 },
    { name: "Diaboli - 1,004", chance: 1004, wonCount: 0 },
    { name: "★★ - 1,000", chance: 1000, wonCount: 0, exclusiveTo: ["glitch", "dreamspace"] },
    { name: "Wind - 900", chance: 900, wonCount: 0, breakthrough: { windy: 3 } },
    { name: "Aquamarine - 900", chance: 900, wonCount: 0 },
    { name: "Sapphire - 800", chance: 800, wonCount: 0 },
    { name: "Jackpot - 777", chance: 777, wonCount: 0, breakthrough: { sandstorm: 4 } },
    { name: "Ink - 700", chance: 700, wonCount: 0 },
    { name: "Gilded - 512", chance: 512, wonCount: 0, breakthrough: { sandstorm: 4 } },
    { name: "Emerald - 500", chance: 500, wonCount: 0 },
    { name: "Forbidden - 404", chance: 404, wonCount: 0 },
    { name: "Ruby - 350", chance: 350, wonCount: 0 },
    { name: "Topaz - 150", chance: 150, wonCount: 0 },
    { name: "Rage - 128", chance: 128, wonCount: 0 },
    { name: "★ - 100", chance: 100, wonCount: 0, exclusiveTo: ["glitch", "dreamspace"] },
    { name: "Crystallized - 64", chance: 64, wonCount: 0 },
    { name: "Divinus - 32", chance: 32, wonCount: 0 },
    { name: "Rare - 16", chance: 16, wonCount: 0 },
    { name: "Natural - 8", chance: 8, wonCount: 0 },
    { name: "Good - 5", chance: 5, wonCount: 0 },
    { name: "Uncommon - 4", chance: 4, wonCount: 0 },
    { name: "Common - 2", chance: 1, wonCount: 0 }
];

function roll() {
    if (isRolling) return;
    
    isRolling = true;
    const rollButton = document.querySelector('.roll-button');
    rollButton.disabled = true;
    rollButton.style.opacity = '0.5';
    
    playSound(document.getElementById('rollSound'));
    if (isNaN(parseInt(document.getElementById('rolls').value))) {
        document.getElementById('rolls').value = 1;
    }
    if (isNaN(parseInt(luck.value))) {
        luck.value = 1;
    }

    const total = parseInt(document.getElementById('rolls').value);
    const jsEnabled = document.getElementById('cbx').checked;
    const biome = document.getElementById('biome-select').value;
    
    // Reset state
    results.innerHTML = `Rolling...`;
    let rolls = 0;
    const startTime = performance.now();
    
    auras.forEach(aura => {
        aura.wonCount = 0;
        aura.effectiveChance = aura.chance;
    });

    let btAuras = {};

    // Show progress bar
    const progressContainer = document.querySelector('.progress-container');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    progressContainer.style.display = total >= 100000 ? 'block' : 'none';
    progressFill.style.width = '0%';
    progressText.textContent = '0%';

    // Calculate effective auras
    const effectiveAuras = auras.map(aura => {
        if (aura.exclusiveTo) {
            if (!aura.exclusiveTo.includes(biome)) {
                aura.effectiveChance = Infinity;
                return aura;
            }
        }

        let effectiveChance = aura.chance;
        if (aura.breakthrough) {
            if (biome === "glitch") {
                let minChance = aura.chance;
                for (const mult of Object.values(aura.breakthrough)) {
                    minChance = Math.min(minChance, Math.floor(aura.chance / mult));
                }
                effectiveChance = minChance;
            } else if (aura.breakthrough[biome]) {
                effectiveChance = Math.floor(aura.chance / aura.breakthrough[biome]);
            }
        }
        effectiveChance = Math.max(1, effectiveChance);
        aura.effectiveChance = effectiveChance;
        return aura;
    }).sort((a, b) => b.effectiveChance - a.effectiveChance)
    .filter(aura => aura.effectiveChance !== Infinity);

    // Process rolls in chunks
    const CHUNK_SIZE = 100000;
    let currentRoll = 0;

    function processChunk() {
        const chunkEnd = Math.min(currentRoll + CHUNK_SIZE, total);
        
        for (let i = currentRoll; i < chunkEnd; i++) {
            for (let aura of effectiveAuras) {
                let chance = aura.effectiveChance;
                let usedBT = aura.effectiveChance !== aura.chance;
                let btChance = usedBT ? aura.effectiveChance : null;
                
                if ((jsEnabled ? jsRandom : Random)(1, Math.floor(chance / luck.value)) === 1) {
                    aura.wonCount++;
                    if (usedBT) {
                        if (!btAuras[aura.name]) {
                            btAuras[aura.name] = { count: 0, btChance: btChance };
                        }
                        btAuras[aura.name].count++;
                    }
                    break;
                }
            }
            rolls++;
        }

        // Update progress
        currentRoll = chunkEnd;
        const progress = (currentRoll / total) * 100;
        // Only update progress UI if we're showing it
        if (total >= 100000) {
            requestAnimationFrame(() => {
                progressFill.style.width = `${progress}%`;
                progressText.textContent = `${Math.floor(progress)}%`;
            });
        }

        // Continue or finish
        if (currentRoll < total) {
            setTimeout(processChunk, 0);
        } else {
            // Hide progress bar
            progressContainer.style.display = 'none';
            
            // Enable roll button
            rollButton.disabled = false;
            rollButton.style.opacity = '1';
            isRolling = false;
            
            const endTime = performance.now();
            const executionTime = ((endTime - startTime) / 1000).toFixed(0);

            if (total === 1) {
                for (let aura of auras) {
                    if (aura.wonCount > 0 && aura.cutscene && !isMobileDevice()) {
                        playAuraVideo(aura.cutscene);
                        break;
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
            Rolls: ${rolls.toLocaleString()}<br>
            Luck: ${parseFloat(luck.value).toLocaleString()}<br><br>
            `;
            let resultEntries = [];
            for (let aura of auras) {
                if (aura.wonCount > 0) {
                    let rarityClass = getRarityClass(aura); // Pass the full aura object
                    if (btAuras[aura.name]) {
                        let btName = aura.name.replace(
                            /-\s*[\d,]+/,
                            `- ${btAuras[aura.name].btChance.toLocaleString()}`
                        );
                        resultEntries.push({
                            label: `<span class="${rarityClass}">[Native] ${btName} | Times Rolled: ${btAuras[aura.name].count.toLocaleString()}</span>`,
                            chance: btAuras[aura.name].btChance
                        });
                        if (aura.wonCount > btAuras[aura.name].count) {
                            resultEntries.push({
                                label: `<span class="${rarityClass}">${aura.name} | Times Rolled: ${(aura.wonCount - btAuras[aura.name].count).toLocaleString()}</span>`,
                                chance: aura.chance
                            });
                        }
                    } else {
                        resultEntries.push({
                            label: `<span class="${rarityClass}">${aura.name} | Times Rolled: ${aura.wonCount.toLocaleString()}</span>`,
                            chance: aura.chance
                        });
                    }
                }
            }
            resultEntries.sort((a, b) => b.chance - a.chance);
            for (let entry of resultEntries) {
                resultText += entry.label + "<br>";
            }
            results.innerHTML = resultText;
        }
    }

    // Start processing
    setTimeout(processChunk, 0);
}

