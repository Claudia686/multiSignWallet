// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract MultiSigWallet {
	address[3] public signatories;
	uint public requiredSignatures = 2;

	// Event here
	event TransactionCreated(address to, uint sendAmount);



 struct Transaction {
 	address to;
 	uint sendAmount;
 	bool executed;
 	uint approvalCount;
}

Transaction[] public transactions;

modifier onlySignatory() {
	require(isSignatory(msg.sender), 'Not a signatory');
	_;
}

 constructor(address[3] memory _signatories) {
 	signatories = _signatories;
 }

 function isSignatory(address _address) public view returns (bool) {
 	for (uint i = 0; i < signatories.length; i++) {
 		if (signatories[i] == _address) {
 			return true;
 		}
 	}
 	return false;
 }

 function setTransaction( address _to, uint _sendAmount) public onlySignatory {
 	   // Ensure the amount is greater than zero
 	  require(_sendAmount > 0, 'Amount should not be zero');

 	// Create new transaction
 	 transactions.push(Transaction({
 		to: _to,
 		sendAmount: _sendAmount,
 		executed: false,
 		approvalCount: 0
 	}));

    // Emit the event
 	 emit TransactionCreated(_to, _sendAmount);
 }

 // Get the count of transactions
 function getTransactionCount() public view returns (uint) {
 	return transactions.length;
 }
}