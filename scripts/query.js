// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");

//kovan
const proxyAdminAddress = "0xCC8278F065222f437a22b2645F524A632d30F835"
const cardImplAddress = "0x15a00377C8aC46Ca8D1B50558BfF639663D74d9f"
const cardProxyAddress = "0x11A6e1209EE68D7C3622bB5dC90792E77339B281"
const gardManagerImplAddress = "0x3DbdABA78063920382017d5F455422876C93b41F"
const gardManagerProxyAddress = "0x5081Ca4448ad4E73eBACF56d662ccB5363a58b2b"

async function main() {
    const CardManager = await ethers.getContractFactory("CardManager");
    const cardManager = CardManager.attach(gardManagerProxyAddress);

    const batchs = await cardManager.merkleRoot(1);
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