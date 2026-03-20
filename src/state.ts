import { toBits } from "./utils";

const state = {
    programCounter: 0,

    inputReg: 3,
    ak: 0,
    mq: 0,
    sc: 0,
    aluResult: 0,

    invA: false,
    invB: false,
    carryIn: false,
    invC: false,

    writeAk: false,
    shAk: true,
    shMQ: true,
    resetMQ: false,
    shl: false,
    resetAk: false,
    oneMQ0: false,
    resetSC: false,

    carryOut: false,

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
    },
}

function randomState() {
    state.inputReg = Math.floor(Math.random() * 256);
    state.ak = Math.floor(Math.random() * 256);
    state.mq = Math.floor(Math.random() * 256);
    state.sc = Math.floor(Math.random() * 100);
    state.aluResult = Math.floor(Math.random() * 256);

    state.invA = Math.random() < 0.5;
    state.invB = Math.random() < 0.5;
    state.carryIn = Math.random() < 0.5;
    state.invC = Math.random() < 0.5;

    state.writeAk = Math.random() < 0.5;
    state.shAk = Math.random() < 0.5;
    state.shMQ = Math.random() < 0.5;
    state.resetMQ = Math.random() < 0.5;
    state.shl = Math.random() < 0.5;
    state.resetAk = Math.random() < 0.5;
    state.oneMQ0 = Math.random() < 0.5;
    state.resetSC = Math.random() < 0.5;
    state.carryOut = Math.random() < 0.5;
}

randomState();

export default state;