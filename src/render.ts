import svg from "./assets/layout.plain.svg?raw";

async function init() {
    document.getElementById("svg-target")!.innerHTML = svg;
}

await init();