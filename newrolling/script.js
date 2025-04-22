const rollBtn = document.getElementById('rollBtn');
const resultEl = document.getElementById('result');
const logEl = document.getElementById('log');
const statsBtn = document.getElementById('statsBtn');
const statsModal = document.getElementById('statsModal');
const statsContent = document.getElementById('statsContent');
const closeModal = document.getElementById('closeModal');
const luckInput = document.getElementById('luckInput');
const rollsInput = document.getElementById('rollsInput');
const paginationEl = document.getElementById('pagination');
const logContainer = document.getElementById('log-container');

// Rarity classes based on chance ranges
const rarityClasses = [
  { name: "Unimaginable", minChance: 1000000000, maxChance: 2000000000, class: "unimaginable" },
  { name: "Divine", minChance: 100000000, maxChance: 999999999, class: "divine" },
  { name: "Mythic", minChance: 10000000, maxChance: 99999999, class: "mythic" },
  { name: "Legendary", minChance: 1000000, maxChance: 9999999, class: "legendary" },
  { name: "Epic", minChance: 100000, maxChance: 999999, class: "epic" },
  { name: "Rare", minChance: 10000, maxChance: 99999, class: "rare" },
  { name: "Uncommon", minChance: 1000, maxChance: 9999, class: "uncommon" },
  { name: "Common", minChance: 1, maxChance: 999, class: "common" }
];

// List of all possible auras with their chances
const auras = [
  // Unimaginable (1B+)
  { name: "Unimaginable Genesis", chance: 2000000000, rarityClass: "unimaginable" },
  { name: "Eternal Void", chance: 1500000000, rarityClass: "unimaginable" },
  
  // Divine (100M-1B)
  { name: "Celestial Harmony", chance: 900000000, rarityClass: "divine" },
  { name: "Astral Genesis", chance: 500000000, rarityClass: "divine" },
  { name: "Cosmic Balance", chance: 200000000, rarityClass: "divine" },
  
  // Mythic (10M-100M)
  { name: "Phoenix Rebirth", chance: 80000000, rarityClass: "mythic" },
  { name: "Ethereal Dream", chance: 50000000, rarityClass: "mythic" },
  { name: "Eldritch Vision", chance: 25000000, rarityClass: "mythic" },
  
  // Legendary (1M-10M)
  { name: "Dragon's Breath", chance: 8000000, rarityClass: "legendary" },
  { name: "Starfall", chance: 5000000, rarityClass: "legendary" },
  { name: "Ancient Wisdom", chance: 2000000, rarityClass: "legendary" },
  
  // Epic (100K-1M)
  { name: "Thunderstorm", chance: 800000, rarityClass: "epic" },
  { name: "Moonlight Shadow", chance: 500000, rarityClass: "epic" },
  { name: "Frost Nova", chance: 250000, rarityClass: "epic" },
  
  // Rare (10K-100K)
  { name: "Wild Spirit", chance: 80000, rarityClass: "rare" },
  { name: "Mystic Flame", chance: 50000, rarityClass: "rare" },
  { name: "Ocean Depths", chance: 20000, rarityClass: "rare" },
  
  // Uncommon (1K-10K)
  { name: "Mountain Breeze", chance: 8000, rarityClass: "uncommon" },
  { name: "Forest Whisper", chance: 5000, rarityClass: "uncommon" },
  { name: "Desert Heat", chance: 2000, rarityClass: "uncommon" },
  
  // Common (1-1K)
  { name: "Stone Touch", chance: 800, rarityClass: "common" },
  { name: "Gentle Rain", chance: 500, rarityClass: "common" },
  { name: "Autumn Leaf", chance: 200, rarityClass: "common" },
  { name: "Morning Dew", chance: 100, rarityClass: "common" },
  { name: "Summer Breeze", chance: 50, rarityClass: "common" },
  { name: "Calm Water", chance: 20, rarityClass: "common" },
  { name: "Ordinary Presence", chance: 2, rarityClass: "common" } // Added very common aura
];

// Load statistics from localStorage or initialize empty stats
let stats = JSON.parse(localStorage.getItem('auraStats')) || initializeStats();

// Pagination state
const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let totalPages = 1;
let currentAuras = [];

function initializeStats() {
  const initialStats = {};
  auras.forEach(aura => {
    initialStats[aura.name] = {
      count: 0,
      firstDiscovered: null,
      rarityClass: aura.rarityClass
    };
  });
  return initialStats;
}

function saveStats() {
  localStorage.setItem('auraStats', JSON.stringify(stats));
}

function getLuckValue() {
  const luck = parseInt(luckInput.value);
  if (isNaN(luck) || luck < 1) {
    luckInput.value = 1;
    return 1;
  }
  if (luck > 1000000) {
    luckInput.value = 1000000;
    return 1000000;
  }
  return luck;
}

function getRollsCount() {
  const rolls = parseInt(rollsInput.value);
  if (isNaN(rolls) || rolls < 1) {
    rollsInput.value = 1;
    return 1;
  }
  if (rolls > 1000000) {
    rollsInput.value = 1000000;
    return 1000000;
  }
  return rolls;
}

// Reverted to original top-down roll approach with luck factor
function topDownRoll(luck = 1) {
  // Sort auras by chance (highest/rarest first)
  const sortedAuras = [...auras].sort((a, b) => b.chance - a.chance);
  
  for (let aura of sortedAuras) {
    // Apply luck factor by dividing the chance by luck
    const adjustedChance = Math.max(Math.floor(aura.chance / luck), 1);
    
    // Generate a random number between 1 and the adjusted chance value
    const roll = Math.floor(Math.random() * adjustedChance) + 1;
    // If we roll a 1, return this aura
    if (roll === 1) {
      return aura;
    }
  }
  
  // If no aura is rolled, return the most common one (1 in 2 chance)
  return auras.find(aura => aura.chance === 2);
}

function getRarityClass(aura) {
  return rarityClasses.find(rc => rc.class === aura.rarityClass);
}

function updateStats(aura) {
  if (!stats[aura.name]) {
    stats[aura.name] = {
      count: 0,
      firstDiscovered: null,
      rarityClass: aura.rarityClass
    };
  }
  
  stats[aura.name].count++;
  if (stats[aura.name].firstDiscovered === null) {
    stats[aura.name].firstDiscovered = new Date().toISOString();
  }
  saveStats();
}

// Optimized display stats function with pagination
function displayStats() {
  statsContent.innerHTML = '<h2>Aura Collection</h2>';
  
  // Sort auras by rarity (highest to lowest) for pagination
  currentAuras = [...auras].sort((a, b) => b.chance - a.chance);
  
  // Calculate total pages - first page is for classes summary, rest are for auras
  totalPages = 1 + Math.ceil(currentAuras.length / ITEMS_PER_PAGE);
  currentPage = 1;
  
  updateStatsContent();
  updatePagination();
}

function updateStatsContent() {
  // Clear previous content
  statsContent.innerHTML = '<h2>Aura Collection</h2>';
  
  if (currentPage === 1) {
    // First page shows the rarity class summary
    displayRarityClassSummary();
  } else {
    // Other pages show auras with pagination
    // The actual aura page is currentPage - 1 since page 1 is for classes
    displayAurasForPage(currentPage - 1);
  }
}

function displayRarityClassSummary() {
  // Create rarity class summary table
  const rarityTable = document.createElement('table');
  rarityTable.innerHTML = `
    <thead>
      <tr>
        <th>Rarity</th>
        <th>Odds Range</th>
        <th>Discovered</th>
        <th>Total Count</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  
  const rarityTbody = rarityTable.querySelector('tbody');
  const fragment = document.createDocumentFragment();
  
  // Process stats for each rarity class
  rarityClasses.forEach(rarityClass => {
    const tr = document.createElement('tr');
    
    // Count discovered auras and total rolls in this rarity class
    const aurasInClass = Object.entries(stats).filter(([_, stat]) => 
      stat.rarityClass === rarityClass.class);
    const discoveredCount = aurasInClass.filter(([_, stat]) => 
      stat.firstDiscovered !== null).length;
    const totalAurasInClass = auras.filter(aura => 
      aura.rarityClass === rarityClass.class).length;
    const totalCount = aurasInClass.reduce((sum, [_, stat]) => 
      sum + stat.count, 0);
    
    // Format the odds range
    const oddsRange = `1/${rarityClass.minChance.toLocaleString()} - 1/${rarityClass.maxChance.toLocaleString()}`;
    
    tr.innerHTML = `
      <td><span class="${rarityClass.class}">${rarityClass.name}</span></td>
      <td>${oddsRange}</td>
      <td>${discoveredCount}/${totalAurasInClass}</td>
      <td>${totalCount}</td>
    `;
    fragment.appendChild(tr);
  });
  
  rarityTbody.appendChild(fragment);
  statsContent.appendChild(rarityTable);
  
  // Add navigation hint but don't show any auras on the first page
  const hint = document.createElement('p');
  hint.textContent = `Use the pagination controls to view all ${currentAuras.length} auras.`;
  hint.style.textAlign = 'center';
  hint.style.marginTop = '20px';
  statsContent.appendChild(hint);
}

function displayAurasForPage(pageIndex, isFirstPage = false) {
  // Create aura details table with pagination
  const auraTable = document.createElement('table');
  auraTable.innerHTML = `
    <thead>
      <tr>
        <th>Aura</th>
        <th>Rarity</th>
        <th>Odds</th>
        <th>Discovered</th>
        <th>Count</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  
  const auraTbody = auraTable.querySelector('tbody');
  const fragment = document.createDocumentFragment();
  
  // Calculate start and end indices for current page
  const itemsPerPage = ITEMS_PER_PAGE;
  const startIdx = (pageIndex - 1) * itemsPerPage; // Correct indexing (page 1 shows first batch of auras)
  const endIdx = Math.min(startIdx + itemsPerPage, currentAuras.length);
  
  // Add heading for the auras
  const totalAuraPages = Math.ceil(currentAuras.length / ITEMS_PER_PAGE);
  statsContent.appendChild(document.createElement('h3')).textContent = 
    `Auras (Page ${pageIndex}/${totalAuraPages})`;
  
  // Only render auras for current page
  for (let i = startIdx; i < endIdx; i++) {
    const aura = currentAuras[i];
    const tr = document.createElement('tr');
    const stat = stats[aura.name] || { count: 0, firstDiscovered: null };
    
    const rarityClass = getRarityClass(aura);
    
    tr.innerHTML = `
      <td><span class="${aura.rarityClass}">${aura.name}</span></td>
      <td>${rarityClass.name}</td>
      <td>1/${aura.chance.toLocaleString()}</td>
      <td>${stat.firstDiscovered ? 'Yes' : 'No'}</td>
      <td>${stat.count}</td>
    `;
    fragment.appendChild(tr);
  }
  
  auraTbody.appendChild(fragment);
  statsContent.appendChild(auraTable);
}

function updatePagination() {
  paginationEl.innerHTML = '';
  
  if (totalPages <= 1) {
    return;
  }
  
  const fragment = document.createDocumentFragment();
  
  // Previous button
  if (currentPage > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '←';
    prevBtn.className = 'page-btn';
    prevBtn.addEventListener('click', () => {
      currentPage--;
      updateStatsContent();
      updatePagination();
    });
    fragment.appendChild(prevBtn);
  }
  
  // Page numbers
  const maxButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);
  
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = i === 1 ? 'Classes' : `P${i-1}`;
    pageBtn.className = i === currentPage ? 'page-btn active' : 'page-btn';
    pageBtn.addEventListener('click', () => {
      currentPage = i;
      updateStatsContent();
      updatePagination();
    });
    fragment.appendChild(pageBtn);
  }
  
  // Next button
  if (currentPage < totalPages) {
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '→';
    nextBtn.className = 'page-btn';
    nextBtn.addEventListener('click', () => {
      currentPage++;
      updateStatsContent();
      updatePagination();
    });
    fragment.appendChild(nextBtn);
  }
  
  paginationEl.appendChild(fragment);
}

// Function to simulate multiple rolls
async function performBulkRolls(count) {
  // Enable scrolling on log
  logContainer.classList.add('scrollable');
  logEl.style.maxHeight = '300px';
  
  const luck = getLuckValue();
  const results = [];
  const batchSize = 1000;
  let completedRolls = 0;
  
  // Create progress notification
  const progressNotification = document.createElement('div');
  progressNotification.className = 'progress-notification';
  progressNotification.textContent = `Rolling... 0/${count}`;
  document.body.appendChild(progressNotification);
  
  // Always clear the log when starting a new batch roll
  logEl.innerHTML = '';
  
  // Process rolls in batches to prevent UI freezing
  for (let i = 0; i < count; i += batchSize) {
    const currentBatchSize = Math.min(batchSize, count - i);
    
    // Process a batch of rolls
    await new Promise(resolve => {
      setTimeout(() => {
        for (let j = 0; j < currentBatchSize; j++) {
          const pick = topDownRoll(luck);
          results.push(pick);
          updateStats(pick);
          completedRolls++;
        }
        
        // Update progress every batch
        progressNotification.textContent = `Rolling... ${completedRolls.toLocaleString()}/${count.toLocaleString()}`;
        resolve();
      }, 0);
    });
  }
  
  // Remove progress notification
  document.body.removeChild(progressNotification);
  
  // Add results to the log
  const fragment = document.createDocumentFragment();
  
  // For smaller batches, show all results
  // For larger batches (>100), show summary stats and just the top/rare finds
  if (count <= 10) {
    // Show all rolls for smaller batches
    for (const pick of results) {
      const entry = document.createElement('div');
      entry.className = 'log-item';
      const rarityClass = getRarityClass(pick);
      
      entry.innerHTML = `<span class="${pick.rarityClass}">${pick.name}</span> <small>(1/${pick.chance.toLocaleString()} - ${rarityClass.name})</small>`;
      fragment.appendChild(entry);
    }
  } else {
    // For larger batches, show summary statistics
    // Count occurrences of each aura
    const counts = {};
    results.forEach(pick => {
      counts[pick.name] = (counts[pick.name] || 0) + 1;
    });
    
    // Convert to array and sort by rarity (rarest first)
    const sortedResults = Object.entries(counts)
      .map(([name, count]) => {
        const aura = auras.find(a => a.name === name);
        return { aura, count };
      })
      .sort((a, b) => b.aura.chance - a.aura.chance);
    
    // Add summary for each aura type found
    sortedResults.forEach(({ aura, count }) => {
      const rarityClass = getRarityClass(aura);
      const percentage = ((count / results.length) * 100).toFixed(2); // Fixed percentage calculation
      
      const entry = document.createElement('div');
      entry.className = 'log-item';
      entry.innerHTML = `<span class="${aura.rarityClass}">${aura.name}</span>: ${count} rolls (${percentage}%) <small>(1/${aura.chance.toLocaleString()} - ${rarityClass.name})</small>`;
      fragment.appendChild(entry);
    });
  }
  
  // Update the result text with the last rolled aura
  const lastPick = results[results.length - 1];
  const rarityClass = getRarityClass(lastPick);
  resultEl.innerHTML = `Last roll: <span class="${lastPick.rarityClass}">${lastPick.name}</span> <small>(1/${lastPick.chance.toLocaleString()} chance - ${rarityClass.name})</small>`;
  
  // Add result count summary at the top of the log
  const summary = document.createElement('div');
  summary.className = 'log-item';
  summary.style.fontWeight = 'bold';
  summary.innerHTML = `Rolled ${count.toLocaleString()} auras with ${luck}x luck`;
  fragment.prepend(summary);
  
  // Add to the log
  logEl.prepend(fragment);
  
  saveStats();
  
  // Scroll to the top of the log
  logEl.scrollTop = 0;
}

rollBtn.addEventListener('click', () => {
  const rollCount = getRollsCount();
  const luck = getLuckValue();
  
  if (rollCount === 1) {
    // Single roll
    const pick = topDownRoll(luck);
    const rarityClass = getRarityClass(pick);
    
    resultEl.innerHTML = `You rolled: <span class="${pick.rarityClass}">${pick.name}</span> <small>(1/${pick.chance.toLocaleString()} chance - ${rarityClass.name})</small>`;

    updateStats(pick);

    const entry = document.createElement('div');
    entry.className = 'log-item';
    entry.innerHTML = `<span class="${pick.rarityClass}">${pick.name}</span> <small>(1/${pick.chance.toLocaleString()})</small> rolled at ${new Date().toLocaleTimeString()}`;
    
    // For single rolls, prepend to existing log but keep max history
    logEl.prepend(entry);
    
    // Strictly limit to 10 entries for single rolls
    const MAX_ENTRIES = 10;
    while (logEl.children.length > MAX_ENTRIES) {
      logEl.removeChild(logEl.lastChild);
    }
    
    saveStats();
  } else {
    // Multiple rolls (always clears log)
    performBulkRolls(rollCount);
  }
});

// Modal control
statsBtn.addEventListener('click', () => {
  displayStats();
  statsModal.classList.add('show');
});

closeModal.addEventListener('click', () => {
  statsModal.classList.remove('show');
});

// Close modal if clicking outside of content
statsModal.addEventListener('click', (e) => {
  if (e.target === statsModal) {
    statsModal.classList.remove('show');
  }
});

// Input validation
luckInput.addEventListener('change', () => {
  getLuckValue();
});

rollsInput.addEventListener('change', () => {
  getRollsCount();
});
