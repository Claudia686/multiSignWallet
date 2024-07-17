const {
	expect
} = require('chai');
const {
	ethers
} = require('hardhat');

describe('MultiSigWallet', () => {
	let multiSigWallet, signatory1, signatory2, signatory3, hacker

	beforeEach(async () => {
		// Get signers
		[signatory1, signatory2, signatory3, hacker] = await ethers.getSigners()

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

	describe('Is signatory', () => {
		describe('Success', () => {
			it('Should return true for valid signatory addresses', async () => {
				// Test for signatory1
				expect(await multiSigWallet.isSignatory(signatory1.address)).to.be.true

				// Test for signatory2
				expect(await multiSigWallet.isSignatory(signatory2.address)).to.be.true

				// Test for signatory3
				expect(await multiSigWallet.isSignatory(signatory3.address)).to.be.true
			})
		})
		describe('Failure', () => {
			// Check for non-signatory addresses
			it('Should return false for non-signatory addresses', async () => {
				expect(await multiSigWallet.isSignatory(hacker.address)).to.be.false
			})
		})
	})

})