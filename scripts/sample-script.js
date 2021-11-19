// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");

async function main() {
  //deploy ProxyAdmin
  const ProxyAdmin = await ethers.getContractFactory("ProxyAdmin");
  const proxyAdmin = await ProxyAdmin.deploy();
  await proxyAdmin.deployed();
  proxyAdminAddress = proxyAdmin.address;
  console.log("ProxyAdmin address: ", proxyAdmin.address);

  //deploy Metaverse
  const Metaverse = await ethers.getContractFactory("Metaverse");
  let metaverse = await Metaverse.deploy();
  await metaverse.deployed();
  console.log("Metaverse impl address: ", metaverse.address);

  const Proxy = await ethers.getContractFactory("TransparentUpgradeableProxy");

  //deploy Metaverse proxy
  const deployMetaverseProxyData = getInitializerData(Metaverse, [], true);
  const metaverseProxy = await Proxy.deploy(metaverse.address, proxyAdmin.address, deployMetaverseProxyData);
  await metaverseProxy.deployed();
  metaverseProxyAddress = metaverseProxy.address;
  console.log("Metaverse proxy address: ", metaverseProxyAddress);

  //deploy GrantData
  const GrantData = await ethers.getContractFactory("GrantData");
  const grantData = await GrantData.deploy();
  await grantData.deployed();
  console.log("GrantData impl address: ", grantData.address);

  //deploy GrantData proxy
  const deployGrantDataProxyData = getInitializerData(GrantData, [metaverseProxy.address], true);
  const grantDataProxy = await Proxy.deploy(grantData.address, proxyAdmin.address, deployGrantDataProxyData);
  await grantDataProxy.deployed();
  grantDataProxyAddress = grantDataProxy.address;
  console.log("GrantData proxy address: ", grantDataProxyAddress);

  //Set the address of GrantData in Metaverse
  metaverse = Metaverse.attach(metaverseProxy.address);
  await metaverse.setGrantData(grantDataProxy.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

function getInitializerData(ImplFactory, args, initializer) {
  if (initializer === false) {
    return "0x";
  } else {
    initializer = "initialize";
  }

  const allowNoInitialization = initializer === undefined && args.length === 0;

  try {
    const fragment = ImplFactory.interface.getFunction(initializer);
    return ImplFactory.interface.encodeFunctionData(fragment, args);
  } catch (e) {
    if (e instanceof Error) {
      if (allowNoInitialization && e.message.includes("no matching function")) {
        return "0x";
      }
    }
    throw e;
  }
}