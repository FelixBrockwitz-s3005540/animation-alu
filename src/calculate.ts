import type { ALUInstruction, JumpInstruction, MemoryInstruction } from "./instructions";
import state from "./state";
import * as e from "./elements";

export function executeLine(line: number) {
    const instruction = state.program![line];
    if (!instruction) {
        e.output.value = state.ak.toString();
        if (state.playInterval !== undefined) {
            e.playButton.click();
        }
        return;
    }

    switch (instruction.type) {
        case "mem":
            executeMem(instruction);
            state.programCounter++;
            break;

        case "jmp":
            executeJmp(instruction);
            break;
    
        case "alu":
            executeALU();
            state.programCounter++;
            break;
    }

    if (state.programCounter >= state.program!.length) {
        state.aluResult = calculateAlu();
        e.output.value = state.ak.toString();
    } else {
        const nextInstruction = state.program![state.programCounter]!;
        
        if (nextInstruction.type === "alu") {
            setInputs(nextInstruction);
        } else {
            setInputs({ type: "alu" });
        }
        
        state.aluResult = calculateAlu();
    
        if (state.breakPoints.has(state.programCounter) && state.playInterval !== undefined) {
            e.playButton.click();
        }
    }
}

export function executeMem(instruction: MemoryInstruction) {
    switch (instruction.setInput) {
        case "in1":
            state.inputReg = parseInt(e.input1.value);
            break;
        case "in2":
            state.inputReg = parseInt(e.input2.value);
            break;
        case undefined:
            break;
        default:
            state.inputReg = instruction.setInput & 0xFF;
            break;
    }
    if (instruction.setShiftCounter !== undefined) {
        state.sc = instruction.setShiftCounter;
    }
}

export function executeJmp(instruction: JumpInstruction) {
    if (instruction.signal === "jmp") {
        if (instruction.line !== undefined) {
            state.programCounter = instruction.line;
        } 
        if (instruction.skip !== undefined) {
            if (instruction.skip < 0) {
                state.programCounter -= instruction.skip;
            } else {
                state.programCounter += instruction.skip + 1;
            }
        }
        return;
    }
    
    let signal: boolean;
    switch (instruction.signal) {
        case "c-o":
            signal = state.carryOut;
            break;
        case "sgn":
            signal = state.sign;
            break;
        case "ak0":
            signal = state.ak0;
            break;
        case "sc0":
            signal = state.sc0;
            break;
        case "mq0":
            signal = state.mq0;
            break;
    }

    if (signal === (instruction.if ?? false)) {
        if (instruction.line !== undefined) {
            state.programCounter = instruction.line;
        } 
        if (instruction.skip !== undefined) {
            state.programCounter += instruction.skip + 1;
        }
    } else {
        state.programCounter++;
    }
}

export function executeALU() {
    if (state.writeAk) {
        state.ak = state.aluResult;
        state.savedCarryOut = state.carryOut;
    }

    if (state.shAk && state.shMQ) {
        if (state.shl) {
            state.ak = (state.ak << 1) & 0xFF;
            state.ak = state.ak | ((state.mq & 0x80) >> 7);
            state.mq = (state.mq << 1) & 0xFF;
        } else {
            state.mq = (state.mq >> 1) & 0xFF;
            state.mq = state.mq | ((state.ak & 1) << 7);
            state.ak = (state.ak >> 1) & 0xFF;
        }
    } else if (state.shAk) {
        if (state.shl) {
            state.ak = (state.ak << 1) & 0xFF;
        } else {
            state.ak = (state.ak >> 1) & 0xFF;
        }
    } else if (state.shMQ) {
        if (state.shl) {
            state.mq = (state.mq << 1) & 0xFF;
        } else {
            state.mq = (state.mq >> 1) & 0xFF;
        }
    }
    if (state.shAk || state.shMQ) {
        state.sc--;
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
    state.shl = instruction.sh_L ?? false;
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