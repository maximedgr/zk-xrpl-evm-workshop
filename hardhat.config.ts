import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-circom";
import circuits = require('./circuits.config.json')
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  circom: {
    // (optional) Base path for input files, defaults to `./circuits/`
    inputBasePath: "./circuits",
    // (required) The final ptau file, relative to inputBasePath, from a Phase 1 ceremony
    ptau: "pot28_hez_final_11.ptau",
    // (required) Each object in this array refers to a separate circuit
    circuits: JSON.parse(JSON.stringify(circuits))
  },
  networks: {
    XRPL_EVM_Sidechain_Devnet: {
      url: "https://rpc-evm-sidechain.xrpl.org",
      accounts: [process.env.DEV_PRIVATE_KEY || ''],
    },
  },
};

export default config;
