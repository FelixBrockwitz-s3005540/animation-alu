import svg from "./assets/layout.plain.svg?raw";
import * as e from "./elements";
import state from "./state";
import { floatToInt, toBits } from "./utils";

const trueColor = "rgb(0,255,0)";
const falseColor = "rgb(255,0,0)";

function colorWires() {
    e.inputA.style.stroke = (state.invA) ? trueColor : falseColor;
    e.inputB.style.stroke = (state.invB) ? trueColor : falseColor;
    e.carryIn.style.stroke = (state.carryIn) ? trueColor : falseColor;
    e.inputC.style.stroke = (state.invC) ? trueColor : falseColor;

    e.writeAk.style.stroke = (state.writeAk) ? trueColor : falseColor;
    e.shAk1.style.stroke = (state.shAk) ? trueColor : falseColor;
    e.shAk2.style.stroke = (state.shAk) ? trueColor : falseColor;
    e.shAk3.style.fill = (state.shAk) ? trueColor : falseColor;
    e.shMQ1.style.stroke = (state.shMQ) ? trueColor : falseColor;
    e.shMQ2.style.stroke = (state.shMQ) ? trueColor : falseColor;
    e.shMQ3.style.fill = (state.shMQ) ? trueColor : falseColor;
    e.resetMQ.style.stroke = (state.resetMQ) ? trueColor : falseColor;
    e.shl1.style.stroke = (state.shl) ? trueColor : falseColor;
    e.shl2.style.stroke = (state.shl) ? trueColor : falseColor;
    e.shl3.style.fill = (state.shl) ? trueColor : falseColor;
    e.resetAk.style.stroke = (state.resetAk) ? trueColor : falseColor;
    e.oneMQ0.style.stroke = (state.oneMQ0) ? trueColor : falseColor;
    e.resetSC.style.stroke = (state.resetSC) ? trueColor : falseColor;

    e.scClk.style.stroke = (state.shAk || state.shMQ) ? trueColor : falseColor;

    if (state.shAk && state.shMQ) {
        if (state.shl) {
            e.akMQ.style.stroke = (toBits(state.mq, 8)[7]) ? trueColor : falseColor;
        } else {
            e.akMQ.style.stroke = (toBits(state.ak, 8)[0]) ? trueColor : falseColor;
        }
    } else {
        e.akMQ.style.stroke = "black"
    }

    e.carryOut1.style.stroke = (state.carryOut) ? trueColor : falseColor;
    e.carryOut2.style.stroke = (state.carryOut) ? trueColor : falseColor;
    e.sign.style.stroke = (state.sign) ? trueColor : falseColor;
    e.ak0.style.stroke = (state.ak0) ? trueColor : falseColor;
    e.sc0.style.stroke = (state.sc0) ? trueColor : falseColor;
    e.mq0.style.stroke = (state.mq0) ? trueColor : falseColor;
}

async function init() {
    document.getElementById("svg-target")!.innerHTML = svg;

    e.loadElements();

    colorWires();
}

await init();