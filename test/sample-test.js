const { expect } = require("chai");
const { ethers } = require("hardhat");
const { keccak256 } = require("ethereumjs-util");
const { MerkleTree } = require("merkletreejs");

let proxyAdminAddress, cardProxyAddress, gardManagerProxyAddress;
const ipfsHash = "QmeTAhxGs1fLXdfCv8MPSnyai9BS6TdtmMnZv58bezsTuz";

const tokenId = 19;

const AbiCoder = ethers.utils.defaultAbiCoder;

describe("All", () => {
  let leaves;
  let tree1;
  let tree2;
  let merkleRoot1;
  let merkleRoot2;

  before(async () => {
    leaves = testData.map((x) => ethers.utils.keccak256(AbiCoder.encode(["address", "uint", "uint", "string"], [x.address, x.amount, x.tokenId, x.ipfsHash])));
    tree1 = new MerkleTree(leaves, keccak256, { sort: true });
    merkleRoot1 = tree1.getHexRoot();

    leaves = testData2.map((x) => ethers.utils.keccak256(AbiCoder.encode(["address", "uint", "uint", "string"], [x.address, x.amount, x.tokenId, x.ipfsHash])));
    tree2 = new MerkleTree(leaves, keccak256, { sort: true });
    merkleRoot2 = tree2.getHexRoot();
  });

  it("deploy", async () => {
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
  });

  it("Card permission control", async () => {
    const Card = await ethers.getContractFactory("Card");
    const card = Card.attach(cardProxyAddress);

    const [owner] = await ethers.getSigners();
    try {
      await card.mint(owner.address, "sadasdsad");
    } catch (error) {
      expect(error).to.exist;
    }
  });

  it("CardManager addClaimers", async () => {
    const CardManager = await ethers.getContractFactory("CardManager");
    const gardManager = CardManager.attach(gardManagerProxyAddress);

    await gardManager.addClaimers(merkleRoot1);
    await gardManager.addClaimers(merkleRoot2);

    const [owner] = await ethers.getSigners();

    const claimData = await gardManager.claimed(1, owner.address);
    expect(claimData).to.eq(false);
    let getMerkleRoot = await gardManager.merkleRoot(1);
    expect(getMerkleRoot).to.eq(merkleRoot1);
    getMerkleRoot = await gardManager.merkleRoot(2);
    expect(getMerkleRoot).to.eq(merkleRoot2);
  });

  it("should be able to verify proof with valid address", async function () {
    const CardManager = await ethers.getContractFactory("CardManager");
    const gardManager = CardManager.attach(gardManagerProxyAddress);

    testData.forEach(async (data) => {
      const leaf = ethers.utils.keccak256(AbiCoder.encode(["address", "uint", "uint", "string"], [data.address, data.amount, data.tokenId, data.ipfsHash]));
      let proof = tree1.getHexProof(leaf);

      const valid = await gardManager.verifyProof(1, proof, data.address, ethers.BigNumber.from(data.amount), ethers.BigNumber.from(data.tokenId), data.ipfsHash);
      expect(valid).to.equal(true);
    });
  });

  it("CardManager claim", async () => {
    const CardManager = await ethers.getContractFactory("CardManager");
    const gardManager = CardManager.attach(gardManagerProxyAddress);

    const data = testData[0];
    const leaf = ethers.utils.keccak256(AbiCoder.encode(["address", "uint", "uint", "string"], [data.address, data.amount, data.tokenId, data.ipfsHash]));
    let proof = tree1.getHexProof(leaf);

    await gardManager.claim(1, proof, data.address, ethers.BigNumber.from(data.amount), ethers.BigNumber.from(data.tokenId), data.ipfsHash);

    const Card = await ethers.getContractFactory("Card");
    const card = Card.attach(cardProxyAddress);

    const [owner] = await ethers.getSigners();
    const balanceOf = await card.balanceOf(owner.address);
    expect(balanceOf.toNumber()).to.eq(1);

    const ownerOf = await card.ownerOf(tokenId);
    expect(ownerOf).to.eq(owner.address);

    const getURI = await card.tokenURI(tokenId);
    expect(getURI).to.eq(ipfsHash);
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

function bufferFrom0xHexString(hex) {
  return Buffer.from(hex.replace(/0x/g, ""), "hex");
}

const testData = [
  { "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "amount": "10000000000000000000000", "tokenId": "19", "ipfsHash": "QmeTAhxGs1fLXdfCv8MPSnyai9BS6TdtmMnZv58bezsTuz" },
  { "address": "0x35137867d87Bf78f8c4340C00872930CBb5f92e0", "amount": "10000000000000000", "tokenId": "1", "ipfsHash": "Qmcfa4gTHGsu4kzFM4nD9TgAhK9QaHUp9LKJEBziGRMh61" },
  { "address": "0xD558F712bCF4Dfe262cBA7b2E7C54d99F2f668e1", "amount": "1000000000000000000", "tokenId": "2", "ipfsHash": "QmWBcxujEiEFox7Fx7cQu3Ym3Ykh7vUeP7tdvrtCG9hbKV" },
  { "address": "0x2931DD65AB9637C3Cf98030bD422aB7082651251", "amount": "10000000000000000000000", "tokenId": "3", "ipfsHash": "QmPC7MsmuHimDDdhoeFvWTwB2CGY7qkwJupFYemV5ccQej" },
  { "address": "0xcc4a8886A0f8c1FFe4FDd84b47eaCeBB52236D23", "amount": "1234500000000000000", "tokenId": "4", "ipfsHash": "QmdTbLbtj8m3dVFtKKeU6wvYndjHQxTDZzK8RwNxKVRxfu" },
  { "address": "0xf0A7b79cF18A103b917aC232B03e0a16355c744d", "amount": "1234567890123450000", "tokenId": "5", "ipfsHash": "QmWw8V3dxpWpPZpHANuCwxsR6erKSj76taGkLtPjqEmAju" },
  { "address": "0x3933B7D8097E03676D608bEA7a41Ece1D8B8d8C9", "amount": "12345678901234500000000", "tokenId": "6", "ipfsHash": "QmQbHpsaxrnojk68fjcLMuw8hY6kt7Nep2XMBK7uBGjUJ8" },
  { "address": "0x05F8eeF8c1F229E5C0D65A30EF6dd96b026e2D13", "amount": "10000000000000000000000000", "tokenId": "7", "ipfsHash": "QmQWbLPQ89yNcLHt9iA4d3ZJqfmoADENJG147iA9mYTWxr" },
  { "address": "0xec68E4a5baBBF31d1544e1afED71E879cd58B9F5", "amount": "10000000000010000000000000", "tokenId": "8", "ipfsHash": "QmTLh5GbSWzyfjYpikhpf9noh1EJLT5iQdnE5KEfCZis8t" },
  { "address": "0x09849240026E0131e386f8aA9720E3733AAf5574", "amount": "10000123456789000000000", "tokenId": "9", "ipfsHash": "QmYVhJe8mn5oHQBD2on5f3cyDwBrL7KrNcBqZcAuwdwbJC" },
  { "address": "0xCf6B6D9CeDe701570c3C07E57B8D69B1cAe27F89", "amount": "10000000000000000000000", "tokenId": "10", "ipfsHash": "QmWJxpPUomAHndwCRxEwgbiZpudbYUEbq4cCqbytfWYTS1" },
  { "address": "0xFA09b0FF56109D04447D118C78006b1Face422eb", "amount": "10000000000000000000000", "tokenId": "11", "ipfsHash": "QmXkB2cie8beHDTuTfTpRh7abBTCtjFDwonTTYpYL6jJfF" },
  { "address": "0x95E111E87847Cdb3E3e9Bf16607A36099115dEC7", "amount": "10000000000000000000000", "tokenId": "12", "ipfsHash": "QmcGNW2DBhzdHSDXiu72YRZgXKbEEHLef1cYAuHvJ3GVTS" },
  { "address": "0xf957869f317D0cFE3a4F91E4f3425d6FE3048Fd0", "amount": "10000000000000000000000", "tokenId": "13", "ipfsHash": "QmbzsdBHKioT6jeLyU1dKFKKa8H875Ttfp5eMoFFYHzS7i" },
  { "address": "0xF67b7969c0e85fDD47A48c9514Be53FF10f4dBf1", "amount": "10000000000000000000000", "tokenId": "15", "ipfsHash": "QmQ2LUvA89rtSCYuLs4P7xKeE7j9XUzybouVNwmhrWD5Ne" },
  { "address": "0xad0294eCEa33469e783230B49B8Df53bbc43d908", "amount": "10000000000000000000000", "tokenId": "16", "ipfsHash": "QmUsm1GswPhWVuxn6K9e6avTg7oCmsCZpdUfrqyGmG2dXk" },
  { "address": "0xA89BC2a9FE859A9367010429aCcfF192bCA33891", "amount": "10000000000000000000000", "tokenId": "18", "ipfsHash": "QmeTAhxGs1fLXdfCv8MPSnyai9BS6TdtmMnZv58bezsTuz" },
];

const testData2 = [
  { "address": "0x09849240026E0131e386f8aA9720E3733AAf5574", "amount": "10000000000000000000000", "tokenId": "14", "ipfsHash": "QmW31NiTWsR7T3jnAuxcC8QSwNB4EKsNwr3AVoQQQ5o3bm" },
  { "address": "0xad0294eCEa33469e783230B49B8Df53bbc43d908", "amount": "10000000000000000000000", "tokenId": "17", "ipfsHash": "QmYvZYxJwq3Ce2d9KT8yAMgGeJUu5LNoLsPmd1ndcUKrGo" }
]