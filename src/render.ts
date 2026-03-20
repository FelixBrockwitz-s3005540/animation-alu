import svg from "./assets/layout.plain.svg?raw";
import program from "./assets/AddInt.json?url";
import { calculateAlu, executeLine } from "./calculate";
import * as e from "./elements";
import state from "./state";
import { bitString, floatToInt, toBits } from "./utils";
import type { Program } from "./instructions";

function setWireState(el: SVGElement, s: boolean | undefined) {
    switch (s) {
        case undefined:
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
    setWireState(e.inputA, state.invA);
    setWireState(e.inputB, state.invB);
    setWireState(e.carryIn, state.carryIn);
    setWireState(e.inputC, state.invC);

    setWireState(e.writeAk, state.writeAk);
    setWireState(e.shAk1, state.shAk);
    setWireState(e.shAk2, state.shAk);
    setWireState(e.shAk3, state.shAk);
    setWireState(e.shMQ1, state.shMQ);
    setWireState(e.shMQ2, state.shMQ);
    setWireState(e.shMQ3, state.shMQ);
    setWireState(e.resetMQ, state.resetMQ);
    setWireState(e.shl1, state.shl);
    setWireState(e.shl2, state.shl);
    setWireState(e.shl3, state.shl);
    setWireState(e.resetAk, state.resetAk);
    setWireState(e.oneMQ0, state.oneMQ0);
    setWireState(e.resetSC, state.resetSC);

    setWireState(e.scClk, state.shAk || state.shMQ);

    if (state.shAk && state.shMQ) {
        if (state.shl) {
            setWireState(e.akMQ, toBits(state.mq, 8)[7]);
        } else {
            setWireState(e.akMQ, toBits(state.ak, 8)[0]);
        }
    } else {
        setWireState(e.akMQ, undefined);
    }

    setWireState(e.carryOut1, state.carryOut);
    setWireState(e.carryOut2, state.carryOut);
    setWireState(e.sign, state.sign);
    setWireState(e.ak0, state.ak0);
    setWireState(e.sc0, state.sc0);
    setWireState(e.mq0, state.mq0);
}

function coloredNumberString(e: SVGTextElement, num: number) {
    const str = bitString(toBits(num, 8));
    for (let i = 0; i < 8; i++) {
        const span: SVGTSpanElement = e.firstElementChild!.children[i] as any;
        span.textContent = str[i]!;
        if (str[i] === "1") {
            span.classList.add("true");
            span.classList.remove("false");
        } else {
            span.classList.remove("true");
            span.classList.add("false");
        }
    }
}

function numberedBoxes(e: SVGGElement, num: number) {
    const bits = toBits(num, 8);

    const texts = Array.from(e.querySelectorAll<SVGTextElement>(".binary-display text"))
        .sort((a,b) => b.x.baseVal.getItem(0).value - a.x.baseVal.getItem(0).value);

    for (let i = 0; i < 8; i++) {
        const span: SVGTSpanElement = texts[i]!.firstElementChild as any;
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
    e.shiftCounterCount.querySelector<SVGTSpanElement>("tspan")!.textContent = state.sc.toString();

    coloredNumberString(e.akADisplay, state.ak);
    coloredNumberString(e.akCDisplay, state.aluResult);

    numberedBoxes(e.inputRegister, state.inputReg);
    numberedBoxes(e.outputDisplay, state.ak);
    numberedBoxes(e.akku, state.ak);
    numberedBoxes(e.mqRegister, state.mq);
}

function shiftBits() {

}

async function init() {
    document.getElementById("svg-target")!.innerHTML = svg;

    e.loadElements();

    colorWires();
    drawNumbers();

    e.startButton.addEventListener("click", async () => {
        const response = await fetch(program);
        const json = await response.text();
        const parsed = JSON.parse(json) as Program;
        state.programName = parsed.name;
        state.executionUnit = parsed.unit;
        state.program = parsed.instructions;
        state.programCounter = 0;
    });
    e.startButton.click();

    e.stepButton.addEventListener("click", () => {
        console.log(state.programCounter);
        console.log(state.program![state.programCounter]);
        executeLine(state.programCounter);
        colorWires();
        drawNumbers();
    });
}

await init();