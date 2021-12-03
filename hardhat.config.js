require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

const privateKey = "";
const alchemyKey = "";
const apiKey = ""
const infuraKey = ""

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    kovan: {
      url: `https://eth-kovan.alchemyapi.io/v2/${alchemyKey}`,
      accounts: [`0x${privateKey}`],
    },
    bsc: {
      url: 'https://bsc-dataseed.binance.org/',
      accounts: [`0x${privateKey}`],
      gas: 8000000,
      gasPrice: 10000000000, // 10gWei
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${infuraKey}`,
      accounts: [`0x${privateKey}`],
      gas: 8000000,
      gasPrice: 1000000000, // 1gWei
      timeout: 200000,
    },
  },
  etherscan: {
    apiKey: apiKey
  }
};
