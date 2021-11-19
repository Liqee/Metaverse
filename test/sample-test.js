const { expect } = require("chai");
const { ethers } = require("hardhat");

let proxyAdminAddress, metaverseProxyAddress, grantDataProxyAddress;
const ipfsHash = "QmV7KjQwkHfLNcZ8hvG8CC1XWrdNRWVcrmVUKkvhsDk5Mx";

describe("All", () => {
  it("deploy", async () => {
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
  });

  it("Metaverse permission control", async () => {
    const Metaverse = await ethers.getContractFactory("Metaverse");
    const metaverse = Metaverse.attach(metaverseProxyAddress);
    try {
      await metaverse.setGrantData(proxyAdminAddress);
    } catch (error) {
      expect(error).to.exist;
    }

    const [owner] = await ethers.getSigners();
    try {
      await metaverse.mint(owner.address, "sadasdsad");
    } catch (error) {
      expect(error).to.exist;
    }
  });

  it("GrantData addClaimData", async () => {
    const GrantData = await ethers.getContractFactory("GrantData");
    const grantData = GrantData.attach(grantDataProxyAddress);

    const [owner] = await ethers.getSigners();

    await grantData.addClaimData(1, [{ user: owner.address, ipfsHash: ipfsHash }]);

    const batches = await grantData.getBatches();
    expect(batches[0].toNumber()).to.eq(1);

    const claimData = await grantData.getClaimData(1, owner.address);
    expect(claimData.ipfsHash).to.eq(ipfsHash);
    expect(claimData.claim).to.eq(false);
  });

  it("GrantData claim", async () => {
    const GrantData = await ethers.getContractFactory("GrantData");
    const grantData = GrantData.attach(grantDataProxyAddress);

    await grantData.claim(1);

    const Metaverse = await ethers.getContractFactory("Metaverse");
    const metaverse = Metaverse.attach(metaverseProxyAddress);

    const [owner] = await ethers.getSigners();
    const balanceOf = await metaverse.balanceOf(owner.address);
    expect(balanceOf.toNumber()).to.eq(1);

    const ownerOf = await metaverse.ownerOf(balanceOf.toNumber());
    expect(ownerOf).to.eq(owner.address);

    const getURI = await metaverse.tokenURI(balanceOf.toNumber());
    expect(getURI).to.eq("ipfs://" + ipfsHash);
  });
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