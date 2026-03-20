import { toBits } from "./utils";

const state = {
    programCounter: 0,

    inputReg: 0,
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

export default state;