import {positionRowHighlight, render, init as renderInit, renderProgram} from "./render";
import * as e from "./elements";
import type { Program } from "./instructions";
import state from "./state";
import { executeLine, setInputs } from "./calculate";

function changePlaySpeed(interval: number) {
    state.playIntervalValue = interval;

    if (interval <= 100) {
        e.rowHighlight.classList.add("instant");
    } else {
        e.rowHighlight.classList.remove("instant");
    }

    if (state.playInterval === undefined) return;

    clearInterval(state.playInterval);
    state.playInterval = setInterval(() => {
        e.stepButton.click();
    }, interval);
}

async function init() {
    e.circuitSelect.addEventListener("change", () => {
        if (e.circuitSelect.value === "float") {
            throw new EvalError("Not Implemented");
        }
    });

    e.programUpload.addEventListener("change", ev => {
        const file = e.programUpload.files![0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = ev => {
            const json = ev.target!.result as string;
            const parsed = JSON.parse(json) as Program;
            state.programName = parsed.name;
            state.executionUnit = parsed.unit;
            state.program = parsed.instructions;
            state.programCounter = 0;
            renderProgram();
            e.resetButton.click();
        };
        reader.readAsText(file);
    });

    e.programSelect.addEventListener("change", async () => {
        if (e.programSelect.value === "custom") {
            e.programUpload.click();
            return;
        }
        const response = await fetch(e.programSelect.value);
        const json = await response.text();
        const parsed = JSON.parse(json) as Program;
        state.programName = parsed.name;
        state.executionUnit = parsed.unit;
        state.program = parsed.instructions;
        state.programCounter = 0;
        renderProgram();
        e.resetButton.click();
    });
    
    e.resetButton.addEventListener("click", () => {
        e.output.value = "";
        state.programCounter = 0;
        positionRowHighlight();
        const firstInstruction = state.program![state.programCounter]!;
        if (firstInstruction.type === "alu") {
            setInputs(firstInstruction);
        } else {
            setInputs({ type: "alu" });
        }
        render();
    });
    
    e.stepButton.addEventListener("click", () => {
        executeLine(state.programCounter);
        render();
        positionRowHighlight();
    });

    e.playButton.addEventListener("click", () => {
        if (state.playInterval) {
            clearInterval(state.playInterval);
            state.playInterval = undefined;
            e.playButton.textContent = "Play";
        } else {
            state.playInterval = setInterval(() => {
                e.stepButton.click();
            }, parseFloat(e.playSpeedValue.value));
            e.playButton.textContent = "Stop";
        }
    });

    e.playSpeedRange.addEventListener("input", () => {
        if (!e.playSpeedRange.checkValidity()) return;

        e.playSpeedValue.value = e.playSpeedRange.value;
    });
    e.playSpeedRange.addEventListener("change", () => {
        changePlaySpeed(parseFloat(e.playSpeedRange.value));
    });

    e.playSpeedValue.addEventListener("input", () => {
        if (!e.playSpeedValue.checkValidity()) return;

        e.playSpeedRange.value = e.playSpeedValue.value;
    });
    e.playSpeedValue.addEventListener("change", () => {
        changePlaySpeed(parseFloat(e.playSpeedValue.value));
    });

    e.programSelect.dispatchEvent(new Event("change"));
    await renderInit();

    e.helpDialog.addEventListener("toggle", () => {
        if (e.helpDialog.open) {
            e.helpDialog.querySelector(".content")!.scrollTop = 10000;
        }
    });
    
    e.helpDialog.showModal();
}

await init();