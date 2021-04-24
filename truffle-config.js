require('dotenv').config()

const HDWalletProvider = require('@truffle/hdwallet-provider');


const mnemonic = process.env.MNEMONIC
const url = process.env.INFURA_KOVAN_URL + process.env.INFURA_PROJ_ID;

module.exports = {
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/build/contracts/',
  networks: {

    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    kovan: {
      provider: () => {
        return new HDWalletProvider(mnemonic, url)
      },
      network_id: '42',
      skipDryRun: true
    },
  },

  compilers: {
    solc: {
       version: "0.7.5",
    }
  },


  db: {
    enabled: false
  }
};
