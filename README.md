# Play with ZK on the XRPL EVM Sidechain ✨

With just two lines of code, it is possible to easily generate and verify a ZK proof on the XRPL EVM Sidechain!✨    

In this example, we will generate a zk proof (SNARK) and verify it on-chain on the XRPL EVM Sidechain using a Circom circuit representing the multiplication of two integers `a` and `b` such as `a x b = c`.  
We want to prove to the verifier that for a given result c, we know the integers a and b without revealing them.  
This tutorial uses [hardhat-circom](https://github.com/projectsophon/hardhat-circom), a Hardhat plugin integrating [Circom](https://github.com/iden3/circom) and [SnarkJS](https://github.com/iden3/snarkjs) into Hardhat's build process.  

### Install
`npm i`

### Configure
1. Add and populate `.env` with `DEV_PRIVATE_KEY=your_DEV_priv_key`.
2. Fund your account with XRP on Devnet using this faucet: https://bridge.xrplevm.org/.
3. You can configure `hardhat.config.ts` and `circuits.config.json` as you like.

## Powers of Tau

You must provide a Powers of Tau from a Phase 1 ceremony. We recommend using one of the `.ptau` files from the Hermez Protocol's ceremony, available from [their Dropbox folder](https://www.dropbox.com/sh/mn47gnepqu88mzl/AACaJkBU7mmCq8uU8ml0-0fma?dl=0).  

These are all named `powersOfTau28_hez_final_*.ptau` where the `*` is some number. This number indicates the number of constraints (`2^x`) that can exist in your circuits.  

Nb: I have already included in the repository, within the circuit folder, a .ptau file for a constraint count of up to (2^15).  


### Circuits and Proof

Circuits are located within the `circuits` folder. Each circuit will have its own sub-folder with the actual `.circom` file, which represents the circuit, and an `input.json` file containing the circuit's inputs (what you want to prove).

### Compile
Run: `npx hardhat circom --verbose`  
This will generate the **out** folder with `multiplier.zkey`, `multiplier.vkey`, `multiplier.r1cs`, and `circuit.wasm`, as well as the Solidity verifier `MultiplierVerifier.sol` under the `contracts` folder.

### Deploy Contract - Generate and Verify proof

Run: `npx hardhat run scripts/deploy_generate_verify.ts --network XRPL_EVM_Sidechain_Devnet`  
This script does four things:  
1. Deploys the `MultiplierVerifier.sol` contract.
2. Generates a proof from circuit intermediaries with `generateProof()` in `generate.ts`.
3. Generates calldata with `generateCallData()` in `generate.ts`.

After generating your proof, you will see a `proof.json` file in the circuit's **out** folder. This is actually the proof and contains an attribute `publicSignals`. For example, if you are proving that you know two numbers `a` and `b` such that `a * b = c`, the value `c` might be part of `publicSignals`, while `a` and `b` remain private. The verifier checks that the proof is valid for the given `c` without knowing `a` and `b`.

### Commands

Here are some commands to generate new proofs and verify them once your circuit is generated and the verifier is deployed.  

1. Generate a New Proof:
Description: Generates a new proof and saves it to the proof.json file.  
Associated Script: `scripts/generate.ts`  
*Note*: Modify the value of `BASE_PATH` according to the circuit you want to use.  
Run:`npx hardhat run scripts/generate.ts --network XRPL_EVM_Sidechain_Devnet`  

2. Verify an Existing Proof:
Description: Verify an existing proof by interacting with the deployed contract.  
Associated Script: `scripts/verify.ts`  
*Note*: Modify the value of `BASE_PATH` according to the circuit you want to use, and update the value of `VERIFIER_CONTRACT_ADDRESS` with the address of your deployed contract on-chain.  
Command:`npx hardhat run scripts/verify.ts --network XRPL_EVM_Sidechain_Devnet`  

### Play arround

- Try modifying the inputs and generating a new proof, then verify it with the same verifier. What happens?
*Expected Outcome*: The proof remains valid and the verifier accepts it because the circuit is the same!

- Try modifying your proof in the proof.json file by changing the value of publicSignals, and then verify it. What happens?
*Expected Outcome*: The proof is no longer valid! The new value of publicSignals, which represents the public statement, does not satisfy the relation defined in your circuit.

### Verify the Contract

1. Run `npx hardhat flatten contracts/MultiplierVerifier.sol > Flattened.sol`.
2. Go to https://explorer.xrplevm.org/ and verify your deployed contract using `Flattened.sol`.

### Documentation

- XRPL EVM Sidechain documentation: https://opensource.ripple.com/docs/evm-sidechain/intro-to-evm-sidechain/
- SnarkJS: https://github.com/iden3/snarkjs
- Based on tutorials from https://github.com/projectsophon/hardhat-circom & https://github.com/gmchad/zardkat.


### Troubleshooting

You may encounter errors during deployment *(solidity compiler version: * contracts/MultiplierVerifier.sol (^0.6.11))* of the contract related to the automatically generated verifier contract. Simply modify the Solidity version in the contract file to match the one specified in your Hardhat configuration file.

## More XRPL EVM Sidechain Tutorials

| Repo                | Link                                                    |
|---------------------|---------------------------------------------------------|
| Deploy your first Solidity contract on the XRPL EVM Sidechain using Hardhat 👷 | [GitHub Repository](https://github.com/maximedgr/xrpl-evm-quickstart-hardhat) |
| Next.js x Rainbowkit Wallet configured for the XRPL EVM Sidechain 🌈 | [GitHub Repository](https://github.com/maximedgr/xrpl-evm-quickstart-rainbowkit) |

### Additional Resources
|Resources|Link|
|---|---|
|Docs|https://docs.xrplevm.org/docs/evm-sidechain/intro-to-evm-sidechain/|
|Bridge & Faucet|https://bridge.xrplevm.org/|
|MetaMask|https://metamask.io/|
|Solidity|https://docs.soliditylang.org/en/v0.8.26/|
|Hardhat|https://hardhat.org/|
|Remix IDE|https://remix.ethereum.org/|
|Grants|https://xrplgrants.org/|
|Accelerator|https://xrplaccelerator.org/|
