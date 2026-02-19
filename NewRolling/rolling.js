let settingsFlashesEnabled = true;
let settingsAnimationsEnabled = true;
let settingsCutscenesEnabled = true;
let settingsWarningsEnabled = true;

let lastSingleResult = null;

let autoRollEnabled = false;
let autoRollInterval = null;

let useWebWorkers = true;
const WORKER_MIN_ROLLS = 250000;
const workerCount = typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency || 4) : 4;

function webWorkersSupported() {
	return typeof Worker !== 'undefined';
}

async function runRollsWithWorkers(candidateSet, total, start) {
	const { finals, entries, len, specialFinals, specialEntries, specialLen } = candidateSet;
	const totalEntries = len + specialLen;
	
	const numWorkers = Math.min(workerCount, Math.ceil(total / 100000));
	
	const rollsPerWorker = Math.floor(total / numWorkers);
	const remainder = total % numWorkers;
	
	const workerProgress = new Array(numWorkers).fill(0);
	const workerTotals = new Array(numWorkers);
	
	const workers = [];
	const promises = [];
	const baseSeed = Date.now().toString() + Math.random().toString();
	
	for (let i = 0; i < numWorkers; i++) {
		const worker = new Worker('roller-worker.js');
		workers.push(worker);
		
		const workerSeed = baseSeed + '_worker_' + i;
		
		const workerRolls = rollsPerWorker + (i < remainder ? 1 : 0);
		workerTotals[i] = workerRolls;
		
		const finalsBuffer = finals.buffer.slice(0);
		const specialFinalsBuffer = specialFinals.buffer.slice(0);
		
		const promise = new Promise((resolve, reject) => {
			worker.onmessage = (e) => {
				if (e.data.type === 'progress') {
					workerProgress[e.data.workerIndex] = e.data.done;
					const totalDone = workerProgress.reduce((a, b) => a + b, 0);
					updateProgress(totalDone, total, start);
				} else if (e.data.type === 'done') {
					workerProgress[i] = workerTotals[i];
					resolve(new Uint32Array(e.data.countArr));
				}
			};
			worker.onerror = (e) => {
				reject(e);
			};
		});
		promises.push(promise);
		
		worker.postMessage({
			rollCount: workerRolls,
			finals: finalsBuffer,
			specialFinals: specialFinalsBuffer,
			len: len,
			specialLen: specialLen,
			seedStr: workerSeed,
			workerIndex: i
		}, [finalsBuffer, specialFinalsBuffer]);
	}
	
	updateProgress(0, total, start);
	
	try {
		const results = await Promise.all(promises);
		
		const countArr = new Uint32Array(totalEntries);
		for (const workerCounts of results) {
			for (let i = 0; i < totalEntries; i++) {
				countArr[i] += workerCounts[i];
			}
		}
		
		updateProgress(total, total, start);
		
		const counts = new Map();
		for (let i = 0; i < specialLen; i++) {
			if (countArr[i] > 0) {
				counts.set(specialEntries[i].resultKey, { entry: specialEntries[i], count: countArr[i] });
			}
		}
		for (let i = 0; i < len; i++) {
			if (countArr[specialLen + i] > 0) {
				counts.set(entries[i].resultKey, { entry: entries[i], count: countArr[specialLen + i] });
			}
		}
		
		return counts;
	} finally {
		for (const worker of workers) {
			worker.terminate();
		}
	}
}

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

function showWarning(message) {
	getSettingsState();
	if (!settingsWarningsEnabled) return Promise.resolve(true);
	
	return new Promise((resolve) => {
		const modal = document.getElementById('warningModal');
		const messageEl = document.getElementById('warningMessage');
		const yesBtn = document.getElementById('warningYes');
		const noBtn = document.getElementById('warningNo');
		
		if (!modal || !messageEl || !yesBtn || !noBtn) {
			resolve(window.confirm(message));
			return;
		}
		
		messageEl.textContent = message;
		modal.classList.remove('hidden');
		
		const cleanup = () => {
			modal.classList.add('hidden');
			yesBtn.removeEventListener('click', handleYes);
			noBtn.removeEventListener('click', handleNo);
		};
		
		const handleYes = () => {
			cleanup();
			resolve(true);
		};
		
		const handleNo = () => {
			cleanup();
			resolve(false);
		};
		
		yesBtn.addEventListener('click', handleYes);
		noBtn.addEventListener('click', handleNo);
		
		const disableCheckbox = document.getElementById('warningDisableCheckbox');
		if (disableCheckbox) {
			disableCheckbox.checked = false;
			disableCheckbox.addEventListener('change', () => {
				const warningsToggle = document.getElementById('warningsToggle');
				if (warningsToggle) {
					warningsToggle.checked = !disableCheckbox.checked;
					getSettingsState();
				}
			});
		}
	});
}

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

const PRNG = (function() {
	let gen = null;

	function seed(seedInput) {
		const s = String(seedInput == null ? Date.now().toString() + Math.random().toString() : seedInput);
		const h = xmur3(s);
		const a = h(); const b = h(); const c = h(); const d = h();
		gen = sfc32_u32(a, b, c, d);
	}

	function float53() {
		const u1 = gen();
		const u2 = gen();
		const a = u1 >>> 5;
		const b = u2 >>> 6;
		return (a * 67108864 + b) / 9007199254740992;
	}

	function int(min, max) {
		min = Math.floor(Number(min));
		max = Math.floor(Number(max));
		if (!isFinite(min) || !isFinite(max)) throw new Error('rng bounds must be finite numbers');
		if (min > max) { const t = min; min = max; max = t; }
		const range = max - min + 1;
		if (range <= 0) return min;
		const r = Math.floor(float53() * range) + min;
		return r;
	}

	seed(Date.now().toString() + Math.random().toString());

	function u32() { return gen(); }

	function getGen() { return gen; }

	function getState() { return { a: _sfc_a, b: _sfc_b, c: _sfc_c, d: _sfc_d }; }
	function setState(a, b, c, d) { _sfc_a = a; _sfc_b = b; _sfc_c = c; _sfc_d = d; }

	return { seed, int, u32, getGen, getState, setState };
})();

function rng(min, max) {
	return PRNG.int(min, max);
}

function buildCandidates(auraList, options = {}) {
	const luck = options.luck == null ? 1 : Math.max(0.0000001, Number(options.luck));
	const biome = options.biome == null ? null : String(options.biome);
	const allowOblivion = options.allowOblivion === true;
	const allowDune = options.allowDune === true;

	if (!Array.isArray(auraList) || auraList.length === 0) return { finals: [], entries: [], len: 0, specialFinals: [], specialEntries: [], specialLen: 0 };

	const list = auraList;
	const candidates = [];
	const specialCandidates = [];
	
	const rareBiomes = new Set(['cyberspace', 'dreamspace', 'glitch']);
	
	const isLimboBiome = biome === 'limbo';
	
	for (let i = 0; i < list.length; i++) {
		const aura = list[i];
		const base = Number(aura.rarity || 0);
		if (!isFinite(base) || base <= 0) continue;

		if (aura.specialAura) {
			if (aura.specialAura === 'oblivion' && !allowOblivion) continue;
			if (aura.specialAura === 'dune' && !allowDune) continue;
			const finalR = Math.max(2, Math.floor(base));
			const displayRarity = finalR;
			const name = aura.name || 'Unknown';
			const resultKey = name + '|' + displayRarity + '|special';
			specialCandidates.push({ aura, finalR, displayRarity, nativeApplied: false, exclusiveApplied: false, isLimboAura: false, isSpecialAura: true, order: i, resultKey });
			continue;
		}

		const isNullAura = aura.biomeAmplified && typeof aura.biomeAmplified === 'object' && aura.biomeAmplified['null'] != null;
		const isLimboExclusive = aura.biomeExclusive === 'limbo';
		const isLimboAura = biome === 'limbo' && (isLimboExclusive || isNullAura);

		if (biome === 'limbo') {
			if (!isLimboExclusive && !isNullAura) continue;
		}

		if (biome !== 'limbo') {
			if (aura.biomeExclude && biome && String(aura.biomeExclude) === biome) continue;
			if (aura.biomeExclusive && biome) {
				const exclusiveBiome = String(aura.biomeExclusive);
				const isRareBiomeExclusive = rareBiomes.has(exclusiveBiome);
				if (biome === 'glitch' && !isRareBiomeExclusive && exclusiveBiome !== 'limbo') {
				} else if (exclusiveBiome !== biome) {
					continue;
				}
			}
			if (aura.biomeExclusive && !biome) continue;
		} else {
			if (aura.biomeExclude && String(aura.biomeExclude) === 'limbo') continue;
		}
		const exclusiveApplied = !!(aura.biomeExclusive && biome && String(aura.biomeExclusive) === biome);

		let finalR = Math.floor(base);
		let displayRarity = finalR;
		let nativeApplied = false;

		if (aura.biomeAmplified) {
			if (typeof aura.biomeAmplified === 'object') {
				if (biome === 'glitch') {
					let bestFactor = null;
					for (const [biomeName, factor] of Object.entries(aura.biomeAmplified)) {
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
				const f = Number(aura.biomeAmplified);
				if (f && isFinite(f)) {
					finalR = Math.floor(finalR / f);
					displayRarity = finalR;
					nativeApplied = true;
				}
			}
		}

		displayRarity = Math.max(2, Math.floor(displayRarity));
		
		const auraBaseName = (aura.name || '').split(' - ')[0];
		if (aura.staticChance) {
			finalR = base;
		} else if (auraBaseName === 'Illusionary') {
			finalR = 10000000;
		} else {
			finalR = Math.floor(finalR / luck);
		}
		if (!isLimboBiome) {
			finalR = Math.max(2, finalR);
		} else {
			finalR = Math.max(1, finalR);
		}

		const name = aura.name || 'Unknown';
		const resultKey = name + '|' + (nativeApplied ? displayRarity : 'base') + '|' + (exclusiveApplied ? 'ex' : '') + '|' + (isLimboAura ? 'limbo' : '');
		candidates.push({ aura, finalR, displayRarity, nativeApplied, exclusiveApplied, isLimboAura, order: i, resultKey });
	}

	if (candidates.length === 0 && specialCandidates.length === 0) {
		return { finals: [], entries: [], len: 0, specialFinals: [], specialEntries: [], specialLen: 0 };
	}

	candidates.sort((a, b) => (b.displayRarity - a.displayRarity) || (a.order - b.order));

	const len = candidates.length;
	const finals = new Uint32Array(len);
	const entries = new Array(len);
	for (let i = 0; i < len; i++) {
		entries[i] = candidates[i];
		finals[i] = candidates[i].finalR;
	}

	const specialLen = specialCandidates.length;
	const specialFinals = new Uint32Array(specialLen);
	const specialEntries = new Array(specialLen);
	for (let i = 0; i < specialLen; i++) {
		specialEntries[i] = specialCandidates[i];
		specialFinals[i] = specialCandidates[i].finalR;
	}

	return { finals, entries, len, specialFinals, specialEntries, specialLen };
}

function rollFromCandidates(candidateSet) {
	if (!candidateSet || (candidateSet.len === 0 && candidateSet.specialLen === 0)) return null;
	const { finals, entries, len, specialFinals, specialEntries, specialLen } = candidateSet;
	
	while (true) {
		for (let i = 0; i < specialLen; i++) {
			if (rng(1, specialFinals[i]) === 1) return specialEntries[i];
		}
		for (let i = 0; i < len; i++) {
			if (rng(1, finals[i]) === 1) return entries[i];
		}
	}
}

function rollFromCandidatesFast(finals, len, gen) {
	while (true) {
		for (let i = 0; i < len; i++) {
			if ((gen() % finals[i]) === 0) return i;
		}
	}
}

function rollOne(auraList, options = {}) {
	const candidateSet = buildCandidates(auraList, options);
	return rollFromCandidates(candidateSet);
}

function rollMany(auraList, count, options = {}) {
	const n = Math.floor(Number(count) || 0);
	if (n <= 0) return [];
	const out = new Array(n);
	for (let i = 0; i < n; i++) out[i] = rollOne(auraList, options);
	return out;
}

function seedRng(s) { PRNG.seed(s); }

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
	const oblivionToggle = document.getElementById('oblivionToggle');
	const duneToggle = document.getElementById('duneToggle');
	const count = Math.max(1, Math.floor(Number(rollsInput && rollsInput.value) || 1));
	const luck = Math.max(0.0000001, Number(luckInput && luckInput.value) || 1);
	const biome = biomeSelect && biomeSelect.value ? biomeSelect.value : null;
	const allowOblivion = oblivionToggle ? oblivionToggle.checked : false;
	const allowDune = duneToggle ? duneToggle.checked : false;
	return { count, luck, biome, allowOblivion, allowDune };
}

function updateBuffDisplay() {
	// if a biome switch is in progress, skip UI updates to avoid mixed visuals
	if (typeof _biomeSwitchLocked !== 'undefined' && _biomeSwitchLocked) return;
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
	if (luckEl) luckEl.textContent = (Number(luck)).toLocaleString('en-US');
	if (rollsEl) rollsEl.textContent = (Number(count)).toLocaleString('en-US');
	if (biomeEl) biomeEl.textContent = biome ? (biomeLabels[biome] || biome) : 'None';
	if (rollSpeedEl) rollSpeedEl.textContent = String(getRollSpeed());
	
	const workersEl = document.getElementById('buffWorkers');
	if (workersEl) {
		if (webWorkersSupported() && useWebWorkers && count >= WORKER_MIN_ROLLS) {
			const numWorkers = Math.min(workerCount, Math.ceil(count / 100000));
			const cpuPercent = Math.round((numWorkers / workerCount) * 100);
			workersEl.textContent = cpuPercent + '%';
		} else {
			workersEl.textContent = 'Minimal';
		}
	}
}

function updateProgress(done, total, startTime) {
	const progressText = document.getElementById('progressText');
	const timeText = document.getElementById('timeText');
	const progressBarFill = document.getElementById('progressBarFill');
	const progressBar = document.getElementById('progressBar');
	const progressInfo = document.getElementById('progressInfo');
	const shouldShow = total > 100000 && done <= total && done < total;
	const showBar = shouldShow || (total > 100000 && done === 0);
	if (progressBar) progressBar.style.display = showBar ? 'block' : 'none';
	if (progressInfo) progressInfo.style.display = showBar ? 'flex' : 'none';
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
	if (entry.isLimboAura) {
		parts.push('[Exclusive]');
	} else {
		if (entry.nativeApplied) parts.push('[Native]');
		if (entry.exclusiveApplied) parts.push('[Exclusive]');
	}
	return parts.join(' | ');
}

const CHALLENGED_AURAS = ['Glitch', 'Borealis', 'Leviathan', 'Memory', 'Neferkhaf'];
const CHALLENGED_PLUS_AURAS = ['Dreammetric', 'Oppression', 'Illusionary', 'Monarch', 'Oblivion'];

function getBaseAuraName(fullName) {
	if (!fullName) return '';
	const dashIndex = fullName.indexOf(' - ');
	return dashIndex > 0 ? fullName.substring(0, dashIndex) : fullName;
}

const CUSTOM_AURA_STYLES = {
	'Equinox': { styleId: 'equinox', displayName: 'Equinox' },
	'BREAKTHROUGH': { styleId: 'breakthrough', displayName: 'BREAKTHROUGH' },
	'Luminosity': { styleId: 'luminosity', displayName: '[ Luminosity ]' },
	'Ascendant': { styleId: 'ascendant', displayName: 'ASCENDANT' },
	'Pixelation': { styleId: 'pixelation', displayName: '▣ PIXELATION ▣' },
	'Nyctophobia': { styleId: 'nyctophobia', displayName: 'NYCTOPHOBIA', zalgo: true },
	'Pythios': { styleId: 'pythios', displayName: 'PYTHIOS' },
	'Matrix : Reality': { styleId: 'matrix-reality', displayName: 'MATRIX ▫ REALITY' },
	'PROLOGUE': { styleId: 'prologue', displayName: 'PROLOGUE' },
	'Dreamscape': { styleId: 'dreamscape', displayName: 'dreamscape' },
	'Oppression': { styleId: 'oppression', displayName: '[Oppression]', randomCase: true },
	'Dreammetric': { styleId: 'dreammetric', displayName: 'Dreammetric' },
	'Oblivion': { styleId: 'oblivion', displayName: 'OBLIVION', hideRarity: true },
	'Illusionary': { styleId: 'illusionary', displayName: 'illusionary', colorFlash: true },
	'Monarch': { styleId: 'monarch', displayName: 'MONARCH' },
	'Sovereign': { styleId: 'sovereign', displayName: 'SOVEREIGN' },
	'Leviathan': { styleId: 'leviathan', displayName: 'LEVIATHAN' },
	'Glitch': { styleId: 'glitch', displayName: 'GLITCH' },
	'Borealis': { styleId: 'borealis', displayName: 'Borealis' },
	'Ruins : Withered': { styleId: 'ruins-withered', displayName: '《 ⬥ Ruins : Withered ⬥ 》' },
	'Aegis': { styleId: 'aegis', displayName: '﴾AEGIS﴿' },
	'Memory': { styleId: 'memory', displayName: 'Memory', hideRarity: true },
	'Neferkhaf': { styleId: 'neferkhaf', displayName: 'Neferkhaf', hideRarity: true }
};

const ZALGO_UP = [
	'\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310',
	'\u0352', '\u0357', '\u0351', '\u0307', '\u0308', '\u030a', '\u0342', '\u0343',
	'\u0344', '\u034a', '\u034b', '\u034c', '\u0303', '\u0302', '\u030c', '\u0350'
];
const ZALGO_MID = [
	'\u0315', '\u031b', '\u0340', '\u0341', '\u0358', '\u0321', '\u0322', '\u0327',
	'\u0328', '\u0334', '\u0335', '\u0336', '\u034f', '\u035c', '\u035d', '\u035e'
];
const ZALGO_DOWN = [
	'\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u031e', '\u031f',
	'\u0320', '\u0324', '\u0325', '\u0326', '\u0329', '\u032a', '\u032b', '\u032c',
	'\u032d', '\u032e', '\u032f', '\u0330', '\u0331', '\u0332', '\u0333', '\u0339'
];

function zalgoify(text, intensity = 2) {
	let result = '';
	for (const char of text) {
		if (char === ' ') { result += char; continue; }
		result += char;
		const upCount = Math.floor(Math.random() * intensity);
		const midCount = Math.floor(Math.random() * intensity);
		const downCount = Math.floor(Math.random() * intensity);
		for (let i = 0; i < upCount; i++) result += ZALGO_UP[Math.floor(Math.random() * ZALGO_UP.length)];
		for (let i = 0; i < midCount; i++) result += ZALGO_MID[Math.floor(Math.random() * ZALGO_MID.length)];
		for (let i = 0; i < downCount; i++) result += ZALGO_DOWN[Math.floor(Math.random() * ZALGO_DOWN.length)];
	}
	return result;
}

const zalgoIntervals = new Map();

function wrapTextInSpans(text, baseColor) {
	let html = '';
	for (const char of text) {
		html += `<span style="color:${baseColor}">${char}</span>`;
	}
	return html;
}

function randomCaseColorify(text) {
	let result = '';
	for (const char of text) {
		const color = Math.random() < 0.5 ? '#000000' : '#ffffff';
		if (/[a-zA-Z]/.test(char)) {
			const casedChar = Math.random() < 0.5 ? char.toLowerCase() : char.toUpperCase();
			result += `<span style="color:${color}">${casedChar}</span>`;
		} else {
			result += `<span style="color:${color}">${char}</span>`;
		}
	}
	return result;
}

function getCustomAuraStyle(auraName) {
	const baseName = getBaseAuraName(auraName);
	return CUSTOM_AURA_STYLES[baseName] || null;
}

function createAuraStyledElement(text, styleId, animated) {
	const wrapper = document.createElement('span');
	wrapper.className = 'aura-style-wrapper ' + styleId;

	const topSpan = document.createElement('span');
	topSpan.className = 'aura-top';
	topSpan.textContent = text;

	const bottomSpan = document.createElement('span');
	bottomSpan.className = 'aura-bottom';
	bottomSpan.textContent = text;

	if (animated) {
		wrapper.classList.add('aura-animated');
		topSpan.classList.add('aura-animated');
		bottomSpan.classList.add('aura-animated');
	}

	wrapper.appendChild(topSpan);
	wrapper.appendChild(bottomSpan);

	if (styleId === 'nyctophobia') {
		const baseText = text;
		const zalgoText = zalgoify(baseText, 3);
		topSpan.textContent = zalgoText;
		bottomSpan.textContent = zalgoText;
		const intervalId = setInterval(() => {
			const newZalgo = zalgoify(baseText, 3);
			topSpan.textContent = newZalgo;
			bottomSpan.textContent = newZalgo;
		}, 100);
		zalgoIntervals.set(wrapper, intervalId);
		const observer = new MutationObserver((mutations, obs) => {
			if (!document.contains(wrapper)) {
				clearInterval(intervalId);
				zalgoIntervals.delete(wrapper);
				obs.disconnect();
			}
		});
		observer.observe(document.body, { childList: true, subtree: true });
	}

	if (styleId === 'oppression') {
		const baseText = text;
		const caseColorHtml = randomCaseColorify(baseText);
		topSpan.innerHTML = caseColorHtml;
		bottomSpan.innerHTML = caseColorHtml;
		const intervalId = setInterval(() => {
			const newHtml = randomCaseColorify(baseText);
			topSpan.innerHTML = newHtml;
			bottomSpan.innerHTML = newHtml;
		}, 150);
		zalgoIntervals.set(wrapper, intervalId);
		const observer = new MutationObserver((mutations, obs) => {
			if (!document.contains(wrapper)) {
				clearInterval(intervalId);
				zalgoIntervals.delete(wrapper);
				obs.disconnect();
			}
		});
		observer.observe(document.body, { childList: true, subtree: true });
	}

	if (styleId === 'illusionary') {
		const baseText = text.toLowerCase();
		const baseColor = '#eff4fc';
		const flashColor = '#0302d2';
		const wrappedHtml = wrapTextInSpans(baseText, baseColor);
		topSpan.innerHTML = wrappedHtml;
		bottomSpan.innerHTML = wrappedHtml;
		
		if (animated) {
			const intervalId = setInterval(() => {
				const spans = bottomSpan.querySelectorAll('span');
				if (spans.length === 0) return;
				const randomIndex = Math.floor(Math.random() * spans.length);
				const span = spans[randomIndex];
				span.style.color = flashColor;
				setTimeout(() => {
					span.style.color = baseColor;
				}, 100);
			}, 100);
			zalgoIntervals.set(wrapper, intervalId);
			const observer = new MutationObserver((mutations, obs) => {
				if (!document.contains(wrapper)) {
					clearInterval(intervalId);
					zalgoIntervals.delete(wrapper);
					obs.disconnect();
				}
			});
			observer.observe(document.body, { childList: true, subtree: true });
		}
	}

	if (styleId === 'prologue') {
		const symbolSpan = document.createElement('span');
		symbolSpan.className = 'symbol';
		symbolSpan.textContent = '';
		if (animated) symbolSpan.classList.add('aura-animated');
		wrapper.insertBefore(symbolSpan, topSpan);
	}

	return wrapper;
}

function getRarityClass(chance, auraName) {
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

const RARITY_CLASS_ORDER = [
	'rarity-basic',
	'rarity-epic',
	'rarity-unique',
	'rarity-legendary',
	'rarity-mythic',
	'rarity-exalted',
	'rarity-glorious',
	'rarity-transcendent'
];

function getSelectedAuraClasses() {
	const checked = document.querySelectorAll('.aura-class-stop-cb:checked');
	return Array.from(checked).map(cb => cb.value);
}

function doesClassMatchSelection(rolledClass, selectedClasses) {
	for (const selectedClass of selectedClasses) {
		if (selectedClass === 'rarity-challenged' || selectedClass === 'rarity-challengedplus') {
			if (rolledClass === selectedClass) return true;
		} else if (rolledClass === 'rarity-challenged' || rolledClass === 'rarity-challengedplus') {
			continue;
		} else {
			const rolledIdx = RARITY_CLASS_ORDER.indexOf(rolledClass);
			const selectedIdx = RARITY_CLASS_ORDER.indexOf(selectedClass);
			if (rolledIdx >= 0 && selectedIdx >= 0 && rolledIdx >= selectedIdx) return true;
		}
	}
	return false;
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
	
	const { count, luck, biome, allowOblivion, allowDune } = readOptionsFromUI();
	const biomeLabels = {
		normal: 'Normal', day: 'Day', night: 'Night', rainy: 'Rainy', windy: 'Windy',
		snowy: 'Snowy', sandstorm: 'Sandstorm', hell: 'Hell', starfall: 'Starfall',
		heaven: 'Heaven', corruption: 'Corruption', null: 'NULL', dreamspace: 'Dreamspace',
		glitch: 'Glitch', cyberspace: 'Cyberspace', limbo: 'LIMBO'
	};
	
	let globalCount = 0;
	for (const value of entries) {
		const aura = value.entry.aura || { rarity: 1 };
		const auraName = aura.name || 'Unknown';
		const baseName = getBaseAuraName(auraName);
		const displayRarity = value.entry.nativeApplied ? value.entry.displayRarity : Number(aura.rarity || value.entry.finalR || 1);
		
		if (displayRarity >= 99999999 || CHALLENGED_AURAS.includes(baseName) || CHALLENGED_PLUS_AURAS.includes(baseName)) {
			globalCount += value.count;
		}
	}
	
	const statsRow = document.createElement('div');
	statsRow.id = 'resultsStatsRow';
	
	const globalsSpan = document.createElement('span');
	globalsSpan.textContent = `Total "Globals": ${globalCount.toLocaleString('en-US')}`;
	globalsSpan.setAttribute('title', 'Totals all Glorious, Transcendent, Challenged, and Challenged+ auras.');
	statsRow.appendChild(globalsSpan);
	
	let restOfStats = ` | Luck: ${Number(luck).toLocaleString('en-US')} | Rolls: ${count.toLocaleString('en-US')} | Biome: ${biome ? (biomeLabels[biome] || biome) : 'None'}`;
	if (allowOblivion) restOfStats += ' | Oblivion/Memory: ON';
	if (allowDune) restOfStats += ' | Neferkhaf: ON';
	statsRow.appendChild(document.createTextNode(restOfStats));
	frag.appendChild(statsRow);
	
	entries.sort((a, b) => {
		const aSpecial = a.entry.isSpecialAura ? 1 : 0;
		const bSpecial = b.entry.isSpecialAura ? 1 : 0;
		if (bSpecial !== aSpecial) return bSpecial - aSpecial;
		
		const ar = a.entry.nativeApplied ? a.entry.displayRarity : Number(a.entry.aura && a.entry.aura.rarity) || 1;
		const br = b.entry.nativeApplied ? b.entry.displayRarity : Number(b.entry.aura && b.entry.aura.rarity) || 1;
		if (br !== ar) return br - ar;
		const an = (a.entry.aura && a.entry.aura.name) || 'Unknown';
		const bn = (b.entry.aura && b.entry.aura.name) || 'Unknown';
		return (orderMap.get(an) ?? 0) - (orderMap.get(bn) ?? 0);
	});
	getSettingsState();
	for (const value of entries) {
		const div = document.createElement('div');
		const aura = value.entry.aura || { rarity: 1 };
		const auraName = aura.name || 'Unknown';
		const displayRarity = value.entry.nativeApplied ? value.entry.displayRarity : Number(aura.rarity || value.entry.finalR || 1);
		if (value.entry.isLimboAura) {
			applyRarityClass(div, 'rarity-limbo');
		} else {
			applyRarityClass(div, getRarityClass(displayRarity, auraName));
		}
		const customStyle = getCustomAuraStyle(auraName);
		if (customStyle) {
			const displayText = buildDisplayLine(value.entry, value.count);
			const wrapper = createAuraStyledElement(displayText, customStyle.styleId, settingsAnimationsEnabled);
			div.appendChild(wrapper);
			div.classList.add('aura-custom-styled');
		} else {
			div.textContent = buildDisplayLine(value.entry, value.count);
		}
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
		lastSingleResult = null;
		return;
	}
	lastSingleResult = result;
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
	textEl.classList.remove('aura-custom-styled', 'anim-base', 'anim-10m', 'anim-100m', 'anim-1b', 'anim-challenged', 'anim-challengedplus');
	single.classList.remove('flash');
	getSettingsState();

	const customStyle = getCustomAuraStyle(baseName);

	if (customStyle) {
		textEl.textContent = '';
		textEl.innerHTML = '';

		if (!customStyle.hideRarity) {
			const rarityText = '{ 1 in ' + formatRarity(displayRarity) + ' }';
			const rarityWrapper = createAuraStyledElement(rarityText, customStyle.styleId, settingsAnimationsEnabled);
			rarityWrapper.classList.add('aura-rarity-wrapper');
			textEl.appendChild(rarityWrapper);
		}

		const styledName = customStyle.displayName || getBaseAuraName(baseName);
		const wrapper = createAuraStyledElement(styledName, customStyle.styleId, settingsAnimationsEnabled);
		textEl.appendChild(wrapper);
		textEl.classList.add('aura-custom-styled');

		if (result.isLimboAura) {
			applyRarityClass(textEl, 'rarity-limbo');
		} else {
			applyRarityClass(textEl, getRarityClass(displayRarity, baseName));
		}

		if (settingsFlashesEnabled) {
			const auraBaseName = getBaseAuraName(baseName);
			if (displayRarity >= 1000000000 || CHALLENGED_AURAS.includes(auraBaseName) || CHALLENGED_PLUS_AURAS.includes(auraBaseName)) {
				void single.offsetHeight;
				single.classList.add('flash');
			}
		}
		if (!settingsAnimationsEnabled) {
			const wrappers = textEl.querySelectorAll('.aura-style-wrapper');
			wrappers.forEach(w => {
				w.classList.remove('aura-animated');
				w.querySelectorAll('.aura-top, .aura-bottom').forEach(layer => layer.classList.remove('aura-animated'));
			});
		}
	} else {
		textEl.textContent = name;
		if (result.isLimboAura) {
			applyRarityClass(textEl, 'rarity-limbo');
		} else {
			applyRarityClass(textEl, getRarityClass(displayRarity, baseName));
		}
		if (settingsAnimationsEnabled) {
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
	}
	single.style.display = 'flex';
	single.style.visibility = 'visible';
}

function playSingleRollSfx(result) {
	if (!result) return;
	const aura = result.aura || { rarity: 0 };
	const displayRarity = result.nativeApplied ? result.displayRarity : Number(aura.rarity || result.finalR || 1);
	const rarity = Math.max(1, Math.floor(displayRarity));
	if (typeof playRaritySfx !== 'function') return;
	
	const biomeSelect = document.getElementById('biomeSelect');
	const isLimbo = biomeSelect && biomeSelect.value === 'limbo';
	
	if (rarity >= 99999999) {
		return playRaritySfx(isLimbo ? 'sfx100mlimbo' : 'sfx100m');
	}
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
	if (typeof window !== 'undefined' && window.rollInProgress) return; // prevent re-entrancy
	window.rollInProgress = true;
	const btn = document.getElementById('rollButton');
	if (btn) btn.disabled = true;
	if (typeof playSound === 'function') playSound('rollSound');
	try {

	const { count, luck, biome, allowOblivion, allowDune } = readOptionsFromUI();
	if (count > 499999999) {
		const ok = await showWarning('I\'m warning you, this will take lots of time AND slow your PC down significantly (CPU usage).');
		if (!ok) {
			if (btn) btn.disabled = false;
			return;
		}
	} else if (count > 99999999) {
		const ok = await showWarning('You have selected a very high roll count. This will affect PC performance (CPU) while running. Are you sure?');
		if (!ok) {
			if (btn) btn.disabled = false;
			return;
		}
	} else if (count > 9999999) {
		const ok = await showWarning('You set a lot of rolls. Your browser might lag. Are you sure?');
		if (!ok) {
			if (btn) btn.disabled = false;
			return;
		}
	}
	
	const rollPanelContainer = document.getElementById('rollOptionsPanelContainer');
	const settingsPanel = document.getElementById('settingsPanel');
	if (rollPanelContainer) rollPanelContainer.classList.remove('open');
	if (settingsPanel) settingsPanel.classList.remove('open');
	const rollBtn = document.getElementById('rollOptionsBtn');
	const settingsBtn = document.getElementById('settingsBtn');
	if (rollBtn) rollBtn.removeAttribute('data-enabled');
	if (settingsBtn) settingsBtn.removeAttribute('data-enabled');
	
	updateBuffDisplay();
	const total = count;
	const single = document.getElementById('singleResult');
	if (single) single.style.display = 'none';
	hideResultsAndSingle();
	const start = performance.now();
	const candidateSet = buildCandidates(AURAS, { luck, biome, allowOblivion, allowDune });
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
		
		const selectedClasses = getSelectedAuraClasses();
		if (selectedClasses.length > 0 && result) {
			const aura = result.aura || { name: 'Unknown', rarity: 0 };
			const baseName = aura.name || 'Unknown';
			const displayRarity = result.nativeApplied ? result.displayRarity : Number(aura.rarity || result.finalR || 1);
			const rolledClass = getRarityClass(displayRarity, baseName);
			if (doesClassMatchSelection(rolledClass, selectedClasses)) {
				if (autoRollEnabled) {
					stopAutoRoll();
				} else {
					if (btn) {
						btn.disabled = true;
						setTimeout(() => { btn.disabled = false; }, 1000);
						return;
					}
				}
			}
		}
		
		if (btn) btn.disabled = false;
		return;
	}

	if (useWebWorkers && webWorkersSupported() && total >= WORKER_MIN_ROLLS) {
		try {
			const counts = await runRollsWithWorkers(candidateSet, total, start);
			renderResults(counts);
			if (btn) btn.disabled = false;
			return;
		} catch (err) {
			console.warn('Web Workers failed, falling back to single-threaded:', err);
		}
	}

	const { finals, entries, len, specialFinals, specialEntries, specialLen } = candidateSet;
	const totalEntries = len + specialLen;
	const countArr = new Uint32Array(totalEntries);

	const rngState = PRNG.getState();
	let sa = rngState.a, sb = rngState.b, sc = rngState.c, sd = rngState.d;

	const chunkSize = 50000;
	const yieldEveryNChunks = 5;
	let done = 0;
	let chunkCount = 0;
	
	while (done < total) {
		const end = Math.min(total, done + chunkSize);
		for (let r = done; r < end; r++) {
			let idx = -1;
			while (idx < 0) {
				for (let i = 0; i < specialLen; i++) {
					sa >>>= 0; sb >>>= 0; sc >>>= 0; sd >>>= 0;
					let t = (sa + sb) | 0;
					sa = sb ^ (sb >>> 9);
					sb = (sc + (sc << 3)) | 0;
					sc = (sc << 21) | (sc >>> 11);
					sd = (sd + 1) | 0;
					t = (t + sd) | 0;
					sc = (sc + t) | 0;
					const rnd = t >>> 0;
					if ((rnd % specialFinals[i]) === 0) {
						idx = i;
						break;
					}
				}
				if (idx >= 0) break;
				for (let i = 0; i < len; i++) {
					sa >>>= 0; sb >>>= 0; sc >>>= 0; sd >>>= 0;
					let t = (sa + sb) | 0;
					sa = sb ^ (sb >>> 9);
					sb = (sc + (sc << 3)) | 0;
					sc = (sc << 21) | (sc >>> 11);
					sd = (sd + 1) | 0;
					t = (t + sd) | 0;
					sc = (sc + t) | 0;
					const rnd = t >>> 0;
					if ((rnd % finals[i]) === 0) {
						idx = specialLen + i;
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
	PRNG.setState(sa, sb, sc, sd);
	updateProgress(done, total, start);

	const counts = new Map();
	for (let i = 0; i < specialLen; i++) {
		if (countArr[i] > 0) {
			counts.set(specialEntries[i].resultKey, { entry: specialEntries[i], count: countArr[i] });
		}
	}
	for (let i = 0; i < len; i++) {
		if (countArr[specialLen + i] > 0) {
			counts.set(entries[i].resultKey, { entry: entries[i], count: countArr[specialLen + i] });
		}
	}

	renderResults(counts);
	if (btn) btn.disabled = false;
	} finally {
		// ensure rolling flag is always cleared
		if (typeof window !== 'undefined') window.rollInProgress = false;
	}
}

function updateAutoRollVisibility() {
	const rollsInput = document.getElementById('rollsInput');
	const autoRollBtn = document.getElementById('autoRollBtn');
	const rollSpeedInput = document.getElementById('rollSpeedInput');
	const rolls = Math.floor(Number(rollsInput && rollsInput.value) || 1);
	
	if (autoRollBtn) {
		autoRollBtn.style.display = rolls === 1 ? 'inline-block' : 'none';
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
		getSettingsState();
		if (settingsFlashesEnabled) {
			showWarning('You have flashes enabled. Rolling several Transcendent auras in a row could be quite annoying. Are you sure?')
				.then(ok => {
					if (!ok) return;
					
					autoRollEnabled = true;
					if (autoRollBtn) {
						autoRollBtn.textContent = 'Auto Roll: ON';
						autoRollBtn.setAttribute('data-enabled', 'true');
					}
					startAutoRoll();
				});
			return;
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

if (typeof window !== 'undefined') {
	window.rng = rng;
	window.rollOne = rollOne;
	window.rollMany = rollMany;
	window.seedRng = seedRng;
	window.setAuras = setAuras;
}

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

		const autoRollBtn = document.getElementById('autoRollBtn');
		const rollSpeedInput = document.getElementById('rollSpeedInput');
		if (autoRollBtn) autoRollBtn.addEventListener('click', toggleAutoRoll);
		if (rollSpeedInput) {
			rollSpeedInput.addEventListener('change', () => {
				getRollSpeed();
				updateBuffDisplay();
				if (autoRollEnabled) {
					clearInterval(autoRollInterval);
					autoRollInterval = null;
					startAutoRoll();
				}
			});
		}

		updateBuffDisplay();
		updateAutoRollVisibility();

		const animationsToggle = document.getElementById('animationsToggle');
		const flashesToggle = document.getElementById('flashesToggle');
		
		function reRenderSingleResult() {
			if (!lastSingleResult) return;
			const rollPanel = document.getElementById('rollOptionsPanelContainer');
			const settingsPanel = document.getElementById('settingsPanel');
			const menuOpen = (rollPanel && rollPanel.classList.contains('open')) || 
			                 (settingsPanel && settingsPanel.classList.contains('open'));
			const singleResult = document.getElementById('singleResult');
			
			showSingleResult(lastSingleResult);
			
			if (menuOpen && singleResult) {
				singleResult.style.visibility = 'hidden';
				singleResult.classList.remove('flash');
			}
		}
		
		if (animationsToggle) {
			animationsToggle.addEventListener('change', () => {
				getSettingsState();
				reRenderSingleResult();
			});
		}
		if (flashesToggle) {
			flashesToggle.addEventListener('change', () => {
				getSettingsState();
				reRenderSingleResult();
			});
		}
	});
}
