require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

const privateKey = "";
const alchemyKey = "";
const apiKey = ""

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
  },
  etherscan: {
    apiKey: apiKey
  }
};
