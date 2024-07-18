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
		await multiSigWallet.waitForDeployment();
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

	describe('Set transaction', () => {
		describe('Success', () => {
			// Set an amount for new transaction
			const setNewAmount = ethers.parseUnits('3', 'ether')

			beforeEach(async () => {
				// Call setTransaction function
				const tx = await multiSigWallet.connect(signatory1).setTransaction(signatory2.address, setNewAmount)
				await tx.wait()
			})

			it('Should set new transaction', async () => {
				// Retrieve latest transaction
				const transactionCount = await multiSigWallet.getTransactionCount()

				// Calculate the index of the latest transaction
				const latestTransactionIndex = Number(transactionCount) - 1;

				// Fetch the latest transaction using the index
				const latestTransaction = await multiSigWallet.transactions(latestTransactionIndex)

				// Check if the transaction is correctly set
				expect(latestTransaction.to).to.equal(signatory2.address)
				expect(latestTransaction.sendAmount).to.equal(setNewAmount)
				expect(latestTransaction.executed).to.be.false
				expect(latestTransaction.approvalCount).to.equal(0)
			})

			it('Should emit set transaction event', async () => {
				const tx = await multiSigWallet.connect(signatory1).setTransaction(signatory2.address, setNewAmount)
				await tx.wait()
				await expect(tx).emit(multiSigWallet, 'TransactionCreated').withArgs(signatory2.address, setNewAmount)
			})
		})

		describe('Failure', () => {
			it('Rejects zero amount', async () => {
				// Set a transaction with an amount of zero
				const zeroAmount = ethers.parseUnits('0', 'ether')
				await expect(multiSigWallet.setTransaction(signatory1.address, zeroAmount)).to.be.revertedWith('Amount should not be zero');
			})
		})
	})
})