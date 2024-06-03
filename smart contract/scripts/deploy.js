const main = async () => {
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.provider.getBalance(deployer.address);

    console.log("Deploying contracts with account: ", deployer.address);
    console.log("Account balance: ", accountBalance.toString());

    const waveContractFactory = await hre.ethers.getContractFactory("ERC20Token");

    const _tokenName = "G-Naira"
    const _tokenSymbol = "GNR"
    const _tokenDecimal = 18

    const waveContract = await waveContractFactory.deploy(_tokenName, _tokenSymbol, _tokenDecimal);
    await waveContract.waitForDeployment();

    console.log("WavePortal address: ", await waveContract.getAddress());
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();