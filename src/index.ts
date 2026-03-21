import {positionRowHighlight, render, init as renderInit, renderProgram} from "./render";
import * as e from "./elements";
import type { Program } from "./instructions";
import state from "./state";
import { executeLine } from "./calculate";

async function init() {
    e.circuitSelect.addEventListener("change", () => {
        if (e.circuitSelect.value === "float") {
            throw new EvalError("Not Implemented");
        }
    });

    e.programSelect.addEventListener("change", async () => {
        const response = await fetch(e.programSelect.value);
        const json = await response.text();
        const parsed = JSON.parse(json) as Program;
        state.programName = parsed.name;
        state.executionUnit = parsed.unit;
        state.program = parsed.instructions;
        renderProgram();
        e.resetButton.click();
    });
    e.programSelect.dispatchEvent(new Event("change"));
    
    e.resetButton.addEventListener("click", () => {
        state.programCounter = 0;
        positionRowHighlight();
    });

    e.stepButton.addEventListener("click", () => {
        console.log(state.programCounter);
        console.log(state.program![state.programCounter]);
        executeLine(state.programCounter);
        render();
        positionRowHighlight();
    });

    await renderInit();
}

await init();