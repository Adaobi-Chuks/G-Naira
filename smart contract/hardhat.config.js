require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/6vymiRot3yVb5FSi-GQVBKYD3wQmPq5k`,
      accounts: ["f596baba778cf7dc3d4cfe93155401f35a5fa1d5584ef7606da778fdc3dacf29"]
    }
  }
};