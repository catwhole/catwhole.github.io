// Settings state
let settingsFlashesEnabled = true;
let settingsAnimationsEnabled = true;
let settingsCutscenesEnabled = true;
let settingsWarningsEnabled = true;

// Auto roll state
let autoRollEnabled = false;
let autoRollInterval = null;

function getSettingsState() {
	const flashesToggle = document.getElementById('flashesToggle');
	const animationsToggle = document.getElementById('animationsToggle');
	const cutscenesToggle = document.getElementById('cutscenesToggle');
	const warningsToggle = document.getElementById('warningsToggle');
	settingsFlashesEnabled = flashesToggle ? flashesToggle.checked : true;
	settingsAnimationsEnabled = animationsToggle ? animationsToggle.checked : true;
	settingsCutscenesEnabled = cutscenesToggle ? cutscenesToggle.checked : true;
	settingsWarningsEnabled = warningsToggle ? warningsToggle.checked : true;
}

// Helper for future-proof warnings - only shows if warnings enabled
function showWarning(message) {
	getSettingsState();
	if (!settingsWarningsEnabled) return true; // Skip warning, proceed
	return window.confirm(message);
}

// Seed/hash function (xmur3) -> produces 32-bit seeds from a string/number
function xmur3(str) {
	let h = 1779033703 ^ str.length;
	for (let i = 0; i < str.length; i++) {
		h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
		h = (h << 13) | (h >>> 19);
	}
	return function() {
		h = Math.imul(h ^ (h >>> 16), 2246822507);
		h = Math.imul(h ^ (h >>> 13), 3266489909);
		return (h ^= h >>> 16) >>> 0;
	};
}

// sfc32-style 32-bit generator that exposes a u32 output
let _sfc_a = 0, _sfc_b = 0, _sfc_c = 0, _sfc_d = 0;

function sfc32_u32(a, b, c, d) {
	_sfc_a = a; _sfc_b = b; _sfc_c = c; _sfc_d = d;
	return function() {
		_sfc_a >>>= 0; _sfc_b >>>= 0; _sfc_c >>>= 0; _sfc_d >>>= 0;
		let t = (_sfc_a + _sfc_b) | 0;
		_sfc_a = _sfc_b ^ (_sfc_b >>> 9);
		_sfc_b = (_sfc_c + (_sfc_c << 3)) | 0;
		_sfc_c = (_sfc_c << 21) | (_sfc_c >>> 11);
		_sfc_d = (_sfc_d + 1) | 0;
		t = (t + _sfc_d) | 0;
		_sfc_c = (_sfc_c + t) | 0;
		return t >>> 0;
	};
}

// PRNG container + helpers
const PRNG = (function() {
	let gen = null;

	function seed(seedInput) {
		const s = String(seedInput == null ? Date.now().toString() + Math.random().toString() : seedInput);
		const h = xmur3(s);
		const a = h(); const b = h(); const c = h(); const d = h();
		gen = sfc32_u32(a, b, c, d);
	}

	// returns a 53-bit-precision float in [0,1)
	function float53() {
		// combine two 32-bit outputs to get 53 bits of randomness
		const u1 = gen();
		const u2 = gen();
		const a = u1 >>> 5; // 27 bits
		const b = u2 >>> 6; // 26 bits
		return (a * 67108864 + b) / 9007199254740992; // / 2^53
	}

	// returns integer in [min,max] inclusive, uniform for large ranges
	function int(min, max) {
		min = Math.floor(Number(min));
		max = Math.floor(Number(max));
		if (!isFinite(min) || !isFinite(max)) throw new Error('rng bounds must be finite numbers');
		if (min > max) { const t = min; min = max; max = t; }
		const range = max - min + 1;
		if (range <= 0) return min; // fallback
		const r = Math.floor(float53() * range) + min;
		return r;
	}

	// initialize with a reasonably random seed on load
	seed(Date.now().toString() + Math.random().toString());

	// Expose raw u32 generator for fast bulk operations
	function u32() { return gen(); }

	// Expose raw generator function reference (avoids property lookup in hot loops)
	function getGen() { return gen; }

	// Get/set state for fully inlined bulk operations
	function getState() { return { a: _sfc_a, b: _sfc_b, c: _sfc_c, d: _sfc_d }; }
	function setState(a, b, c, d) { _sfc_a = a; _sfc_b = b; _sfc_c = c; _sfc_d = d; }

	return { seed, int, u32, getGen, getState, setState };
})();

// Public RNG function as requested: rng(min, max)
function rng(min, max) {
	return PRNG.int(min, max);
}

// Roll logic
// auraList: array of aura objects (see user's auras.json structure)
// options: { luck: number (default 1), biome: string|null }
function buildCandidates(auraList, options = {}) {
	const luck = options.luck == null ? 1 : Math.max(0.0000001, Number(options.luck));
	const biome = options.biome == null ? null : String(options.biome);

	if (!Array.isArray(auraList) || auraList.length === 0) return { finals: [], entries: [], len: 0 };

	const list = auraList;
	const candidates = [];
	for (let i = 0; i < list.length; i++) {
		const aura = list[i];
		const base = Number(aura.rarity || 0);
		if (!isFinite(base) || base <= 0) continue;

		// Check if aura is a "null" aura (has null amplification)
		const isNullAura = aura.biomeAmplified && typeof aura.biomeAmplified === 'object' && aura.biomeAmplified['null'] != null;
		const isLimboExclusive = aura.biomeExclusive === 'limbo';
		// Track if this is a limbo aura (for coloring when in limbo biome)
		const isLimboAura = biome === 'limbo' && (isLimboExclusive || isNullAura);

		// Limbo biome special case: only allow limbo-exclusive OR null auras
		if (biome === 'limbo') {
			if (!isLimboExclusive && !isNullAura) continue;
		}

		// Biome exclude/exclusive checks (skip for limbo since handled above)
		if (biome !== 'limbo') {
			if (aura.biomeExclude && biome && String(aura.biomeExclude) === biome) continue;
			if (aura.biomeExclusive && biome && String(aura.biomeExclusive) !== biome) continue;
			if (aura.biomeExclusive && !biome) continue; // exclusive but no biome selected
		} else {
			// In limbo, still exclude auras that explicitly exclude limbo
			if (aura.biomeExclude && String(aura.biomeExclude) === 'limbo') continue;
		}
		const exclusiveApplied = !!(aura.biomeExclusive && biome && String(aura.biomeExclusive) === biome);

		let finalR = Math.floor(base);
		let displayRarity = finalR;
		let nativeApplied = false;

		// biomeAmplified can be an object {BiomeName: factor} or a single number
		if (aura.biomeAmplified) {
			if (typeof aura.biomeAmplified === 'object') {
				// Glitch biome special: applies ALL biome amplifications (except cyberspace)
				if (biome === 'glitch') {
					let bestFactor = null;
					for (const [biomeName, factor] of Object.entries(aura.biomeAmplified)) {
						// Skip cyberspace amplifications in glitch biome
						if (biomeName === 'cyberspace') continue;
						const f = Number(factor);
						if (f != null && isFinite(f) && (bestFactor == null || f > bestFactor)) {
							bestFactor = f;
						}
					}
					if (bestFactor != null) {
						finalR = Math.floor(finalR / bestFactor);
						displayRarity = finalR;
						nativeApplied = true;
					}
				} else {
					// Only apply biome amplification if a biome is actually selected
					if (biome) {
						const f = aura.biomeAmplified[biome];
						if (f != null) {
							finalR = Math.floor(finalR / Number(f));
							displayRarity = finalR;
							nativeApplied = true;
						}
					}
				}
			} else {
				// if a single number is provided assume it applies
				const f = Number(aura.biomeAmplified);
				if (f && isFinite(f)) {
					finalR = Math.floor(finalR / f);
					displayRarity = finalR;
					nativeApplied = true;
				}
			}
		}

		displayRarity = Math.max(2, Math.floor(displayRarity));
		
		// Illusionary is unaffected by luck - always 1 in 10,000,000
		const auraBaseName = (aura.name || '').split(' - ')[0];
		if (auraBaseName === 'Illusionary') {
			finalR = 10000000; // Always 1 in 10 million
		} else {
			finalR = Math.floor(finalR / luck);
		}
		// Cap at 1 in 2 rarity as requested -> minimum rarity value should be 2
		finalR = Math.max(2, finalR);

		const name = aura.name || 'Unknown';
		const resultKey = name + '|' + (nativeApplied ? displayRarity : 'base') + '|' + (exclusiveApplied ? 'ex' : '') + '|' + (isLimboAura ? 'limbo' : '');
		candidates.push({ aura, finalR, displayRarity, nativeApplied, exclusiveApplied, isLimboAura, order: i, resultKey });
	}

	if (candidates.length === 0) return { finals: [], entries: [], len: 0 };

	// Sort by display rarity (rarest first) - this is after biome amplification but before luck
	// This ensures the rolling order puts rarer auras at the top
	candidates.sort((a, b) => (b.displayRarity - a.displayRarity) || (a.order - b.order));

	const len = candidates.length;
	const finals = new Uint32Array(len);
	const entries = new Array(len);
	for (let i = 0; i < len; i++) {
		entries[i] = candidates[i];
		finals[i] = candidates[i].finalR;
	}
	return { finals, entries, len };
}

function rollFromCandidates(candidateSet) {
	if (!candidateSet || candidateSet.len === 0) return null;
	const finals = candidateSet.finals;
	const entries = candidateSet.entries;
	const len = candidateSet.len;
	// Try once per candidate in sequence; if all fail, repeat the sequence until success
	while (true) {
		for (let i = 0; i < len; i++) {
			if (rng(1, finals[i]) === 1) return entries[i];
		}
		// loop will repeat until an aura is chosen (statistically guaranteed eventually)
	}
}

// Fast version for bulk rolling - returns index instead of entry object
// Accepts generator directly to avoid property lookup overhead
function rollFromCandidatesFast(finals, len, gen) {
	while (true) {
		for (let i = 0; i < len; i++) {
			// Equivalent to rng(1, finals[i]) === 1
			// (u32 % n) gives 0 to n-1, we check for 0 (same as rolling a 1)
			if ((gen() % finals[i]) === 0) return i;
		}
	}
}

function rollOne(auraList, options = {}) {
	const candidateSet = buildCandidates(auraList, options);
	return rollFromCandidates(candidateSet);
}

// Helper to perform N rolls quickly and return array of results
function rollMany(auraList, count, options = {}) {
	const n = Math.floor(Number(count) || 0);
	if (n <= 0) return [];
	const out = new Array(n);
	for (let i = 0; i < n; i++) out[i] = rollOne(auraList, options);
	return out;
}

// Minimal helpers to connect UI later
function seedRng(s) { PRNG.seed(s); }

// Data store
let AURAS = [];

function setAuras(list) {
	AURAS = Array.isArray(list) ? list : [];
}

async function loadAuras() {
	try {
		const res = await fetch('auras.json');
		const data = await res.json();
		setAuras(data);
	} catch (err) {
		console.error('Failed to load auras.json', err);
	}
}

function readOptionsFromUI() {
	const rollsInput = document.getElementById('rollsInput');
	const luckInput = document.getElementById('luckInput');
	const biomeSelect = document.getElementById('biomeSelect');
	const count = Math.max(1, Math.floor(Number(rollsInput && rollsInput.value) || 1));
	const luck = Math.max(0.0000001, Number(luckInput && luckInput.value) || 1);
	const biome = biomeSelect && biomeSelect.value ? biomeSelect.value : null;
	return { count, luck, biome };
}

function updateBuffDisplay() {
	const { count, luck, biome } = readOptionsFromUI();
	const luckEl = document.getElementById('buffLuck');
	const rollsEl = document.getElementById('buffRolls');
	const biomeEl = document.getElementById('buffBiome');
	const rollSpeedEl = document.getElementById('buffRollSpeed');
	const biomeLabels = {
		normal: 'Normal',
		day: 'Day',
		night: 'Night',
		rainy: 'Rainy',
		windy: 'Windy',
		snowy: 'Snowy',
		sandstorm: 'Sandstorm',
		hell: 'Hell',
		starfall: 'Starfall',
		heaven: 'Heaven',
		corruption: 'Corruption',
		null: 'NULL',
		dreamspace: 'Dreamspace',
		glitch: 'Glitch',
		cyberspace: 'Cyberspace',
		limbo: 'LIMBO'
	};
	if (luckEl) luckEl.textContent = String(luck);
	if (rollsEl) rollsEl.textContent = String(count);
	if (biomeEl) biomeEl.textContent = biome ? (biomeLabels[biome] || biome) : 'None';
	if (rollSpeedEl) rollSpeedEl.textContent = String(getRollSpeed());
}

function updateProgress(done, total, startTime) {
	const progressText = document.getElementById('progressText');
	const timeText = document.getElementById('timeText');
	const progressBarFill = document.getElementById('progressBarFill');
	const progressBar = document.getElementById('progressBar');
	const progressInfo = document.getElementById('progressInfo');
	const shouldShow = total > 100000 && done < total;
	if (progressBar) progressBar.style.display = shouldShow ? 'block' : 'none';
	if (progressInfo) progressInfo.style.display = shouldShow ? 'flex' : 'none';
	if (progressText) {
		const pct = total > 0 ? Math.floor((done / total) * 100) : 0;
		progressText.textContent = pct + '%';
		if (progressBarFill) progressBarFill.style.width = pct + '%';
	}
	if (timeText && startTime != null) {
		const sec = (performance.now() - startTime) / 1000;
		timeText.textContent = sec.toFixed(2) + 's';
	}
}

function formatRarity(value) {
	const n = Math.max(1, Math.floor(Number(value) || 1));
	return n.toLocaleString('en-US');
}

function replaceRarityInName(name, newRarity) {
	const rarityText = formatRarity(newRarity);
	const marker = ' - ';
	const idx = name.lastIndexOf(marker);
	if (idx !== -1) return name.slice(0, idx + marker.length) + rarityText;
	return name + marker + rarityText;
}

function buildDisplayLine(entry, count) {
	const aura = entry.aura || { name: 'Unknown' };
	const baseName = aura.name || 'Unknown';
	const displayRarity = entry.nativeApplied ? entry.displayRarity : Number(aura.rarity || entry.finalR || 1);
	const name = entry.nativeApplied ? replaceRarityInName(baseName, displayRarity) : baseName;
	const parts = [name, 'Times Rolled: ' + count];
	// In limbo, all auras show [Exclusive] and don't show [Native]
	if (entry.isLimboAura) {
		parts.push('[Exclusive]');
	} else {
		if (entry.nativeApplied) parts.push('[Native]');
		if (entry.exclusiveApplied) parts.push('[Exclusive]');
	}
	return parts.join(' | ');
}

// Special aura names that have unique rarity classes
const CHALLENGED_AURAS = ['Glitch', 'Borealis', 'Leviathan'];
const CHALLENGED_PLUS_AURAS = ['Dreammetric', 'Oppression', 'Illusionary', 'Monarch'];

function getBaseAuraName(fullName) {
	// Extract just the aura name (before the " - " rarity part)
	if (!fullName) return '';
	const dashIndex = fullName.indexOf(' - ');
	return dashIndex > 0 ? fullName.substring(0, dashIndex) : fullName;
}

function getRarityClass(chance, auraName) {
	// Check for special challenged auras first
	const baseName = getBaseAuraName(auraName);
	if (CHALLENGED_AURAS.includes(baseName)) return 'rarity-challenged';
	if (CHALLENGED_PLUS_AURAS.includes(baseName)) return 'rarity-challengedplus';
	
	const value = Math.max(1, Math.floor(Number(chance) || 1));
	if (value >= 1000000000) return 'rarity-transcendent';
	if (value >= 99999999) return 'rarity-glorious';
	if (value >= 10000000) return 'rarity-exalted';
	if (value >= 1000000) return 'rarity-mythic';
	if (value >= 99999) return 'rarity-legendary';
	if (value >= 10000) return 'rarity-unique';
	if (value >= 1000) return 'rarity-epic';
	return 'rarity-basic';
}

function applyRarityClass(el, rarityClass) {
	if (!el) return;
	el.classList.remove(
		'rarity-basic',
		'rarity-epic',
		'rarity-unique',
		'rarity-legendary',
		'rarity-mythic',
		'rarity-exalted',
		'rarity-glorious',
		'rarity-transcendent',
		'rarity-challenged',
		'rarity-challengedplus',
		'rarity-limbo'
	);
	el.classList.add(rarityClass);
}

function getAuraOrderMap(list) {
	const map = new Map();
	for (let i = 0; i < list.length; i++) {
		const name = list[i] && list[i].name ? list[i].name : 'Unknown';
		if (!map.has(name)) map.set(name, i);
	}
	return map;
}

function renderResults(counts) {
	const box = document.getElementById('resultsBox');
	if (!box) return;
	box.innerHTML = '';
	const frag = document.createDocumentFragment();
	const orderMap = getAuraOrderMap(AURAS);
	const entries = Array.from(counts.values());
	if (entries.length === 0) {
		box.style.display = 'none';
		box.dataset.hasResults = 'false';
		return;
	}
	
	// Add stats row at the top
	const { count, luck, biome } = readOptionsFromUI();
	const biomeLabels = {
		normal: 'Normal', day: 'Day', night: 'Night', rainy: 'Rainy', windy: 'Windy',
		snowy: 'Snowy', sandstorm: 'Sandstorm', hell: 'Hell', starfall: 'Starfall',
		heaven: 'Heaven', corruption: 'Corruption', null: 'NULL', dreamspace: 'Dreamspace',
		glitch: 'Glitch', cyberspace: 'Cyberspace', limbo: 'LIMBO'
	};
	const statsRow = document.createElement('div');
	statsRow.id = 'resultsStatsRow';
	statsRow.innerHTML = `Luck: ${luck} | Rolls: ${count.toLocaleString()} | Biome: ${biome ? (biomeLabels[biome] || biome) : 'None'}`;
	frag.appendChild(statsRow);
	
	entries.sort((a, b) => {
		const ar = a.entry.nativeApplied ? a.entry.displayRarity : Number(a.entry.aura && a.entry.aura.rarity) || 1;
		const br = b.entry.nativeApplied ? b.entry.displayRarity : Number(b.entry.aura && b.entry.aura.rarity) || 1;
		if (br !== ar) return br - ar; // rare to common
		const an = (a.entry.aura && a.entry.aura.name) || 'Unknown';
		const bn = (b.entry.aura && b.entry.aura.name) || 'Unknown';
		return (orderMap.get(an) ?? 0) - (orderMap.get(bn) ?? 0);
	});
	for (const value of entries) {
		const div = document.createElement('div');
		const aura = value.entry.aura || { rarity: 1 };
		const auraName = aura.name || 'Unknown';
		const displayRarity = value.entry.nativeApplied ? value.entry.displayRarity : Number(aura.rarity || value.entry.finalR || 1);
		// Use limbo color for all auras when in limbo biome
		if (value.entry.isLimboAura) {
			applyRarityClass(div, 'rarity-limbo');
		} else {
			applyRarityClass(div, getRarityClass(displayRarity, auraName));
		}
		div.textContent = buildDisplayLine(value.entry, value.count);
		frag.appendChild(div);
	}
	box.appendChild(frag);
	box.style.display = 'block';
	box.dataset.hasResults = 'true';
}

function showSingleResult(result) {
	const single = document.getElementById('singleResult');
	const box = document.getElementById('resultsBox');
	if (box) box.style.display = 'none';
	if (!single) return;
	if (!result) {
		single.style.display = 'none';
		single.textContent = '';
		return;
	}
	const aura = result.aura || { name: 'Unknown' };
	const baseName = aura.name || 'Unknown';
	const displayRarity = result.nativeApplied ? result.displayRarity : Number(aura.rarity || result.finalR || 1);
	const name = result.nativeApplied ? replaceRarityInName(baseName, displayRarity) : baseName;
	let textEl = single.querySelector('.singleResultText');
	if (!textEl) {
		textEl = document.createElement('span');
		textEl.className = 'singleResultText';
		single.innerHTML = '';
		single.appendChild(textEl);
	}
	textEl.textContent = name;
	// Use limbo color for limbo auras in single result
	if (result.isLimboAura) {
		applyRarityClass(textEl, 'rarity-limbo');
	} else {
		applyRarityClass(textEl, getRarityClass(displayRarity, baseName));
	}
	// Get current settings
	getSettingsState();
	// Apply animation classes based on settings
	textEl.classList.remove('anim-base', 'anim-10m', 'anim-100m', 'anim-1b', 'anim-challenged', 'anim-challengedplus');
	single.classList.remove('flash');
	if (settingsAnimationsEnabled) {
		// Check for special challenged auras first
		const auraBaseName = getBaseAuraName(baseName);
		if (CHALLENGED_AURAS.includes(auraBaseName)) {
			textEl.classList.add('anim-challenged');
			if (settingsFlashesEnabled) single.classList.add('flash');
		} else if (CHALLENGED_PLUS_AURAS.includes(auraBaseName)) {
			textEl.classList.add('anim-challengedplus');
			if (settingsFlashesEnabled) single.classList.add('flash');
		} else if (displayRarity >= 1000000000) {
			textEl.classList.add('anim-1b');
			if (settingsFlashesEnabled) single.classList.add('flash');
		} else if (displayRarity >= 99999999) {
			textEl.classList.add('anim-100m');
		} else if (displayRarity >= 10000000) {
			textEl.classList.add('anim-10m');
		} else {
			textEl.classList.add('anim-base');
		}
		textEl.style.animation = 'none';
		void textEl.offsetHeight;
		textEl.style.animation = '';
	}
	single.style.display = 'flex';
	single.style.visibility = 'visible'; // Reset visibility in case it was hidden by panel toggle
}

function playSingleRollSfx(result) {
	if (!result) return;
	const aura = result.aura || { rarity: 0 };
	const displayRarity = result.nativeApplied ? result.displayRarity : Number(aura.rarity || result.finalR || 1);
	const rarity = Math.max(1, Math.floor(displayRarity));
	if (typeof playRaritySfx !== 'function') return;
	if (rarity >= 99999999) return playRaritySfx('sfx100m');
	if (rarity >= 10000000) return playRaritySfx('sfx10m');
	if (rarity >= 99999) return playRaritySfx('sfx100k');
	if (rarity >= 10000) return playRaritySfx('sfx10k');
	if (rarity >= 1000) return playRaritySfx('sfx1k');
}

function hideResultsAndSingle() {
	const single = document.getElementById('singleResult');
	const box = document.getElementById('resultsBox');
	if (single) single.style.display = 'none';
	if (box) box.style.display = 'none';
}

async function runRolls() {
	const btn = document.getElementById('rollButton');
	if (btn) btn.disabled = true;
	if (typeof playSound === 'function') playSound('rollSound');
	const rollPanel = document.getElementById('rollOptionsPanel');
	const settingsPanel = document.getElementById('settingsPanel');
	if (rollPanel) rollPanel.classList.remove('open');
	if (settingsPanel) settingsPanel.classList.remove('open');
	const rollBtn = document.getElementById('rollOptionsBtn');
	const settingsBtn = document.getElementById('settingsBtn');
	if (rollBtn) rollBtn.setAttribute('data-enabled', 'false');
	if (settingsBtn) settingsBtn.setAttribute('data-enabled', 'false');

	const { count, luck, biome } = readOptionsFromUI();
	if (count > 999999) {
		const ok = showWarning('You set a lot of rolls. It might take some time and your browser could lag. Are you sure?');
		if (!ok) {
			if (btn) btn.disabled = false;
			return;
		}
	}
	updateBuffDisplay();
	const total = count;
	const single = document.getElementById('singleResult');
	if (single) single.style.display = 'none';
	hideResultsAndSingle();
	const start = performance.now();
	const candidateSet = buildCandidates(AURAS, { luck, biome });
	if (candidateSet.len === 0) {
		updateProgress(0, total, start);
		if (btn) btn.disabled = false;
		return;
	}

	if (total === 1) {
		const result = rollFromCandidates(candidateSet);
		showSingleResult(result);
		playSingleRollSfx(result);
		updateProgress(1, 1, start);
		
		// Check if we should stop auto roll based on rarity threshold
		if (autoRollEnabled) {
			const autoStopInput = document.getElementById('autoStopRarityInput');
			const threshold = autoStopInput ? Number(autoStopInput.value) : 0;
			if (threshold > 0 && result) {
				const aura = result.aura || { rarity: 0 };
				const displayRarity = result.nativeApplied ? result.displayRarity : Number(aura.rarity || result.finalR || 1);
				if (displayRarity >= threshold) {
					stopAutoRoll();
				}
			}
		}
		
		if (btn) btn.disabled = false;
		return;
	}

	// For bulk rolls, use optimized path with Uint32Array for counts
	const finals = candidateSet.finals;
	const entries = candidateSet.entries;
	const len = candidateSet.len;
	const countArr = new Uint32Array(len);

	// Get RNG state directly for inlining (avoids ALL function call overhead)
	const rngState = PRNG.getState();
	let sa = rngState.a, sb = rngState.b, sc = rngState.c, sd = rngState.d;

	// Larger chunks since we're much faster now
	const chunkSize = 50000;
	const yieldEveryNChunks = 5;
	let done = 0;
	let chunkCount = 0;
	
	while (done < total) {
		const end = Math.min(total, done + chunkSize);
		// FULLY INLINED hot loop - no function calls at all
		for (let r = done; r < end; r++) {
			// Roll one aura (top-to-bottom)
			let idx = -1;
			while (idx < 0) {
				for (let i = 0; i < len; i++) {
					// Inline sfc32
					sa >>>= 0; sb >>>= 0; sc >>>= 0; sd >>>= 0;
					let t = (sa + sb) | 0;
					sa = sb ^ (sb >>> 9);
					sb = (sc + (sc << 3)) | 0;
					sc = (sc << 21) | (sc >>> 11);
					sd = (sd + 1) | 0;
					t = (t + sd) | 0;
					sc = (sc + t) | 0;
					const rnd = t >>> 0;
					// Check if hit
					if ((rnd % finals[i]) === 0) {
						idx = i;
						break;
					}
				}
			}
			countArr[idx]++;
		}
		done = end;
		chunkCount++;
		
		if (chunkCount % yieldEveryNChunks === 0) {
			updateProgress(done, total, start);
			await new Promise(r => setTimeout(r, 0));
		}
	}
	// Save RNG state back
	PRNG.setState(sa, sb, sc, sd);
	updateProgress(done, total, start);

	// Convert Uint32Array to Map for rendering
	const counts = new Map();
	for (let i = 0; i < len; i++) {
		if (countArr[i] > 0) {
			counts.set(entries[i].resultKey, { entry: entries[i], count: countArr[i] });
		}
	}

	renderResults(counts);
	if (btn) btn.disabled = false;
}

// Auto roll functions
function updateAutoRollVisibility() {
	const rollsInput = document.getElementById('rollsInput');
	const autoRollBtn = document.getElementById('autoRollBtn');
	const rollSpeedInput = document.getElementById('rollSpeedInput');
	const rolls = Math.floor(Number(rollsInput && rollsInput.value) || 1);
	
	if (autoRollBtn) {
		autoRollBtn.style.display = rolls === 1 ? 'inline-block' : 'none';
		// Stop auto roll if rolls changed away from 1
		if (rolls !== 1 && autoRollEnabled) {
			stopAutoRoll();
		}
	}
	if (rollSpeedInput) {
		rollSpeedInput.disabled = rolls !== 1;
	}
}

function getRollSpeed() {
	const rollSpeedInput = document.getElementById('rollSpeedInput');
	let speed = Math.floor(Number(rollSpeedInput && rollSpeedInput.value) || 5);
	// Cap at 15
	if (speed > 15) {
		speed = 15;
		if (rollSpeedInput) rollSpeedInput.value = 15;
	}
	if (speed < 1) {
		speed = 1;
		if (rollSpeedInput) rollSpeedInput.value = 1;
	}
	return speed;
}

function startAutoRoll() {
	if (autoRollInterval) return;
	const speed = getRollSpeed();
	const intervalMs = Math.floor(1000 / speed);
	autoRollInterval = setInterval(() => {
		const btn = document.getElementById('rollButton');
		if (btn && !btn.disabled) {
			runRolls();
		}
	}, intervalMs);
}

function stopAutoRoll() {
	if (autoRollInterval) {
		clearInterval(autoRollInterval);
		autoRollInterval = null;
	}
	autoRollEnabled = false;
	const autoRollBtn = document.getElementById('autoRollBtn');
	if (autoRollBtn) {
		autoRollBtn.textContent = 'Auto Roll: OFF';
		autoRollBtn.setAttribute('data-enabled', 'false');
	}
}

function toggleAutoRoll() {
	const autoRollBtn = document.getElementById('autoRollBtn');
	
	if (!autoRollEnabled) {
		// Check flashes warning
		getSettingsState();
		if (settingsFlashesEnabled) {
			const ok = showWarning('You have flashes enabled. Rolling several Transcendent auras in a row could be quite annoying. Are you sure?');
			if (!ok) return;
		}
		
		autoRollEnabled = true;
		if (autoRollBtn) {
			autoRollBtn.textContent = 'Auto Roll: ON';
			autoRollBtn.setAttribute('data-enabled', 'true');
		}
		startAutoRoll();
	} else {
		stopAutoRoll();
	}
}

// Expose to global for index.html integration
if (typeof window !== 'undefined') {
	window.rng = rng;
	window.rollOne = rollOne;
	window.rollMany = rollMany;
	window.seedRng = seedRng;
	window.setAuras = setAuras;
}

// Wire UI
if (typeof document !== 'undefined') {
	document.addEventListener('DOMContentLoaded', () => {
		loadAuras();
		const btn = document.getElementById('rollButton');
		if (btn) btn.addEventListener('click', runRolls);

		const rollsInput = document.getElementById('rollsInput');
		const luckInput = document.getElementById('luckInput');
		const biomeSelect = document.getElementById('biomeSelect');
		if (rollsInput) {
			rollsInput.addEventListener('input', updateBuffDisplay);
			rollsInput.addEventListener('input', updateAutoRollVisibility);
		}
		if (luckInput) luckInput.addEventListener('input', updateBuffDisplay);
		if (biomeSelect) biomeSelect.addEventListener('change', updateBuffDisplay);

		// Auto roll setup
		const autoRollBtn = document.getElementById('autoRollBtn');
		const rollSpeedInput = document.getElementById('rollSpeedInput');
		if (autoRollBtn) autoRollBtn.addEventListener('click', toggleAutoRoll);
		if (rollSpeedInput) {
			rollSpeedInput.addEventListener('change', () => {
				// Enforce cap
				getRollSpeed();
				// Update buff display
				updateBuffDisplay();
				// Restart auto roll with new speed if active
				if (autoRollEnabled) {
					clearInterval(autoRollInterval);
					autoRollInterval = null;
					startAutoRoll();
				}
			});
		}

		updateBuffDisplay();
		updateAutoRollVisibility();
	});
}