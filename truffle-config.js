
const HDWalletProvider = require("@truffle/hdwallet-provider");
const keys = require("./keys.json");

module.exports = {
  contracts_build_directory: "./public/contracts",
  networks: {
    development: {
     host: "127.0.0.1",
     port: 7545,
     network_id: "*",
     gas: 6721975,
     gasPrice: 200000000000,
     timeoutBlocks: 200
    },
    goerli: {
      provider: () => 
        new HDWalletProvider(
          keys.PRIVATE_KEY,
          keys.INFURA_GOERLI_URL
        ),
      network_id: 5,
      gas: 5500000,
      gasPrice: 200000000000,
      confirmations: 2,
      timeoutBlocks: 200
    }
  },
  compilers: {
    solc: {
      version: "0.8.13",
      settings:{
        optimizer:{
          enabled: true,
          runs: 10
        }
      }
    }
  },
};
