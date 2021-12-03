const { expect } = require("chai");
const { ethers } = require("hardhat");
const { keccak256 } = require("ethereumjs-util");
const { MerkleTree } = require("merkletreejs");

const AbiCoder = ethers.utils.defaultAbiCoder;

describe("All", () => {
    let leaves;
    let tree1;
    let tree2;
    let merkleRoot1;
    let merkleRoot2;

    it("deploy", async () => {
        leaves = bscData.map((x) => ethers.utils.keccak256(AbiCoder.encode(["address", "uint", "uint", "string"], [x.address, x.amount, x.tokenId, x.ipfsHash])));
        tree1 = new MerkleTree(leaves, keccak256, { sort: true });
        merkleRoot1 = tree1.getHexRoot();
        console.log("bsc merkleRoot: ", merkleRoot1);

        leaves = ethData.map((x) => ethers.utils.keccak256(AbiCoder.encode(["address", "uint", "uint", "string"], [x.address, x.amount, x.tokenId, x.ipfsHash])));
        tree2 = new MerkleTree(leaves, keccak256, { sort: true });
        merkleRoot2 = tree2.getHexRoot();
        console.log("eth merkleRoot: ", merkleRoot2);
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

const bscData = [
    { "amount": "384052370600000000000000", "address": "0x5c3b6565C9bb87E740C155E92c34318B706c6126", "tokenId": "1", "ipfsHash": "QmRRdRpa78Ldneeo5BcehwrAzXDmDN1Q48UsqUpazTRb5w" },
    { "amount": "319055233100000000000000", "address": "0x36b295A58b99BcF9a2FE54C7794977A343309e4b", "tokenId": "2", "ipfsHash": "QmaQgk89tqpXkf7ASZvHBGqAdxnTtZcDjWLAxxXZbLToPS" },
    { "amount": "281005796800000000000000", "address": "0x67a7DeA3a16a2b786c2FA5940E76601775FD3576", "tokenId": "3", "ipfsHash": "QmQ3MxymrA9zL9i87nL2DRV1cPZ795BPeyGBEoMLiZ8sB3" },
    { "amount": "246831638400000000000000", "address": "0x2929F07fF145a21b6784fE923b24F3ED38C3a5c3", "tokenId": "4", "ipfsHash": "QmVXJQ2qXrXd53wQzdQFJhsLtzmKPndtCe9wLQewzJ9Nej" },
    { "amount": "181097956300000000000000", "address": "0x10897aC62702901a8B8ef7d00C76127BC14901eC", "tokenId": "5", "ipfsHash": "QmXZcp8MKwH6rkS2FVokCvCZ32vKNKWoQrU69Ux9PgJXmJ" },
    { "amount": "179579940700000000000000", "address": "0x5997BafF274ea7ade9314Be8044D1Af9a274B121", "tokenId": "6", "ipfsHash": "QmbfMWeoiSubet9LxGt4bjahEknWBF9JcM5RZre7e7FSHB" },
    { "amount": "135732703600000000000000", "address": "0x60C9690D3e86f299e114C0CD10799113863f7C40", "tokenId": "7", "ipfsHash": "QmYgEvtfW6HmqiErwaTT87ABtJMQ9X2b56JGDS3MuR6NV4" },
    { "amount": "41981333100000000000000", "address": "0xf1135C96b9A4E39ceEd315B45dEC59929557bDB9", "tokenId": "8", "ipfsHash": "QmRdx63gv2a1We77Sz1MXmo9Ga2ctTp6MZKExMT9SzoFRe" },
    { "amount": "21024493900000000000000", "address": "0x7dD2067935a8693709e1fc99E1367c4618982B6b", "tokenId": "9", "ipfsHash": "QmNtUhLEYWsewsEcjQknoirzqfab8bVWwi9LzBZVPjsgjV" },
    { "amount": "13148527100000000000000", "address": "0xBfd72dbBf9A648f7D097E5a6a970663ad7Df965f", "tokenId": "10", "ipfsHash": "QmX3BNrNMZ8GmsjCH6Vaj3vqeFccRzVEwRsKtQ97CUsmVd" },
    { "amount": "10280087100000000000000", "address": "0x27c27151F9BC6330B767BAb8dCADa11A253ccb8c", "tokenId": "11", "ipfsHash": "QmZwQZ8pW9UKPLpZnhSE2R2S8hcPAKz4u9DXCJKRU6PvQg" },
    { "amount": "7226095000000000000000", "address": "0x357a504228e1C671f064D9346c18Adc3A31bF9ED", "tokenId": "12", "ipfsHash": "QmWSB4h3iKbhAv7eVgVxvjtGuGk4m7V6E9Y54T6w4vwFNC" },
    { "amount": "4570204300000000000000", "address": "0x624b54D7007aA7Dc90fDBf9E7CA424710a23b2D5", "tokenId": "13", "ipfsHash": "QmRotnuon9mJUMpadYjZfe51PW2dcVnwARjeqdnXUSPeBn" },
    { "amount": "4419644800000000000000", "address": "0xB61959B37AADFF714Af150580559858483459b8E", "tokenId": "14", "ipfsHash": "QmfJWv6Jd5VYxFGPms6kmoarnL4aB7QRkozFRHNwo5Rg5z" },
    { "amount": "3668227000000000000000", "address": "0xD7892339a019240e6fb4d15554CFd015E81023a6", "tokenId": "15", "ipfsHash": "QmSEYricsLwm5fBGSDPBfaZToxx4ARthgPrmLmizCBfPBH" },
    { "amount": "2124085900000000000000", "address": "0x24fC7A0751BBF53C239cC1D21d2951A5b21f733d", "tokenId": "16", "ipfsHash": "QmNxPVMdicH2ZYxZufiCYdv1duWxtJSHeZPPjr9EaxMBU6" },
    { "amount": "1770523200000000000000", "address": "0xC590d9ce1e50ae31339d7C1a80678E2DA7d9D3f8", "tokenId": "17", "ipfsHash": "QmWXAgM3yS6v97hp2BZ2T3UQuc4VAqJTpGH8MzJmkpMdxe" },
    { "amount": "1382456600000000000000", "address": "0x08670d6e3f9578f7745386B29BBD4FD61ea41e1A", "tokenId": "18", "ipfsHash": "QmXzHicZLRSDaKWButeJtSJwT8mHyc89rpUAqXfbuwd3ov" },
    { "amount": "1381584900000000000000", "address": "0x6F14066e20d8c431b0f86B869a41144f4d764Ed8", "tokenId": "19", "ipfsHash": "QmRcBgMqm3vjfPSgHviBWJ2QbDouCZvXFbBh4uiZM7C7bL" },
    { "amount": "1380983900000000000000", "address": "0x3b8a69292DD111509896159105Be1B035321Ecc0", "tokenId": "20", "ipfsHash": "QmVrh5FpsA9jmtUEavo4xRw6z2Zvm3hcaUg6Mn4894X1pU" },
    { "amount": "818038000000000000000", "address": "0xE7e9E7531b9379C40AfAA387598be9EfdcF06913", "tokenId": "21", "ipfsHash": "QmaesGMioSXYZnLxRi1GDD2jD47nYq9GivELsw7xGK4jJQ" },
    { "amount": "745791100000000000000", "address": "0x4041F4C3C4d61f309da696Ecc4A069A64Dfcf6EF", "tokenId": "22", "ipfsHash": "QmbRMudPyX2giK9HURMq5nWwxPPSXZ9YtNXgx2K7r9eXDP" },
    { "amount": "729478300000000000000", "address": "0xcDf67b8abfd40a774cB8b735B54950fB45F279F3", "tokenId": "23", "ipfsHash": "QmVT6FzKuiK8RF3eggdReAivMNZzmiLDddHDfGEFQw5SZZ" },
    { "amount": "643118800000000000000", "address": "0x6E6aBB4a0b481781f38f2C61ad46396791324567", "tokenId": "24", "ipfsHash": "QmR3xUEmvA4nkVKjJuS51R1s35gGFm1YrEAKpAKEByEHyv" },
    { "amount": "580212600000000000000", "address": "0xF7996f5cb0783c5Dd0cff39537dB8a342A06359A", "tokenId": "25", "ipfsHash": "QmNviFHVrGoR1F4rXYJeycYipjKuVcpM5JpZwEeciYHj53" },
    { "amount": "524662100000000000000", "address": "0x0e85276caA39A5b174AA5e9c700005dc45dC3d48", "tokenId": "26", "ipfsHash": "QmTRxvQB1fAesMYbs7w2FXZgR4W9K4NZQC2y24pRDbKyBx" },
    { "amount": "490924100000000000000", "address": "0x9eAc73024908553f575f3c1DC26Cda054db9E24E", "tokenId": "27", "ipfsHash": "QmPbx3HNwfzEkx5EnuVyTBM8xHkLtWGR6BYYnXvdJuoqm6" },
    { "amount": "485701100000000000000", "address": "0xcEE062885837116AC3082DAA3812A735023F9675", "tokenId": "28", "ipfsHash": "QmY6fCbaRw8z8NxMiE3PgFNogBtEHpj9gXrfTTiMx5UZjA" },
    { "amount": "456986800000000000000", "address": "0xE4D46566592783e373Dc7136dCC5abDfECfe6e86", "tokenId": "29", "ipfsHash": "QmRPD7hi3E3KsKMfKQgkXGJm7aSyn5csjtz9UzT3YYjPtA" },
    { "amount": "397421900000000000000", "address": "0x666B965C0e8730c8274cCcd1BB295c1558714321", "tokenId": "30", "ipfsHash": "QmczYCJahwepMBSx2vVFtKxf5yfx5sS12gD2uyJeZatA2d" },
    { "amount": "387533800000000000000", "address": "0xaF02C7A4b237bd34899ea85609ff6698192ACE76", "tokenId": "31", "ipfsHash": "QmSqfzaT4gnE5L7cde14vf3UWCAgX1dKURzA4PDgDP8AfH" },
    { "amount": "335811500000000000000", "address": "0xdFe89CAF65862c5B46FA22e8fA2296e05BfCBF94", "tokenId": "32", "ipfsHash": "QmdbjgrhF3vx3gQCfAWi7db8xKRY3j1m4pE8QqVZTUnCGE" },
    { "amount": "222726100000000000000", "address": "0xc296E9f9359c3bF69d2A1b614B1F99988D8d5b85", "tokenId": "33", "ipfsHash": "QmWNgSt4dB16oqBpDN9c4ZpYfMtroKgHUohtYt8m6L45fd" },
    { "amount": "208600200000000000000", "address": "0xc2c577bF5b8994F54D8F628bCbC7ba7559ebDA9A", "tokenId": "34", "ipfsHash": "QmPWAZc5FkuhHLHkqzaKV2xpa7ZgTo5o5NxYBHJVCCD6QQ" },
    { "amount": "181340200000000000000", "address": "0x5acfbbF0aA370F232E341BC0B1a40e996c960e07", "tokenId": "35", "ipfsHash": "QmNVrHeygStWGfdVfhWkuvzHWXRAr9EVKYQf1G4ZWa3YBk" },
    { "amount": "180813200000000000000", "address": "0x10319c043c7E1Cf35777399A9D5D57b2edd7dc27", "tokenId": "36", "ipfsHash": "QmRfUxMWnZ65Vzvn4SCCZZKZzB39DWkygirYBVRcM2Rkrb" },
    { "amount": "127933000000000000000", "address": "0x8B129D184B11ac30205E1Dc3866a181649Efde64", "tokenId": "37", "ipfsHash": "QmaWTFujLP3AKw54vtz9gzd5u4VjUkEt57G3mqdBBA4Nco" },
    { "amount": "115018800000000000000", "address": "0xa66390425De1f7cfBA1BA4fE12ce8d7D573674b3", "tokenId": "38", "ipfsHash": "Qmd6RQK5zvzLEVee1vLEbRzL1MZbEssikhYd7rKfPv2k79" },
    { "amount": "110614200000000000000", "address": "0x6d69A22e26D30dd05d637dADf411d9cd6581F93d", "tokenId": "39", "ipfsHash": "QmQzZ4nQqbrU4gRFrbDfHX8CvbxuuetCYU4kTujzEpYGmY" }
]

const ethData = [
    { "amount": "312170877000000000000000", "address": "0x5997BafF274ea7ade9314Be8044D1Af9a274B121", "tokenId": "1", "ipfsHash": "QmTd4H8gNCZARD5ZsRDgxim7tazLT9pkNBE51EsSimPVqw" },
    { "amount": "87501494300000000000000", "address": "0x392b4C2235d9b0B3BC18237f1bd8cd9a12243052", "tokenId": "2", "ipfsHash": "QmPDXVr2jbB94UAeH1qkwuZD3iJwoEUJYDv1T88k5X7ydp" },
    { "amount": "45710513600000000000000", "address": "0xF67b7969c0e85fDD47A48c9514Be53FF10f4dBf1", "tokenId": "3", "ipfsHash": "QmQERNpHZsqQZJWmUEAggvZmqyp7n5GaGG724fAnND7pJD" },
    { "amount": "37906879800000000000000", "address": "0xAaa4e593fEd103fab22A6bbedecb370206af33d8", "tokenId": "4", "ipfsHash": "QmaDZR3CwTXa2SYqcQR8cv72DJQvFMFXGiEmFEHnFHSq5B" },
    { "amount": "23228593000000000000000", "address": "0x0f696812F40D52327B8cc419b1044b0e9C162ac9", "tokenId": "5", "ipfsHash": "QmQgPwqMsvXBFDA9FY3qS2rDDEvpVuiEyRNPPbpg4jatGt" },
    { "amount": "16568891200000000000000", "address": "0x09D0ed8D3eBf0b0B5d2A3D7096546d6d7085B8Bb", "tokenId": "6", "ipfsHash": "QmQdBFrUL2JWk3v4GSL2SABL3YW2cnVmQc9GnspYHmV11F" },
    { "amount": "14919115600000000000000", "address": "0xC16414AC1fedfDAC4F8A09674D994e1BbB9d7113", "tokenId": "7", "ipfsHash": "QmYnpcSZhd4apQwPjF5sVBo5y3s91E37WsMYCYvumzBiit" },
    { "amount": "4601265400000000000000", "address": "0xFd660518dC1b52d9F67FAcd42bbBA962B06b8E54", "tokenId": "8", "ipfsHash": "QmPPBGV5tvpffAKiJSktyW5A7SNAfnFH537KgEifPMRCaC" },
    { "amount": "3792670200000000000000", "address": "0x5668EAd1eDB8E2a4d724C8fb9cB5fFEabEB422dc", "tokenId": "9", "ipfsHash": "QmTakXD3Qi6vMdAMRJBfTJf8n5KFGg5DySnAYQ6muVvP7t" },
    { "amount": "3756331300000000000000", "address": "0xBFD06C3482785230387481B0c7d53B7dd216a651", "tokenId": "10", "ipfsHash": "QmTXNnS41vShKDbbB9skGbbCcpYnGCas9JLg6qghfQS5o1" },
    { "amount": "1814080700000000000000", "address": "0x35A74Cf36C28E10100b68A3d75C03C3d18a3400a", "tokenId": "11", "ipfsHash": "QmSKg1nzvcpxJRZS3Wogx4WaKJ7t54MrVWkYyqf6BZi366" },
    { "amount": "1409014800000000000000", "address": "0x3939d22aF089BdfbB96322744234F69dB1aB52F8", "tokenId": "12", "ipfsHash": "QmWUUVZR2nWtZm7abt5NTmLV6nfKdWAjtk8UNDDeqGynpK" },
    { "amount": "1380025600000000000000", "address": "0x361A6cCdEe43C33366b8C1f5eb90a0ADDFbc4CC6", "tokenId": "13", "ipfsHash": "Qmdrk5i6BcMEdasUfRWJPAQdEQ4mLmdbzi12r3YmkHvN4u" },
    { "amount": "1237457000000000000000", "address": "0xE9F40007bA897981748a515F7375ddcc22112cf0", "tokenId": "14", "ipfsHash": "QmeYTnNZjGpuMEc1c4m7qJhEQJCvpQdi3NbPQRptqoqnyY" },
    { "amount": "631159800000000000000", "address": "0x7bfFCd7D2C17D534EDf4d1535c8c44324eb13A36", "tokenId": "15", "ipfsHash": "QmSXuD7ZbZpQJ9FfkPwuMyhzparXn6JMJoKdpp3xTPU3vi" },
    { "amount": "577561000000000000000", "address": "0xEe8aB75f6E1d5247AD7aBC7B8e8F0Fbc6A45D533", "tokenId": "16", "ipfsHash": "QmTytWfW6vgpH5D2HfHJJGvYyKY7B2VCKJgMczQZudskoh" },
    { "amount": "450543900000000000000", "address": "0x01e68EA97aE3136DB56fB22CD0AC44f51c6A27C8", "tokenId": "17", "ipfsHash": "QmPEQfxNiRz1FfbfWqeppUcBNCrj8xQJuZZiLj1uknPekr" }
]