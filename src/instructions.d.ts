export interface Instruction {
    type: "mem" | "jmp" | "alu";
}

export interface MemoryInstruction extends Instruction {
    type: "mem";
    setInput: number | "in1" | "in2";
}

export interface JumpInstruction extends Instruction {
    type: "jmp";
    signal: "c-o" | "sgn" | "ak0" | "sc0" | "mq0" | "jmp";
    if: boolean | undefined;
    line: number;
}

export interface ALUInstruction extends Instruction {
    type: "alu";
    invA: boolean | undefined;
    invB: boolean | undefined;
    caIn: boolean | undefined;
    invC: boolean | undefined;

    wrAk: boolean | undefined;
    shAk: boolean | undefined;
    shMQ: boolean | undefined;
    rsMQ: boolean | undefined;
    shL: boolean | undefined;
    rsAk: boolean | undefined;
    sMQ0: boolean | undefined;
    rsSC: boolean | undefined;
}

export interface Program {
    name: string | undefined,
    unit: "int" | "float",
    instructions: Instruction[],
}