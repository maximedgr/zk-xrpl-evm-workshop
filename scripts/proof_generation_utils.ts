import { utils } from "ffjavascript";
import { BigNumber, BigNumberish } from "ethers";

const { unstringifyBigInts } = utils;
const fs = require("fs");
const snarkjs = require("snarkjs");

// Interface defining the structure of call data
export interface ICallData {
  pi_a: BigNumberish[];
  pi_b: BigNumberish[][];
  pi_c: BigNumberish[];
  input: BigNumberish[];
}

// Helper function to convert a number to a 256-bit BigNumber
export function p256(n: any): BigNumber {
    let nstr = n.toString(16);  // Convert number to hexadecimal string
    while (nstr.length < 64) nstr = "0" + nstr;  // Pad with leading zeros
    nstr = `0x${nstr}`;  // Prefix with '0x'
    return BigNumber.from(nstr);  // Convert to BigNumber
}

/**
 * Generates call data from a newly created proof.
 * 
 * @param path - The path to the directory containing the circuit and proof files.
 * @returns A promise that resolves to an object containing formatted proof components and input.
 */
export async function generateCallData(path: string): Promise<ICallData> {
    // Generate a proof using the given path
    let zkProof = await generateProof(path);

    // Unstringify the proof and public signals
    const proof = unstringifyBigInts(zkProof.proof);
    const pub = unstringifyBigInts(zkProof.publicSignals);

    // Convert public signals to string format
    let inputs = "";
    for (let i = 0; i < pub.length; i++) {
        if (inputs != "") inputs = inputs + ",";
        inputs = inputs + p256(pub[i]);
    }

    // Extract and format proof components
    let pi_a = [p256(proof.pi_a[0]), p256(proof.pi_a[1])];
    let pi_b = [[p256(proof.pi_b[0][1]), p256(proof.pi_b[0][0])], [p256(proof.pi_b[1][1]), p256(proof.pi_b[1][0])]];
    let pi_c = [p256(proof.pi_c[0]), p256(proof.pi_c[1])];
    let input = [inputs];

    return { pi_a, pi_b, pi_c, input };  // Return the formatted call data
}

/**
 * Generates a new proof and saves it to `proof.json`.
 * 
 * @param path - The path to the directory containing the input data and circuit files.
 * @returns A promise that resolves to the generated proof object.
 */
export async function generateProof(path: string) {
    // Read input parameters from JSON file
    const inputData = fs.readFileSync(path + "input.json", "utf8");
    const input = JSON.parse(inputData);

    // Calculate witness from the input data
    const out = await snarkjs.wtns.calculate(
        input,
        path + "out/circuit.wasm",
        path + "out/circuit.wtns"
    );

    // Generate proof from the witness
    const proof = await snarkjs.groth16.prove(
        path + "out/multiplier.zkey",
        path + "out/circuit.wtns"
    );

    // Write the proof to a JSON file
    fs.writeFileSync(path + "out/proof.json", JSON.stringify(proof, null, 1));

    return proof;  // Return the generated proof
}

/**
 * Generates call data from an existing proof.
 * 
 * @param path - The path to the directory containing the proof file.
 * @returns A promise that resolves to an object containing formatted proof components and input.
 * @throws An error if the `proof.json` file does not exist.
 */
export async function generateCallDataFromExistingProof(path: string): Promise<ICallData> {
    // Check if the proof file exists
    const proofFilePath = path + "out/proof.json";
    if (!fs.existsSync(proofFilePath)) {
        throw new Error(`Proof file not found at ${proofFilePath}`);  // Throw error if file is missing
    }

    // Read the existing proof from the JSON file
    const proofData = fs.readFileSync(proofFilePath, "utf8");
    const zkProof = JSON.parse(proofData);

    // Unstringify the proof and public signals
    const proof = unstringifyBigInts(zkProof.proof);
    const pub = unstringifyBigInts(zkProof.publicSignals);

    // Convert public signals to string format
    let inputs = "";
    for (let i = 0; i < pub.length; i++) {
        if (inputs != "") inputs = inputs + ",";
        inputs = inputs + p256(pub[i]);
    }

    // Extract and format proof components
    let pi_a = [p256(proof.pi_a[0]), p256(proof.pi_a[1])];
    let pi_b = [[p256(proof.pi_b[0][1]), p256(proof.pi_b[0][0])], [p256(proof.pi_b[1][1]), p256(proof.pi_b[1][0])]];
    let pi_c = [p256(proof.pi_c[0]), p256(proof.pi_c[1])];
    let input = [inputs];

    return { pi_a, pi_b, pi_c, input };  // Return the formatted call data
}
