import svg from "./assets/layout.plain.svg?raw";
import * as e from "./elements";
import state from "./state";
import { bitString, toBits } from "./utils";

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

    setWireState(e.writeAk1, state.writeAk);
    setWireState(e.writeAk2, state.writeAk);
    setWireState(e.writeAk3, state.writeAk);
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
    setWireState(e.carryOut2, state.savedCarryOut);
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

function shiftBitsAnimation() {

}

function createTableBit(state: boolean): HTMLTableCellElement {
    const cell = document.createElement("td");
    cell.textContent = state ? "1" : "0";
    cell.classList.add(state ? "true" : "false");
    return cell;
}

function createSpan(text: string, color?: string): HTMLSpanElement {
    const span = document.createElement("span");
    span.textContent = text;
    if (color) span.style.color = color;
    return span;
}

export function positionRowHighlight() {
    const row = e.programTableBody.children[state.programCounter + 1] as HTMLTableRowElement;

    e.rowHighlight.style.top = row.offsetTop + "px";
    e.rowHighlight.style.height = row.offsetHeight + "px";

    if (state.playIntervalValue <= 100) {
        row.scrollIntoView({
            behavior: "instant",
            block: "center",
        });
    } else {
        row.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }
}

function toggleBreakpoint(ev: PointerEvent) {
    const cell = ev.currentTarget as HTMLTableCellElement;
    cell.classList.toggle("breakpoint");
    const line = parseInt(cell.textContent);
    if (state.breakPoints.has(line)) {
        state.breakPoints.delete(line);
    } else {
        state.breakPoints.add(line);
    }
}

export function renderProgram() {
    e.programTableBody.replaceChildren(e.programTableBody.firstElementChild!);

    for (let i = 0; i < state.program!.length; i++) {
        const instruction = state.program![i]!;

        const row = document.createElement("tr");
        const line = document.createElement("td");
        line.textContent = i.toString();
        row.appendChild(line);

        if (instruction.type === "alu") {
            row.appendChild(createTableBit(instruction.invA ?? false));
            row.appendChild(createTableBit(instruction.invB ?? false));
            row.appendChild(createTableBit(instruction.caIn ?? false));
            row.appendChild(createTableBit(instruction.invC ?? false));
            row.appendChild(createTableBit(instruction.wrAk ?? false));
            row.appendChild(createTableBit(instruction.shAk ?? false));
            row.appendChild(createTableBit(instruction.shMQ ?? false));
            row.appendChild(createTableBit(instruction.rsMQ ?? false));
            row.appendChild(createTableBit(instruction.sh_L ?? false));
            row.appendChild(createTableBit(instruction.rsAk ?? false));
            row.appendChild(createTableBit(instruction.sMQ0 ?? false));
            row.appendChild(createTableBit(instruction.rsSC ?? false));
        }
        if (instruction.type === "jmp") {
            const text = document.createElement("td");
            text.colSpan = 12;
            text.appendChild(createSpan("jmp"));

            if (instruction.line !== undefined) {
                text.appendChild(createSpan(" " + instruction.line.toString(), "var(--accent)"));
            }
            if (instruction.skip !== undefined) {
                text.appendChild(createSpan(" ~" + instruction.skip.toString(), "var(--accent)"));
            }

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
            text.colSpan = 12;
            text.appendChild(createSpan("mem"));
            if (instruction.setInput !== undefined) {
                text.appendChild(createSpan(" Input="));
                text.appendChild(createSpan(instruction.setInput.toString(), "var(--accent)"));
            }
            if (instruction.setShiftCounter !== undefined) {
                text.appendChild(createSpan(" ShiftCounter="));
                text.appendChild(createSpan(instruction.setShiftCounter.toString(), "var(--accent)"));
            }
            row.appendChild(text);
        }

        e.programTableBody.appendChild(row);
    }

    const haltRow = document.createElement("tr");
    haltRow.appendChild(document.createElement("td"));
    const halt = document.createElement("td");
    halt.colSpan = 12;
    halt.appendChild(createSpan("HALT", "red"));
    haltRow.appendChild(halt);
    e.programTableBody.appendChild(haltRow);

    e.programTableBody.querySelectorAll<HTMLTableCellElement>("tr:not(:first-child, :last-child) td:first-child")
        .forEach(e => { e.addEventListener("click", toggleBreakpoint) });

    positionRowHighlight();
}

export function render() {
    colorWires();
    drawNumbers();
}

export async function init() {
    document.getElementById("svg-target")!.innerHTML = svg;
    e.loadElementsInt();

    const aside = document.querySelector<HTMLElement>("aside")!
    aside.style.width = (e.programTableWrapper.offsetWidth + 4) + "px";
    const observer = new ResizeObserver(() => {
        const aside = document.querySelector<HTMLElement>("aside")!
        aside.style.width = (e.programTableWrapper.offsetWidth + 4) + "px";
    });
    observer.observe(e.programTableWrapper);

    render();
}