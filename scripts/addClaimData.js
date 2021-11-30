// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");

//kovan
const proxyAdminAddress = "0x88df649C33e1De6c62B6314b3c8535D58969EbC0"
const cardImplAddress = "0xb5A382FE8dC1Dbe58Ef0399c2632A8B434748DF5"
const cardProxyAddress = "0x122E08EbB58aB869033757D5d754228FBB9e1192"
const grantDataImplAddress = "0xe4F429e92f7c22C6AE035A0f7cB65444b15a6527"
const grantDataProxyAddress = "0xf0bbFaf2f7429cB18d4462F81C39c596210f7718"

async function main() {
    const GrantData = await ethers.getContractFactory("GrantData");
    const grantData = GrantData.attach(grantDataProxyAddress);

    let leaves = testData.map((x) => ethers.utils.keccak256(AbiCoder.encode(["address", "uint", "uint", "string"], [x.address, x.amount, x.tokenId, x.ipfsHash])));
    let tree = new MerkleTree(leaves, keccak256, { sort: true });
    let merkleRoot = tree.getHexRoot();

    await grantData.addClaimData(merkleRoot);

    leaves = testData2.map((x) => ethers.utils.keccak256(AbiCoder.encode(["address", "uint", "uint", "string"], [x.address, x.amount, x.tokenId, x.ipfsHash])));
    tree = new MerkleTree(leaves, keccak256, { sort: true });
    merkleRoot = tree.getHexRoot();

    await grantData.addClaimData(merkleRoot);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });


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