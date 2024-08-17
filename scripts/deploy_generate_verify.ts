import { ethers } from "hardhat";
import { utils } from "ffjavascript";
import { BigNumber, BigNumberish } from "ethers";
import {generateCallData} from "./proof_generation_utils"

// Change this path fo each new circuit
const BASE_PATH = "./circuits/multiplier/";

async function main() {
  // deploy contract
  const Verifier = await ethers.getContractFactory("./contracts/MultiplierVerifier.sol:Verifier");
  const verifier = await Verifier.deploy();
  await verifier.deployed();

  console.log(`Verifier deployed to ${verifier.address}`);

  // generate proof call data
  const {pi_a, pi_b, pi_c, input} = await generateCallData(BASE_PATH);

  // verify proof on contract
  //@ts-ignore
  const tx = await verifier.verifyProof(pi_a, pi_b, pi_c, input)
  
  console.log(`Verifier result: ${tx}`)
  console.assert(tx == true, "Proof verification failed!");

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});