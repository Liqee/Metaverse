// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");

//kovan
const proxyAdminAddress = "0x209A9Dfc1e1bdd62bB33D7109D3223eF5C7D187C"
const petaverseImplAddress = "0xf73932254090dab19700e5a2D61df2CCDE6fCC11"
const petaverseProxyAddress = "0xa11FD3582E7E3D5C0d153dAb8DF4638712348AF4"
const grantDataImplAddress = "0x79Fe4E29A3E4b28C901014F79Ef841100f657D81"
const grantDataProxyAddress = "0xa57f691ACAdD44e3b71e977943938414dc90fB35"

async function main() {
    const GrantData = await ethers.getContractFactory("GrantData");
    const grantData =GrantData.attach(grantDataProxyAddress);

    await grantData.addClaimData(1, [{ user: owner.address, ipfsHash: ipfsHash, tokenId: tokenId, amount: 1000 }]);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });