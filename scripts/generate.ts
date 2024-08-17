import {generateCallData } from "./proof_generation_utils";

// Replace with the path to your circuit files
const BASE_PATH = "./circuits/multiplier/";

async function main() {
    console.log("Generating a new proof...")
    // Generate the call data from the newly created proof
    const callData = await generateCallData(BASE_PATH);

    console.log("Call data generated from the new proof:");
    console.log(callData);
    console.log("You can find your new proof in the file proof.json");
    process.exit(0);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
