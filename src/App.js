import {
  useEffect,
  useState
} from 'react'
import {
  ethers
} from 'ethers'

// Components 
import IsSignatory from './components/IsSignatory'
import Transactions from './components/Transactions'
import Buttons from './components/Buttons'

// Abis 
import MultiSigWallet from './abis/multiSignWallet.json'
// Config 
import config from './config.json'

function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)
  const [isSignatory, setIsSignatory] = useState(null)
  const [multiSigWallet, setMultiSigWallet] = useState(null)
  const [address, setAddress] = useState('')
  const [transaction, setTransaction] = useState(null)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const connectHandler = async () => {
    const accounts = await window.ethereum.request({
      'method': 'eth_requestAccounts'
    })

    const account = ethers.getAddress(accounts[0])
    setAccount(account)
    await loadBlockchainData()
     }

  const loadBlockchainData = async () => {
    // Connect to Blockchain 
    const provider = new ethers.BrowserProvider(window.ethereum)
    setProvider(provider)

    // Get network id 
    const network = await provider.getNetwork()

    // Connect to smart contract 
    const multiSigWallet = new ethers.Contract(
      config[network.chainId].multiSigWallet.address,
      MultiSigWallet, provider
    )
    setMultiSigWallet(multiSigWallet)
    setLoading(false)
  }

  useEffect(() => {
    if (provider) { 
    }   
  }, [provider])

  return ( 
 <div>
      <h1>Multi-Signature Wallet</h1>
      <button className='connect_wallet' onClick={connectHandler} disabled={loading}>
        {loading ? 'Connecting...' : account ? 'Wallet Connected' : 'Connect Wallet'}
      </button>
      
      <IsSignatory
        multiSigWallet={multiSigWallet}
        isSignatory={isSignatory}
        setIsSignatory={setIsSignatory}
        address={address}
        setAddress={setAddress}

      />
      <Transactions
        multiSigWallet={multiSigWallet}
        provider={provider}
      />
    </div>
  )
}

export default App;