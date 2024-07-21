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
				const latestTransactionIndex = Number(transactionCount) - 1

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

	describe('Approve transaction', () => {
		describe('Success', () => {
			// Setting a new transaction amount
			const setNewAmount = ethers.parseUnits('3', 'ether')

			beforeEach(async () => {
				// Send funds to contract
				const tx = await signatory1.sendTransaction({
					to: multiSigWallet.target,
					value: ethers.parseEther("10.0")
				})
				await tx.wait()
				const setTx = await multiSigWallet.connect(signatory1).setTransaction(signatory1.address, setNewAmount);
				await setTx.wait()
			})

			it('Should emit TransactionApproved event', async () => {
				// Check for TransactionApproved event
				await expect(multiSigWallet.connect(signatory1).approveTransaction(0))
				.to.emit(multiSigWallet, 'TransactionApproved').withArgs(0)

				await expect(multiSigWallet.connect(signatory2).approveTransaction(0))
				.to.emit(multiSigWallet, 'TransactionApproved').withArgs(0)
			})
		})

		describe('Failure', () => {
			// Preventing non-signatories from approving a transaction
			it('Should not allow a non-signatory to approve a transaction', async () => {
				await expect(multiSigWallet.connect(hacker).approveTransaction(0))
					.to.be.revertedWith('Not a signatory')
			})
		})
	})

	describe('Approve execute transaction', () => {
		describe('Success', () => {
			// Setting a new transaction amount
			const setNewAmount = ethers.parseUnits('3', 'ether')

			beforeEach(async () => {
				// Send funds to contract
				const tx = await signatory1.sendTransaction({
					to: multiSigWallet.target,
					value: ethers.parseEther("10.0")
				})
				await tx.wait()

				const setTx = await multiSigWallet.connect(signatory1).setTransaction(signatory1.address, setNewAmount);
				await setTx.wait()
			})

			it('Should execute the transaction and increment approval count', async () => {
				const balanceBefore = await ethers.provider.getBalance(signatory1.address)

				// First approval by signatory2
				await multiSigWallet.connect(signatory2).approveTransaction(0)

				let transaction = await multiSigWallet.transactions(0);
				expect(transaction.approvalCount).to.equal(1)

				// Second approval by signatory3
				await multiSigWallet.connect(signatory3).approveTransaction(0)

				transaction = await multiSigWallet.transactions(0);
				expect(transaction.approvalCount).to.equal(2)

				// Fetch the transaction details after second approval
				transaction = await multiSigWallet.transactions(0)
				expect(transaction.executed).to.be.true;
				const balanceAfter = await ethers.provider.getBalance(signatory1.address)
			})

			it('Should emit TransactionExecuted event', async () => {
				// Approve the transaction with the first signatory
				await multiSigWallet.connect(signatory1).approveTransaction(0)
				// Approve the transaction with signatory 2 and check for both events
				await expect(multiSigWallet.connect(signatory2).approveTransaction(0))
				.to.emit(multiSigWallet, 'TransactionExecuted').withArgs(0)
			})
		})

	})
})