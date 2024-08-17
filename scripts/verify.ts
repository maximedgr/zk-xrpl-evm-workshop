import { ethers } from "hardhat";
import { BigNumberish } from "ethers";
import { generateCallDataFromExistingProof } from "./proof_generation_utils";

// Replace with your deployed contract address
const VERIFIER_CONTRACT_ADDRESS = "0x90f817E5EaA0FDC948CF0F5d0c1f0Fa41FbC0dC2";
const BASE_PATH = "./circuits/multiplier/";

async function main() {
    // Generate the call data from the existing proof
    const { pi_a, pi_b, pi_c, input } = await generateCallDataFromExistingProof(BASE_PATH);

    // Get an instance of the deployed Verifier contract
    const verifier = await ethers.getContractAt("Verifier", VERIFIER_CONTRACT_ADDRESS);

    // Verify the proof on the contract
    //@ts-ignore
    const result = await verifier.verifyProof(pi_a, pi_b, pi_c, input);

    console.log(`Proof verification result: ${result}`);

    // Ensure that the proof is valid
    if (result) {
        console.log("Proof is valid.");
    } else {
        console.error("Proof verification failed!");
    }
    process.exit(0);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
