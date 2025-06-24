require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

// Remove 0x prefix if present so Hardhat gets plain hex string
const PRIVATE_KEY = (process.env.PRIVATE_KEY || '').replace(/^0x/, '');
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || '';

module.exports = {
  solidity: {
    version: '0.8.18',
    settings: {
      optimizer: {
        enabled: true,
        runs: 150  // lower runs to minimize bytecode size
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : [],
      chainId: 11155111,
    },
  },
  paths: {
    sources: './src/contracts',
    artifacts: './src/abis-sepolia',
  },
  mocha: {
    timeout: 40000,
  },
};
