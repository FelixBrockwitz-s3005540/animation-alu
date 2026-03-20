import svg from "./assets/layout.plain.svg?raw";
import * as e from "./elements";
import state from "./state";
import { floatToInt, toBits } from "./utils";

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

async function init() {
    document.getElementById("svg-target")!.innerHTML = svg;

    e.loadElements();

    colorWires();
}

await init();