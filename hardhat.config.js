require("@nomiclabs/hardhat-waffle");


const fs = require('fs');

const privateKey = fs.readFileSync(".secret").toString().trim() || "01234567890123456789"

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
      localhost: {
      url: "http://127.0.0.1:8545"
    },
    // mumbai: {
    //   url: "https://polygon-mumbai.infura.io/v3/1a030b0d344d42c99cdc049f277883e2",
    //   accounts: [privateKey]
    // }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}