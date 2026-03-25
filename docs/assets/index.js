//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
//#endregion
//#region src/assets/layout.plain.svg?url
var layout_plain_default = "/docs/assets/layout.plain.svg";
//#endregion
//#region src/elements.ts
var resetButton = document.getElementById("reset-program");
var stepButton = document.getElementById("step");
var playButton = document.getElementById("play-pause");
var playSpeedRange = document.getElementById("play-speed-range");
var playSpeedValue = document.getElementById("play-speed-value");
var circuitSelect = document.getElementById("circuit");
var programSelect = document.getElementById("program");
var programUpload = document.getElementById("program-upload");
var input1 = document.getElementById("in1");
var input2 = document.getElementById("in2");
var output = document.getElementById("out");
var programTableWrapper = document.getElementById("table-wrapper");
var programTableBody = document.getElementById("program-table").querySelector("tbody");
var rowHighlight = document.getElementById("row-highlight");
var helpDialog = document.getElementById("help");
var inputRegister;
var outputDisplay;
var akku;
var mqRegister;
var akADisplay;
var akCDisplay;
var shiftCounterCount;
var inputA;
var inputB;
var carryIn;
var floodCarry;
var orXor;
var writeAk1;
var writeAk2;
var writeAk3;
var shAk1;
var shAk2;
var shAk3;
var shMQ1;
var shMQ2;
var shMQ3;
var resetMQ;
var shl1;
var shl2;
var shl3;
var resetAk;
var oneMQ0;
var resetSC;
var scClk;
var akMQ;
var carryOut1;
var carryOut2;
var sign;
var ak0;
var sc0;
var mq0;
function loadElementsInt() {
	document.querySelector("#svg1");
	inputRegister = document.getElementById("input-register");
	outputDisplay = document.getElementById("output-display");
	akku = document.getElementById("akku");
	mqRegister = document.getElementById("mq-register");
	akADisplay = document.getElementById("alu-a");
	akCDisplay = document.getElementById("alu-c");
	shiftCounterCount = document.getElementById("shift-counter-count");
	inputA = document.getElementById("inv-a");
	inputB = document.getElementById("inv-b");
	carryIn = document.getElementById("carry-in");
	floodCarry = document.getElementById("flood-carry");
	orXor = document.getElementById("or-xor");
	writeAk1 = document.getElementById("write-ak-1");
	writeAk2 = document.getElementById("write-ak-2");
	writeAk3 = document.getElementById("write-ak-3");
	shAk1 = document.getElementById("sh-ak-1");
	shAk2 = document.getElementById("sh-ak-2");
	shAk3 = document.getElementById("sh-ak-3");
	shMQ1 = document.getElementById("sh-mq-1");
	shMQ2 = document.getElementById("sh-mq-2");
	shMQ3 = document.getElementById("sh-mq-3");
	resetMQ = document.getElementById("reset-mq");
	shl1 = document.getElementById("shl-shr-1");
	shl2 = document.getElementById("shl-shr-2");
	shl3 = document.getElementById("shl-shr-3");
	resetAk = document.getElementById("reset-ak");
	oneMQ0 = document.getElementById("1-mq-0");
	resetSC = document.getElementById("reset-sc");
	scClk = document.getElementById("sc-clk");
	akMQ = document.getElementById("akku-mq");
	carryOut1 = document.getElementById("carry-out-line-1");
	carryOut2 = document.getElementById("carry-out-line-2");
	sign = document.getElementById("sign");
	ak0 = document.getElementById("ak-0");
	sc0 = document.getElementById("sc-0");
	mq0 = document.getElementById("mq-0");
}
//#endregion
//#region src/utils.ts
function toBits(int, numBits) {
	const bits = [];
	for (let i = 0; i < numBits; i++) bits.push((int & 1 << i) !== 0);
	return bits;
}
function fromBits(bits) {
	let num = 0;
	for (let i = 0; i < bits.length; i++) num |= (bits[i] ? 1 : 0) << i;
	return num;
}
function bitString(bits) {
	let str = "";
	for (const bit of bits) str = (bit ? "1" : "0") + str;
	return str;
}
//#endregion
//#region src/state.ts
var state = {
	program: void 0,
	programName: void 0,
	executionUnit: "int",
	playInterval: void 0,
	playIntervalValue: 500,
	breakPoints: /* @__PURE__ */ new Set(),
	programCounter: 0,
	inputReg: 3,
	ak: 0,
	savedCarryOut: false,
	mq: 0,
	sc: 0,
	aluResult: 0,
	carryOut: false,
	invA: false,
	invB: false,
	carryIn: false,
	floodCarry: false,
	useOr: false,
	writeAk: false,
	shAk: true,
	shMQ: true,
	resetMQ: false,
	shl: false,
	resetAk: false,
	oneMQ0: false,
	resetSC: false,
	get sign() {
		return toBits(state.ak, 8)[7];
	},
	get ak0() {
		return state.ak === 0;
	},
	get sc0() {
		return state.sc === 0;
	},
	get mq0() {
		return toBits(state.mq, 8)[0];
	}
};
function randomState() {
	state.inputReg = Math.floor(Math.random() * 256);
	state.ak = Math.floor(Math.random() * 256);
	state.mq = Math.floor(Math.random() * 256);
	state.sc = Math.floor(Math.random() * 100);
	state.aluResult = Math.floor(Math.random() * 256);
	state.invA = Math.random() < .5;
	state.invB = Math.random() < .5;
	state.carryIn = Math.random() < .5;
	state.floodCarry = Math.random() < .5;
	state.writeAk = Math.random() < .5;
	state.shAk = Math.random() < .5;
	state.shMQ = Math.random() < .5;
	state.resetMQ = Math.random() < .5;
	state.shl = Math.random() < .5;
	state.resetAk = Math.random() < .5;
	state.oneMQ0 = Math.random() < .5;
	state.resetSC = Math.random() < .5;
	state.carryOut = Math.random() < .5;
}
randomState();
//#endregion
//#region src/render.ts
function setWireState(el, s) {
	switch (s) {
		case void 0:
			el.classList.remove("true", "false");
			break;
		case true:
			el.classList.remove("false");
			el.classList.add("true");
			break;
		case false:
			el.classList.add("false");
			el.classList.remove("true");
			break;
	}
}
function colorWires() {
	setWireState(inputA, state.invA);
	setWireState(inputB, state.invB);
	setWireState(carryIn, state.carryIn);
	setWireState(floodCarry, state.floodCarry);
	setWireState(orXor, state.useOr);
	setWireState(writeAk1, state.writeAk);
	setWireState(writeAk2, state.writeAk);
	setWireState(writeAk3, state.writeAk);
	setWireState(shAk1, state.shAk);
	setWireState(shAk2, state.shAk);
	setWireState(shAk3, state.shAk);
	setWireState(shMQ1, state.shMQ);
	setWireState(shMQ2, state.shMQ);
	setWireState(shMQ3, state.shMQ);
	setWireState(resetMQ, state.resetMQ);
	setWireState(shl1, state.shl);
	setWireState(shl2, state.shl);
	setWireState(shl3, state.shl);
	setWireState(resetAk, state.resetAk);
	setWireState(oneMQ0, state.oneMQ0);
	setWireState(resetSC, state.resetSC);
	setWireState(scClk, state.shAk || state.shMQ);
	if (state.shAk && state.shMQ) if (state.shl) setWireState(akMQ, toBits(state.mq, 8)[7]);
	else setWireState(akMQ, toBits(state.ak, 8)[0]);
	else setWireState(akMQ, void 0);
	setWireState(carryOut1, state.carryOut);
	setWireState(carryOut2, state.savedCarryOut);
	setWireState(sign, state.sign);
	setWireState(ak0, state.ak0);
	setWireState(sc0, state.sc0);
	setWireState(mq0, state.mq0);
}
function coloredNumberString(e, num) {
	const str = bitString(toBits(num, 8));
	for (let i = 0; i < 8; i++) {
		const span = e.firstElementChild.children[i];
		span.textContent = str[i];
		if (str[i] === "1") {
			span.classList.add("true");
			span.classList.remove("false");
		} else {
			span.classList.remove("true");
			span.classList.add("false");
		}
	}
}
function numberedBoxes(e, num) {
	const bits = toBits(num, 8);
	const texts = Array.from(e.querySelectorAll(".binary-display text")).sort((a, b) => b.x.baseVal.getItem(0).value - a.x.baseVal.getItem(0).value);
	for (let i = 0; i < 8; i++) {
		const span = texts[i].firstElementChild;
		if (bits[i]) {
			span.textContent = "1";
			span.classList.add("true");
			span.classList.remove("false");
		} else {
			span.textContent = "0";
			span.classList.remove("true");
			span.classList.add("false");
		}
	}
}
function drawNumbers() {
	shiftCounterCount.querySelector("tspan").textContent = state.sc.toString();
	coloredNumberString(akADisplay, state.ak);
	coloredNumberString(akCDisplay, state.aluResult);
	numberedBoxes(inputRegister, state.inputReg);
	numberedBoxes(outputDisplay, state.ak);
	numberedBoxes(akku, state.ak);
	numberedBoxes(mqRegister, state.mq);
}
function createTableBit(state) {
	const cell = document.createElement("td");
	cell.textContent = state ? "1" : "0";
	cell.classList.add(state ? "true" : "false");
	return cell;
}
function createSpan(text, color) {
	const span = document.createElement("span");
	span.textContent = text;
	if (color) span.style.color = color;
	return span;
}
function positionRowHighlight() {
	const row = programTableBody.children[state.programCounter + 1];
	rowHighlight.style.top = row.offsetTop + "px";
	rowHighlight.style.height = row.offsetHeight + "px";
	if (state.playIntervalValue <= 100) row.scrollIntoView({
		behavior: "instant",
		block: "center"
	});
	else row.scrollIntoView({
		behavior: "smooth",
		block: "center"
	});
}
function toggleBreakpoint(ev) {
	const cell = ev.currentTarget;
	cell.classList.toggle("breakpoint");
	const line = parseInt(cell.textContent);
	if (state.breakPoints.has(line)) state.breakPoints.delete(line);
	else state.breakPoints.add(line);
}
var colSpan = 13;
function renderProgram() {
	programTableBody.replaceChildren(programTableBody.firstElementChild);
	for (let i = 0; i < state.program.length; i++) {
		const instruction = state.program[i];
		const row = document.createElement("tr");
		const line = document.createElement("td");
		line.textContent = i.toString();
		row.appendChild(line);
		if (instruction.type === "alu") {
			row.appendChild(createTableBit(instruction.invA ?? false));
			row.appendChild(createTableBit(instruction.invB ?? false));
			row.appendChild(createTableBit(instruction.caIn ?? false));
			row.appendChild(createTableBit(instruction.flCa ?? false));
			row.appendChild(createTableBit(instruction.usOR ?? false));
			row.appendChild(createTableBit(instruction.wrAk ?? false));
			row.appendChild(createTableBit(instruction.shAk ?? false));
			row.appendChild(createTableBit(instruction.shMQ ?? false));
			row.appendChild(createTableBit(instruction.rsMQ ?? false));
			row.appendChild(createTableBit(instruction.sh_L ?? false));
			row.appendChild(createTableBit(instruction.rsAk ?? false));
			row.appendChild(createTableBit(instruction.sMQ0 ?? false));
			row.appendChild(createTableBit(instruction.rsSC ?? false));
			row.classList.add("alu");
		}
		if (instruction.type === "jmp") {
			const text = document.createElement("td");
			text.colSpan = colSpan;
			text.appendChild(createSpan("jmp"));
			if (instruction.line !== void 0) text.appendChild(createSpan(" " + instruction.line.toString(), "var(--accent)"));
			if (instruction.skip !== void 0) text.appendChild(createSpan(" ~" + instruction.skip.toString(), "var(--accent)"));
			if (instruction.signal !== "jmp") {
				text.appendChild(createSpan(" if "));
				text.appendChild(createSpan(instruction.signal, "var(--accent)"));
				text.appendChild(createSpan(" is "));
				text.appendChild(createSpan(instruction.if ? "true" : "false", "var(--accent)"));
			}
			row.appendChild(text);
		}
		if (instruction.type === "mem") {
			const text = document.createElement("td");
			text.colSpan = colSpan;
			text.appendChild(createSpan("mem"));
			if (instruction.setInput !== void 0) {
				text.appendChild(createSpan(" Input="));
				text.appendChild(createSpan(instruction.setInput.toString(), "var(--accent)"));
			}
			if (instruction.setShiftCounter !== void 0) {
				text.appendChild(createSpan(" ShiftCounter="));
				text.appendChild(createSpan(instruction.setShiftCounter.toString(), "var(--accent)"));
			}
			row.appendChild(text);
		}
		programTableBody.appendChild(row);
	}
	const haltRow = document.createElement("tr");
	haltRow.appendChild(document.createElement("td"));
	const halt = document.createElement("td");
	halt.colSpan = colSpan;
	halt.appendChild(createSpan("HALT", "red"));
	haltRow.appendChild(halt);
	haltRow.classList.add("halt");
	programTableBody.appendChild(haltRow);
	programTableBody.querySelectorAll("tr:not(:first-child, :last-child) td:first-child").forEach((e) => {
		e.addEventListener("click", toggleBreakpoint);
	});
	positionRowHighlight();
}
function render() {
	colorWires();
	drawNumbers();
}
async function init$1() {
	const svg = await (await fetch(layout_plain_default)).text();
	document.getElementById("svg-target").innerHTML = svg;
	loadElementsInt();
	const aside = document.querySelector("aside");
	aside.style.width = programTableWrapper.offsetWidth + 4 + "px";
	new ResizeObserver(() => {
		const aside = document.querySelector("aside");
		aside.style.width = programTableWrapper.offsetWidth + 4 + "px";
	}).observe(programTableWrapper);
	render();
}
//#endregion
//#region src/calculate.ts
function executeLine(line) {
	const instruction = state.program[line];
	if (!instruction) {
		output.value = state.ak.toString();
		if (state.playInterval !== void 0) playButton.click();
		return;
	}
	switch (instruction.type) {
		case "mem":
			executeMem(instruction);
			state.programCounter++;
			break;
		case "jmp":
			executeJmp(instruction);
			break;
		case "alu":
			executeALU();
			state.programCounter++;
			break;
	}
	if (state.programCounter >= state.program.length) {
		state.aluResult = calculateRippleCarryALU();
		output.value = state.ak.toString();
	} else {
		const nextInstruction = state.program[state.programCounter];
		if (nextInstruction.type === "alu") setInputs(nextInstruction);
		else setInputs({ type: "alu" });
		state.aluResult = calculateRippleCarryALU();
		if (state.breakPoints.has(state.programCounter) && state.playInterval !== void 0) playButton.click();
	}
}
function executeMem(instruction) {
	switch (instruction.setInput) {
		case "in1":
			state.inputReg = parseInt(input1.value);
			break;
		case "in2":
			state.inputReg = parseInt(input2.value);
			break;
		case void 0: break;
		default:
			state.inputReg = instruction.setInput & 255;
			break;
	}
	if (instruction.setShiftCounter !== void 0) state.sc = instruction.setShiftCounter;
}
function executeJmp(instruction) {
	if (instruction.signal === "jmp") {
		if (instruction.line !== void 0) state.programCounter = instruction.line;
		if (instruction.skip !== void 0) if (instruction.skip < 0) state.programCounter -= instruction.skip;
		else state.programCounter += instruction.skip + 1;
		return;
	}
	let signal;
	switch (instruction.signal) {
		case "c-o":
			signal = state.carryOut;
			break;
		case "sgn":
			signal = state.sign;
			break;
		case "ak0":
			signal = state.ak0;
			break;
		case "sc0":
			signal = state.sc0;
			break;
		case "mq0":
			signal = state.mq0;
			break;
	}
	if (signal === (instruction.if ?? false)) {
		if (instruction.line !== void 0) state.programCounter = instruction.line;
		if (instruction.skip !== void 0) if (instruction.skip < 0) state.programCounter -= instruction.skip;
		else state.programCounter += instruction.skip + 1;
	} else state.programCounter++;
}
function executeALU() {
	if (state.writeAk) {
		state.ak = state.aluResult;
		state.savedCarryOut = state.carryOut;
	}
	if (state.shAk && state.shMQ) if (state.shl) {
		state.ak = state.ak << 1 & 255;
		state.ak = state.ak | (state.mq & 128) >> 7;
		state.mq = state.mq << 1 & 255;
	} else {
		state.mq = state.mq >> 1 & 255;
		state.mq = state.mq | (state.ak & 1) << 7;
		state.ak = state.ak >> 1 & 255;
	}
	else if (state.shAk) if (state.shl) state.ak = state.ak << 1 & 255;
	else state.ak = state.ak >> 1 & 255;
	else if (state.shMQ) if (state.shl) state.mq = state.mq << 1 & 255;
	else state.mq = state.mq >> 1 & 255;
	if (state.shAk || state.shMQ) state.sc--;
	if (state.oneMQ0) state.mq = (state.mq | 1) & 255;
	if (state.resetAk) state.ak = 0;
	if (state.resetMQ) state.mq = 0;
	if (state.resetSC) state.sc = 0;
}
function setInputs(instruction) {
	state.invA = instruction.invA ?? false;
	state.invB = instruction.invB ?? false;
	state.carryIn = instruction.caIn ?? false;
	state.floodCarry = instruction.flCa ?? false;
	state.useOr = instruction.usOR ?? false;
	state.writeAk = instruction.wrAk ?? false;
	state.shAk = instruction.shAk ?? false;
	state.shMQ = instruction.shMQ ?? false;
	state.resetMQ = instruction.rsMQ ?? false;
	state.shl = instruction.sh_L ?? false;
	state.resetAk = instruction.rsAk ?? false;
	state.oneMQ0 = instruction.sMQ0 ?? false;
	state.resetSC = instruction.rsSC ?? false;
}
function calculateRippleCarryALU() {
	let a = toBits(state.ak, 8);
	let b = toBits(state.inputReg, 8);
	let c = new Array(9);
	c[0] = state.carryIn || state.floodCarry;
	let res = new Array(8);
	if (state.invA) a = a.map((bit) => !bit);
	if (state.invB) b = b.map((bit) => !bit);
	for (let i = 0; i < 8; i++) {
		if (state.useOr) res[i] = (a[i] || b[i]) !== c[i];
		else res[i] = a[i] !== b[i] !== c[i];
		c[i + 1] = state.floodCarry || a[i] && b[i] || (a[i] || b[i]) && c[i];
	}
	state.carryOut = c[8];
	return fromBits(res);
}
//#endregion
//#region src/index.ts
function changePlaySpeed(interval) {
	state.playIntervalValue = interval;
	if (interval <= 100) rowHighlight.classList.add("instant");
	else rowHighlight.classList.remove("instant");
	if (state.playInterval === void 0) return;
	clearInterval(state.playInterval);
	state.playInterval = setInterval(() => {
		stepButton.click();
	}, interval);
}
async function init() {
	circuitSelect.addEventListener("change", () => {
		if (circuitSelect.value === "float") throw new EvalError("Not Implemented");
	});
	programUpload.addEventListener("change", (ev) => {
		const file = programUpload.files[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (ev) => {
			const json = ev.target.result;
			const parsed = JSON.parse(json);
			state.programName = parsed.name;
			state.executionUnit = parsed.unit;
			state.program = parsed.instructions;
			state.programCounter = 0;
			renderProgram();
			resetButton.click();
		};
		reader.readAsText(file);
	});
	programSelect.addEventListener("change", async () => {
		if (programSelect.value === "custom") {
			programUpload.click();
			return;
		}
		const json = await (await fetch(programSelect.value)).text();
		const parsed = JSON.parse(json);
		state.programName = parsed.name;
		state.executionUnit = parsed.unit;
		state.program = parsed.instructions;
		state.programCounter = 0;
		renderProgram();
		resetButton.click();
	});
	resetButton.addEventListener("click", () => {
		output.value = "";
		state.programCounter = 0;
		positionRowHighlight();
		const firstInstruction = state.program[state.programCounter];
		if (firstInstruction.type === "alu") setInputs(firstInstruction);
		else setInputs({ type: "alu" });
		render();
	});
	stepButton.addEventListener("click", () => {
		executeLine(state.programCounter);
		render();
		positionRowHighlight();
	});
	playButton.addEventListener("click", () => {
		if (state.playInterval) {
			clearInterval(state.playInterval);
			state.playInterval = void 0;
			playButton.textContent = "Play";
		} else {
			state.playInterval = setInterval(() => {
				stepButton.click();
			}, parseFloat(playSpeedValue.value));
			playButton.textContent = "Stop";
		}
	});
	playSpeedRange.addEventListener("input", () => {
		if (!playSpeedRange.checkValidity()) return;
		playSpeedValue.value = playSpeedRange.value;
	});
	playSpeedRange.addEventListener("change", () => {
		changePlaySpeed(parseFloat(playSpeedRange.value));
	});
	playSpeedValue.addEventListener("input", () => {
		if (!playSpeedValue.checkValidity()) return;
		playSpeedRange.value = playSpeedValue.value;
	});
	playSpeedValue.addEventListener("change", () => {
		changePlaySpeed(parseFloat(playSpeedValue.value));
	});
	programSelect.dispatchEvent(new Event("change"));
	await init$1();
	helpDialog.addEventListener("toggle", () => {
		if (helpDialog.open) helpDialog.querySelector(".content").scrollTop = 0;
	});
}
await init();
//#endregion

//# sourceMappingURL=index.js.map