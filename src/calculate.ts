import type { ALUInstruction, MemoryInstruction } from "./instructions";
import state from "./state";
import * as e from "./elements";

export function executeLine(line: number) {
    const instruction = state.program![line];
    if (!instruction) {
        console.log("halted");
        console.log("result: " + state.ak);
        return;
    }

    switch (instruction.type) {
        case "mem":
            if (state.shownInput) {
                executeMem(instruction as MemoryInstruction);
                state.programCounter++;
                state.shownInput = false;
            } else {
                state.shownInput = true;
            }
            break;

        case "jmp":
            if (state.shownInput) {
                state.shownInput = false;
            } else {
                state.shownInput = true;
            }
            break;
    
        case "alu":
            if (state.shownInput) {
                executeALU();
                state.programCounter++;
                state.shownInput = false;
            } else {
                setInputs(instruction as ALUInstruction);
                state.shownInput = true;
            }
            break;
    }

    state.aluResult = calculateAlu();
}

export function executeMem(instruction: MemoryInstruction) {
    switch (instruction.setInput) {
        case "in1":
            state.inputReg = parseInt(e.input1.value);
            break;
        case "in2":
            state.inputReg = parseInt(e.input2.value);
            break;
        default:
            state.inputReg = instruction.setInput & 0xFF;
            break;
    }
}

export function executeALU() {
    if (state.writeAk) state.ak = state.aluResult;

    if (state.shAk) {
        if (state.shl) {
            state.ak = (state.ak << 1) & 0xFF;
        } else {
            state.ak = (state.ak >> 1) & 0xFF;
        }
    }
    if (state.shMQ) {
        if (state.shl) {
            state.mq = (state.mq << 1) & 0xFF;
        } else {
            state.mq = (state.mq >> 1) & 0xFF;
        }
    }
    if (state.shAk || state.shMQ) {
        if (state.shl) {
            state.sc--;
        } else {
            state.sc++;
        }
    }

    if (state.oneMQ0) {
        state.mq = (state.mq | 1) & 0xFF;
    }

    if (state.resetAk) {
        state.ak = 0;
    }
    if (state.resetMQ) {
        state.mq = 0;
    }
    if (state.resetSC) {
        state.sc = 0;
    }
}

export function setInputs(instruction: ALUInstruction) {
    state.invA = instruction.invA ?? false;
    state.invB = instruction.invB ?? false;
    state.carryIn = instruction.caIn ?? false;
    state.invC = instruction.invC ?? false;

    state.writeAk = instruction.wrAk ?? false;
    state.shAk = instruction.shAk ?? false;
    state.shMQ = instruction.shMQ ?? false;
    state.resetMQ = instruction.rsMQ ?? false;
    state.shl = instruction.shL ?? false;
    state.resetAk = instruction.rsAk ?? false;
    state.oneMQ0 = instruction.sMQ0 ?? false;
    state.resetSC = instruction.rsSC ?? false;
}

export function calculateAlu(): number {
    const a = (state.invA) ? (~state.ak) & 0xFF : state.ak & 0xFF;
    const b = (state.invB) ? (~state.inputReg) & 0xFF : state.inputReg & 0xFF;
    const cIn = (state.carryIn) ? 1 : 0;
    const c = a + b + cIn;
    state.carryOut = (c & (1 << 8)) !== 0;
    return (state.invC) ? (~c) & 0xFF : c & 0xFF;
}