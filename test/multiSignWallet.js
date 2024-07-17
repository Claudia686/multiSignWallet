const {
	expect
} = require('chai');
const {
	ethers
} = require('hardhat');

describe('MultiSigWallet', () => {
	let multiSigWallet, signatory1, signatory2, signatory3

	beforeEach(async () => {
		// Get signers
		[signatory1, signatory2, signatory3] = await ethers.getSigners()

		// Deploy MultiSigWallet
		const MultiSigWallet = await ethers.getContractFactory('MultiSigWallet')
		multiSigWallet = await MultiSigWallet.deploy([signatory1.address, signatory2.address, signatory3.address])
		await multiSigWallet.waitForDeployment()
	})

	describe('Deployment', () => {
		it('Should set the correct signatories', async () => {
			expect(await multiSigWallet.signatories(0)).to.equal(signatory1.address)
			expect(await multiSigWallet.signatories(1)).to.equal(signatory2.address)
			expect(await multiSigWallet.signatories(2)).to.equal(signatory3.address)
		})

		it('Should set the correct required signatures', async () => {
			expect(await multiSigWallet.requiredSignatures()).to.equal(2)
		})

	})

})