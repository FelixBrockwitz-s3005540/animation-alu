export const resetButton = document.getElementById("reset-program") as HTMLButtonElement;
export const stepButton = document.getElementById("step") as HTMLButtonElement;
export const playButton = document.getElementById("play-pause") as HTMLButtonElement;
export const playSpeedRange = document.getElementById("play-speed-range") as HTMLInputElement;
export const playSpeedValue = document.getElementById("play-speed-value") as HTMLInputElement;

export const circuitSelect = document.getElementById("circuit") as HTMLSelectElement;
export const programSelect = document.getElementById("program") as HTMLSelectElement;

export const input1 = document.getElementById("in1") as HTMLInputElement;
export const input2 = document.getElementById("in2") as HTMLInputElement;
export const output = document.getElementById("out") as HTMLInputElement;

export const programTableWrapper = document.getElementById("table-wrapper") as HTMLDivElement;
export const programTable = document.getElementById("program-table") as HTMLTableElement;
export const programTableBody = programTable.querySelector<HTMLTableSectionElement>("tbody")!;
export const rowHighlight = document.getElementById("row-highlight") as HTMLDivElement;

export let svg: SVGSVGElement;

export let inputRegister: SVGGElement;
export let outputDisplay: SVGGElement;
export let akku: SVGGElement;
export let mqRegister: SVGGElement;

export let akADisplay: SVGTextElement;
export let akCDisplay: SVGTextElement;
export let shiftCounterCount: SVGTextElement;

export let inputA: SVGPathElement;
export let inputB: SVGPathElement;
export let carryIn: SVGPathElement;
export let inputC: SVGPathElement;

export let writeAk: SVGPathElement;
export let shAk1: SVGPathElement;
export let shAk2: SVGPathElement;
export let shAk3: SVGCircleElement;
export let shMQ1: SVGPathElement;
export let shMQ2: SVGPathElement;
export let shMQ3: SVGCircleElement;
export let resetMQ: SVGPathElement;
export let shl1: SVGPathElement;
export let shl2: SVGPathElement;
export let shl3: SVGCircleElement;
export let resetAk: SVGPathElement;
export let oneMQ0: SVGPathElement;
export let resetSC: SVGPathElement;

export let scClk: SVGPathElement;
export let akMQ: SVGPathElement;

export let carryOut1: SVGPathElement;
export let carryOut2: SVGPathElement;
export let sign: SVGPathElement;
export let ak0: SVGPathElement;
export let sc0: SVGPathElement;
export let mq0: SVGPathElement;

export function loadElementsInt() {
    svg = document.querySelector<SVGSVGElement>("#svg1")!;

    inputRegister = document.getElementById("input-register") as any;
    outputDisplay = document.getElementById("output-display") as any;
    akku = document.getElementById("akku") as any;
    mqRegister = document.getElementById("mq-register") as any;

    akADisplay = document.getElementById("alu-a") as any;
    akCDisplay = document.getElementById("alu-c") as any;
    shiftCounterCount = document.getElementById("shift-counter-count") as any;

    inputA  = document.getElementById("input-a") as any;
    inputB  = document.getElementById("input-b") as any;
    carryIn = document.getElementById("carry-in") as any;
    inputC  = document.getElementById("input-c") as any;

    writeAk = document.getElementById("write-ak") as any;
    shAk1 = document.getElementById("sh-ak-1") as any;
    shAk2 = document.getElementById("sh-ak-2") as any;
    shAk3 = document.getElementById("sh-ak-3") as any;
    shMQ1 = document.getElementById("sh-mq-1") as any;
    shMQ2 = document.getElementById("sh-mq-2") as any;
    shMQ3 = document.getElementById("sh-mq-3") as any;
    resetMQ = document.getElementById("reset-mq") as any;
    shl1 = document.getElementById("shl-shr-1") as any;
    shl2 = document.getElementById("shl-shr-2") as any;
    shl3 = document.getElementById("shl-shr-3") as any;
    resetAk = document.getElementById("reset-ak") as any;
    oneMQ0 = document.getElementById("1-mq-0") as any;
    resetSC = document.getElementById("reset-sc") as any;

    scClk = document.getElementById("sc-clk") as any;
    akMQ = document.getElementById("akku-mq") as any;

    carryOut1 = document.getElementById("carry-out-line-1") as any;
    carryOut2 = document.getElementById("carry-out-line-2") as any;
    sign = document.getElementById("sign") as any;
    ak0 = document.getElementById("ak-0") as any;
    sc0 = document.getElementById("sc-0") as any;
    mq0 = document.getElementById("mq-0") as any;
}