export function floatToInt(float: number): number {
    const view = new DataView(new Float32Array([float]).buffer);
    return view.getInt32(0, true);
}

export function toBits(int: number, numBits: number): boolean[] {
    const bits = [];
    for (let i = 0; i < numBits; i++) {
        bits.push((int & (1 << i)) !== 0);
    }
    return bits;
}

export function fromBits(bits: boolean[]): number {
    let num = 0;
    for (let i = 0; i < bits.length; i++) {
        num |= (bits[i] ? 1 : 0) << i;
    }

    return num;
}

export function bitString(bits: boolean[]): string {
    let str = "";
    for (const bit of bits) {
        str = (bit ? "1" : "0") + str;
    }
    return str;
}