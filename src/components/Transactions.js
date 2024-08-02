import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Buttons from './Buttons'

const Transactions = ({ multiSigWallet, provider }) => {
   const [address, setAddress] = useState('')
   const [amount, setAmount] = useState('')
   const [executed, setExecuted] = useState(false)
  const [transactionCount, setTransactionCount] = useState(0)


   const setHandler = async () => {
    const signer = await provider.getSigner()
    const signerAddress = await signer.getAddress()

    if (address && amount) {
        const amount = ethers.parseUnits('3', 'ether')
        const tx = await multiSigWallet.connect(signer).setTransaction(address, amount);
        await tx.wait()
      }
  }

   const fetchTransactionCount = async () => {
    if (!multiSigWallet) return
    const txCount = await multiSigWallet.getTransactionCount();
      setTransactionCount(Number(txCount));
  } 

   useEffect(() => {
    if (provider && multiSigWallet) {
      fetchTransactionCount()
    }
  }, [provider, multiSigWallet])
 

     
      return (
        <>
     {/* Set Transaction */}   
    <div className='setTransaction_input'>
      <input
        type='text'
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder='Recipient Address'
      />

      <input
        type='text'
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder='Enter amount'
      />
      <Buttons text='Set Transaction' handler={setHandler} />
    </div>

     {/* Get Transaction Count */}
    <div className='transaction_count'>
    <Buttons text='Get Transaction Count' handler={fetchTransactionCount} />
     <p>Transaction Count: {transactionCount}</p>
    </div>
    </>

  )
}

export default Transactions;