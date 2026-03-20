import state from "./state";

export function calcAlu(): number {
    return state.ak + state.inputReg;
}