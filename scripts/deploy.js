const hre = require('hardhat');

async function main() {
	// Setup accounts & variables
	[signatory1, signatory2, signatory3, hacker] = await ethers.getSigners()

	// Deploy MultiSigWallet
	const MultiSigWallet = await ethers.getContractFactory('MultiSigWallet')
	multiSigWallet = await MultiSigWallet.deploy([signatory1.address, signatory2.address, signatory3.address])
	await multiSigWallet.waitForDeployment();
	console.log(`multiSigWallet deployed to : ${await multiSigWallet.getAddress()}`)
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
})