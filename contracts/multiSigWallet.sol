// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract multiSigWallet {
	address[3] public signatories;
	uint public requiredSignatures = 2;

 struct Transaction {
 	address to;
 	uint sentAmount;
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
}