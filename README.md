### Overview

## MultiSigWallet
# Is a smart contract that requires multiple signatories to approve and execute transactions. It can receive and hold Ether, create transactions, and execute them once approved by a majority.


## isSignatory
# Checks if the given address is one of the signatories of the wallet.


## setTransaction
# Creates a new transaction, transaction requires approval from multiple signatories before execution.


## getTransactionCount
# Returns the total number of transactions that have been created in the wallet.


## approveTransaction
# Allows a signatory to approve a transaction by its ID. If the required number of approvals is met, the transaction is executed.


## executeTransaction
#  Executes a transaction if it has received the required number of approvals. It transfers the specified amount of Ether to the designated recipient.


## Available Scripts
# deploy.js
In the project directory, you can run: npx hardhat run scripts/deploy.js --network hardhat.


## Running the frontend
In the project directory, you can run: npm start

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) 
to view it in your browser.