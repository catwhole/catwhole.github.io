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
		outRequired.textContent = 'bro enter an actual number';
		outAccum.textContent = 'please man...';
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

function calculateRange() {
	const startInput = document.getElementById('range-start');
	const endInput = document.getElementById('range-end');
	const out = document.getElementById('xp-range-result');

	if (!startInput || !endInput || !out) return;

	const rawStart = Number(startInput.value);
	const rawEnd = Number(endInput.value);

	const start = Number.isFinite(rawStart) ? Math.floor(rawStart) : NaN;
	const end = Number.isFinite(rawEnd) ? Math.floor(rawEnd) : NaN;

	if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end < 0) {
		out.textContent = 'bro enter actual numbers';
		return;
	}
	if (end <= start) {
		out.textContent = 'ending level must be higher than starting level';
		return;
	}

	const internalStart = Math.max(0, start - 1);
	const internalEnd = Math.max(0, end - 1);

	let total = 0;
	// Special case: if start is 0 and end is 1, include Formula(0)
	if (start === 0 && end === 1) {
		total = Formula(0);
	} else {
		for (let i = internalStart + 1; i <= internalEnd; i++) {
			total += Formula(i);
		}
	}

	out.innerHTML = 'XP required from level <span class="highlight">' + start + '</span> to level <span class="highlight">' + end + '</span>: <span class="highlight">' + formatNum(total) + '</span>';
}

window.calculate = calculate;
window.calculateRange = calculateRange;

document.addEventListener('DOMContentLoaded', function () {
	const btn = document.getElementById('calc-btn');
	const input = document.getElementById('level-input');
	const rangeBtn = document.getElementById('range-calc-btn');
	const rangeStart = document.getElementById('range-start');
	const rangeEnd = document.getElementById('range-end');

	if (btn) btn.addEventListener('click', calculate);
	if (input) input.addEventListener('keydown', function (e) {
		if (e.key === 'Enter') calculate();
	});
	if (rangeBtn) rangeBtn.addEventListener('click', calculateRange);
	if (rangeStart) rangeStart.addEventListener('keydown', function (e) {
		if (e.key === 'Enter') calculateRange();
	});
	if (rangeEnd) rangeEnd.addEventListener('keydown', function (e) {
		if (e.key === 'Enter') calculateRange();
	});
});
