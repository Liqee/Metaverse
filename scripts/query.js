// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");

//kovan
const proxyAdminAddress = "0xC439647f8395a7724BBB0886047243Bc85a19D6F"
const cardImplAddress = "0xDBCE5AaD26062c3303259d102f57c2cbe2F6B88E"
const cardProxyAddress = "0xA0C2098980d8354C4D89832E35EF00dE6Cd7b86F"
const grantDataImplAddress = "0xadecb9A41BB560C74C8d4E2C1410e854584ea342"
const grantDataProxyAddress = "0x4D90dd6Bbd4dc8cA268747D0D18ca399e0C620c6"

async function main() {
    const GrantData = await ethers.getContractFactory("GrantData");
    const grantData = GrantData.attach(grantDataProxyAddress);

    const batchs = await grantData.getClaimData(1, "0xFb9C88214bC0AB089fdC387342eFf3ebE61FC23d");
    console.log(batchs);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });