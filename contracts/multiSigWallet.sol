// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract MultiSigWallet {
    address[3] public signatories;
    uint public requiredSignatures = 2;

    event TransactionCreated(address to, uint sendAmount);
    event TransactionApproved(uint _id);
    event TransactionExecuted(uint _id);

    mapping(uint => mapping(address => bool)) public approvals;

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

    function setTransaction(address _to, uint _sendAmount) public onlySignatory {
        // Ensure the amount is greater than zero
        require(_sendAmount > 0, 'Amount should not be zero');

        // Create new transaction
        transactions.push(Transaction({
            to: _to,
            sendAmount: _sendAmount,
            executed: false,
            approvalCount: 0
        }));

        // Emit the event for set transaction
        emit TransactionCreated(_to, _sendAmount);
    }

    // Get the count of transactions
    function getTransactionCount() public view returns (uint) {
        return transactions.length;
    }

    function approveTransaction(uint _id) public onlySignatory {
        // Check if the transaction ID is valid
        require(_id < transactions.length, 'Transaction does not exist');

        // Get the transaction from the transactions array
        Transaction storage transaction = transactions[_id];

        // Ensure the signatory hasn't already approved this transaction
        require(!approvals[_id][msg.sender], 'Transaction already approved by this signatory');

        // Mark the sender's approval as true
        approvals[_id][msg.sender] = true;

        // Increment the approval count
        transaction.approvalCount++;

        // Emit the event for approve transaction
            emit TransactionApproved(_id);

        // Execute the transaction if the required number of approvals is met
        if (transaction.approvalCount >= requiredSignatures) {
            executeTransaction(_id);  
        }
    }
}
  

