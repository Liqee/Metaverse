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

  //deploy Card
  const Card = await ethers.getContractFactory("Card");
  let card = await Card.deploy();
  await card.deployed();
  console.log("Card impl address: ", card.address);

  const Proxy = await ethers.getContractFactory("TransparentUpgradeableProxy");

  //deploy Card proxy
  const deployCardProxyData = getInitializerData(Card, [], true);
  const cardProxy = await Proxy.deploy(card.address, proxyAdmin.address, deployCardProxyData);
  await cardProxy.deployed();
  cardProxyAddress = cardProxy.address;
  console.log("Card proxy address: ", cardProxyAddress);

  //deploy CardManager
  const CardManager = await ethers.getContractFactory("CardManager");
  const gardManager = await CardManager.deploy(cardProxy.address);
  await gardManager.deployed();
  console.log("CardManager impl address: ", gardManager.address);

  //deploy CardManager proxy
  const deployCardManagerProxyData = getInitializerData(CardManager, [cardProxy.address], true);
  const gardManagerProxy = await Proxy.deploy(gardManager.address, proxyAdmin.address, deployCardManagerProxyData);
  await gardManagerProxy.deployed();
  gardManagerProxyAddress = gardManagerProxy.address;
  console.log("CardManager proxy address: ", gardManagerProxyAddress);

  //Set the address of CardManager in Card
  card = Card.attach(cardProxy.address);
  await card.addMinter(gardManagerProxy.address);
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