# Play with ZK on the XRPL EVM Sidechain ✨

With just two lines of code, it is possible to easily generate and verify a ZK proof on the XRPL EVM Sidechain!✨    

In this example, we will generate a zk proof and verify it on-chain on the XRPL EVM Sidechain using a Circom circuit representing the multiplication of two integers `a` and `b`. We want to prove to the verifier that for a given result `c`, we know these integers `a` and `b`.  
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

### Prove and Deploy

Run: `npx hardhat run scripts/deploy.ts --network XRPL_EVM_Sidechain_Devnet`  
This script does four things:  
1. Deploys the `MultiplierVerifier.sol` contract.
2. Generates a proof from circuit intermediaries with `generateProof()`.
3. Generates calldata with `generateCallData()`.

After generating your proof, you will see a `proof.json` file in the circuit's **out** folder. This is actually the proof and contains an attribute `publicSignals`. For example, if you are proving that you know two numbers `a` and `b` such that `a * b = c`, the value `c` might be part of `publicSignals`, while `a` and `b` remain private. The verifier checks that the proof is valid for the given `c` without knowing `a` and `b`.

### Verify the Contract

1. Run `npx hardhat flatten contracts/MultiplierVerifier.sol > Flattened.sol`.
2. Go to https://explorer.xrplevm.org/ and verify your deployed contract using `Flattened.sol`.

### Resources

- XRPL EVM Sidechain documentation: https://opensource.ripple.com/docs/evm-sidechain/intro-to-evm-sidechain/
- SnarkJS: https://github.com/iden3/snarkjs
- Based on tutorials from https://github.com/projectsophon/hardhat-circom & https://github.com/gmchad/zardkat.
