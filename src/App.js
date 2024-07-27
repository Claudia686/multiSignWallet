import { useEffect, useState} from 'react'
import {ethers} from 'ethers'

// Components 
import IsSignatory from './components/IsSignatory'
import Transactions from './components/Transactions'

// Abis 
import MultiSigWallet from './abis/multiSignWallet.json'

// Config 
import config from './config.json'


function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)
  const [multiSigWallet, setMultiSigWallet] = useState(null)
  const [isSignatory, setIsSignatory] = useState(null)
  const [address, setAddress] = useState ('')


// Connect to Metamask 
  const loadBlockchainData = async () => {
  const accounts = await window.ethereum.request({ 'method': 'eth_requestAccounts' })
  const account = ethers.getAddress(accounts[0])
  setAccount(account)

    // Connect to Blockchain 
  const provider = new ethers.BrowserProvider(window.ethereum)
  setProvider(provider)

  // Get network id 
  const network = await provider.getNetwork()

  // Connect to smart contract 7
  const multiSigWallet = new ethers.Contract(
    config[network.chainId].multiSigWallet.address, 
    MultiSigWallet, provider
  )
  setMultiSigWallet(multiSigWallet)

  }

 useEffect(() => {
    loadBlockchainData()
  }, [])


  return ( 
    <div>
    <h1>Multi-Signature Wallet</h1>
      <IsSignatory 
        multiSigWallet={multiSigWallet} 
        isSignatory={isSignatory}
        setIsSignatory={setIsSignatory}
        address={address}
        setAddress={setAddress}
      />
    </div>
    

  );
}

export default App;


