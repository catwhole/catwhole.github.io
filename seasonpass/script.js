(function () {
	function formatNum(n) {
		if (!isFinite(n)) return '∞';
		return Math.round(n).toLocaleString();
	}

	function Formula(level) {
		// formula: 6000 * 1.0325^x - 5900
		return 6000 * Math.pow(1.0325, level) - 5900;
	}

	function calculate() {
		const input = document.getElementById('level-input');
		const outRequired = document.getElementById('xp-required');
		const outAccum = document.getElementById('xp-accumulated');

		if (!input || !outRequired || !outAccum) return;

		const raw = Number(input.value);
		const displayed = Number.isFinite(raw) ? Math.floor(raw) : NaN;

		if (!Number.isFinite(displayed) || displayed < 0) {
			outRequired.textContent = 'Xp required to level up: — (enter a level ≥ 0)';
			outAccum.textContent = 'Accumulated xp until this level: —';
			return;
		}

		const internalLevel = Math.max(0, displayed - 1);

		const xpReq = Formula(internalLevel);

		let acc = 0;
		for (let i = 0; i <= internalLevel; i++) {
			acc += Formula(i);
		}

		outRequired.innerHTML = 'XP from level ' + (displayed - 1) + ' to level ' + displayed + ': <span class="highlight">' + formatNum(xpReq) + '</span>';
		outAccum.innerHTML = 'Accumulated XP to reach level ' + displayed + ': <span class="highlight">' + formatNum(acc) + '</span>';
	}

	window.calculate = calculate;

	document.addEventListener('DOMContentLoaded', function () {
		const btn = document.getElementById('calc-btn');
		const input = document.getElementById('level-input');

		if (btn) btn.addEventListener('click', calculate);
		if (input) input.addEventListener('keydown', function (e) {
			if (e.key === 'Enter') calculate();
		});
	});
})();
