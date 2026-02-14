// =====================================================
// RNG Functions
// =====================================================

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

function initRngState(seedStr) {
	const h = xmur3(seedStr);
	return { a: h(), b: h(), c: h(), d: h() };
}

// =====================================================
// Message Handler
// =====================================================

self.onmessage = function(e) {
	const { 
		rollCount, 
		finals, 
		specialFinals, 
		len, 
		specialLen, 
		seedStr,
		workerIndex
	} = e.data;

	const state = initRngState(seedStr);
	let sa = state.a, sb = state.b, sc = state.c, sd = state.d;

	const totalEntries = len + specialLen;
	const countArr = new Uint32Array(totalEntries);

	const finalsArr = new Uint32Array(finals);
	const specialFinalsArr = new Uint32Array(specialFinals);

	const progressInterval = 250000;
	let nextProgressAt = progressInterval;

	// =====================================================
	// Hot Loop - Fully Inlined sfc32 RNG
	// =====================================================
	for (let r = 0; r < rollCount; r++) {
		if (r >= nextProgressAt) {
			self.postMessage({ type: 'progress', done: r, workerIndex: workerIndex });
			nextProgressAt += progressInterval;
		}
		
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
				if ((rnd % specialFinalsArr[i]) === 0) {
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
				if ((rnd % finalsArr[i]) === 0) {
					idx = specialLen + i;
					break;
				}
			}
		}
		countArr[idx]++;
	}

	self.postMessage({ type: 'done', countArr: countArr.buffer }, [countArr.buffer]);
};
