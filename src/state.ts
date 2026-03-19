const state = {
    programCounter: 0,

    inputReg: 0,
    accumulator: 0,
    mqReg: 0,
    shiftCounter: 0,

    accuMQ: undefined,
    shClk: false,

    invA: false,
    invB: false,
    carryIn: false,
    invC: false,
    writeAk: false,
    shAk: false,
    shMQ: false,
    resetMQ: false,
    shl: false,
    resetAk: false,
    oneMQ0: false,
    resetSC: false,
    
    mq0: false,
    sc0: false,
    ak0: false,
    sign: false,
    carryOut: false,
}

export default state;