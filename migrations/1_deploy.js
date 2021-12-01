// Right click on the script name and hit "Run" to execute
(async () => {
    try {
        console.log("Running deploy Card and CardManager script...");

        // 'web3Provider' is a remix global variable object
        let provider = new ethers.providers.Web3Provider(web3.currentProvider);
        let signer = await provider.getSigner();
        const abiCoder = new ethers.utils.AbiCoder();

        let proxyAdminAddress;

        let proxyAdminMetadata, cardMetadata, cardManagerMetadata, proxyMetadata;
        let cardImplAddress, cardProxyAddress, cardManagerImplAddress, cardManagerProxyAddress;

        proxyAdminMetadata = JSON.parse(
            await remix.call("fileManager", "getFile", "browser/artifacts/contracts/lib/ProxyAdmin.sol/ProxyAdmin.json")
        );

        cardMetadata = JSON.parse(
            await remix.call("fileManager", "getFile", "browser/artifacts/contracts/Card.sol/Card.json")
        );

        cardManagerMetadata = JSON.parse(
            await remix.call("fileManager", "getFile", "browser/artifacts/contracts/CardManager.sol/CardManager.json")
        );

        proxyMetadata = JSON.parse(
            await remix.call("fileManager", "getFile", "browser/artifacts/@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol/TransparentUpgradeableProxy.json")
        );

        // 0. Deploys proxy admin.
        if (!proxyAdminAddress) {
            console.log("Going to deploy proxy admin");
            // Create an instance of a Contract Factory
            const proxyAdminFactory = new ethers.ContractFactory(proxyAdminMetadata.abi, proxyAdminMetadata.bytecode, signer);
            const proxyAdmin = await proxyAdminFactory.deploy();
            // The contract is NOT deployed yet; we must wait until it is mined
            await proxyAdmin.deployed();
            console.log("proxy admin contract address: ", proxyAdmin.address);
            proxyAdminAddress = proxyAdmin.address;
        }

        const cardInterface = new ethers.utils.Interface(cardMetadata.abi);
        const cardManagerInterface = new ethers.utils.Interface(cardManagerMetadata.abi);

        //1. deploy Card implementation
        if (!cardImplAddress) {
            console.log("Going to deploy a new Card implementation contract!");

            // Create an instance of a Contract Factory
            const cardFactory = new ethers.ContractFactory(cardMetadata.abi, cardMetadata.bytecode, signer);
            const cardContract = await cardFactory.deploy();
            // The contract is NOT deployed yet; we must wait until it is mined
            await cardContract.deployed();
            console.log("Card implementation contract address: ", cardContract.address);

            console.log("Going to call initialize function in the Card");
            tx = await cardContract.initialize();
            await tx.wait(1);

            cardImplAddress = cardContract.address;
            console.log("Finish to deploy Card implementation!");
        }

        //2. deploy Card proxy
        if (!cardProxyAddress) {
            console.log("Going to deploy Card proxy contract!");
            const initData = cardInterface.encodeFunctionData("initialize", []);
            console.log("Card proxy initData is: ", initData);

            const cardProxyFactory = new ethers.ContractFactory(proxyMetadata.abi, proxyMetadata.bytecode, signer);
            const cardProxy = await cardProxyFactory.deploy(cardImplAddress, proxyAdminAddress, initData);
            await cardProxy.deployed();
            cardProxyAddress = cardProxy.address;
            console.log("Card proxy contract address: ", cardProxyAddress);
        }

        //3. deploy CardManager implementation
        if (!cardManagerImplAddress) {
            console.log("Going to deploy a new CardManager implementation contract!");

            // Create an instance of a Contract Factory
            const cardManagerFactory = new ethers.ContractFactory(cardManagerMetadata.abi, cardManagerMetadata.bytecode, signer);
            const cardManagerContract = await cardManagerFactory.deploy(cardProxyAddress);
            // The contract is NOT deployed yet; we must wait until it is mined
            await cardManagerContract.deployed();
            console.log("CardManager implementation contract address: ", cardManagerContract.address);

            //Initialize has been called in constructor.

            cardManagerImplAddress = cardManagerContract.address;
            console.log("Finish to deploy CardManager implementation!");
        }

        //4. deploy CardManager proxy
        if (!cardManagerProxyAddress) {
            console.log("Going to deploy CardManager proxy contract!");
            const initData = cardManagerInterface.encodeFunctionData("initialize", [cardProxyAddress]);
            console.log("CardManagerProxy initData is: ", initData);

            const cardManagerProxyFactory = new ethers.ContractFactory(proxyMetadata.abi, proxyMetadata.bytecode, signer);
            const cardManagerProxy = await cardManagerProxyFactory.deploy(cardManagerImplAddress, proxyAdminAddress, initData);
            await cardManagerProxy.deployed();
            
            cardManagerProxyAddress = cardManagerProxy.address;
            console.log("CardManager proxy contract address: ", cardManagerProxyAddress);
        }

        //5. add Card Minter

        console.log("Going to add Card minter!");
        let card = new ethers.Contract(cardProxyAddress, cardMetadata.abi, signer);
        await card.addMinter(cardManagerProxyAddress);
        console.log("add Card minter is done")

    } catch (e) {
        console.log(e.message);
    }
})();
