export interface Instruction {
    type: "mem" | "jmp" | "alu";
}

export interface MemoryInstruction extends Instruction {
    type: "mem";
    setInput?: number | "in1" | "in2";
    setShiftCounter?: number;
}

export interface JumpInstruction extends Instruction {
    type: "jmp";
    signal: "c-o" | "sgn" | "ak0" | "sc0" | "mq0" | "jmp";
    if?: boolean;
    line?: number;
    skip?: number;
}

export interface ALUInstruction extends Instruction {
    type: "alu";
    invA?: boolean;
    invB?: boolean;
    caIn?: boolean;
    invC?: boolean;

    wrAk?: boolean;
    shAk?: boolean;
    shMQ?: boolean;
    rsMQ?: boolean;
    shL?: boolean;
    rsAk?: boolean;
    sMQ0?: boolean;
    rsSC?: boolean;
}

export interface Program {
    name?: string,
    unit: "int" | "float",
    instructions: Instruction[],
}