// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract MultiSigWallet {
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

 function isSignatory(address _address) public view returns (bool) {
 	for (uint i = 0; i < signatories.length; i++) {
 		if (signatories[i] == _address) {
 			return true;
 		}
 	}
 	return false;
 }
}