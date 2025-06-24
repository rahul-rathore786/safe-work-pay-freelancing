import { setGlobalState, getGlobalState } from '../store'
import DappWorksAbi from '../abis-sepolia/src/contracts/DappWorks.sol/DappWorks.json'
import UsdtAbi from '../abis-sepolia/src/contracts/USDT.sol/USDT.json'
import { ethers } from 'ethers'
import { logOutWithCometChat } from './chat'

const { ethereum } = window
import addresses from '../abis-sepolia/contractAddress.json'

const DappWorksAddress = addresses.DappWorks
const DappWorksABI = DappWorksAbi.abi
const UsdtAddress = addresses.USDT
const UsdtABI = UsdtAbi.abi
let tx

const getUsdtBalance = async (account) => {
  if (!ethereum) return '0'
  try {
    const contract = await getUsdtContract()
    const bal = await contract.balanceOf(account)
    return fromWei(bal)
  } catch (err) {
    reportError(err)
    return '0'
  }
}

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

const getProvider = () => {
  if (ethereum) {
    return new ethers.providers.Web3Provider(ethereum)
  } else {
    return new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL)
  }
}

const getSigner = async () => {
  const provider = getProvider()
  const accounts = await provider.listAccounts()
  return accounts.length > 0 ? provider.getSigner() : null
}

const getDappWorksContract = async () => {
  const signer = await getSigner()
  return new ethers.Contract(DappWorksAddress, DappWorksABI, signer)
}

const isAdmin = async () => {
  try {
    const contract = await getDappWorksContract();
    const owner = await contract.owner();
    const connectedAccount = getGlobalState('connectedAccount');
    const isAdmin = owner.toLowerCase() === connectedAccount.toLowerCase();
    setGlobalState('isAdmin', isAdmin);
    return isAdmin;
  } catch (error) {
    reportError(error);
    return false;
  }
};

const getUsdtContract = async () => {
  const signer = await getSigner()
  return new ethers.Contract(UsdtAddress, UsdtABI, signer)
}

const isWalletConnected = async () => {
  try {
    if (!ethereum) {
      return Promise.reject(new Error('Metamask not installed'))
    }
    const accounts = await ethereum.request({ method: 'eth_accounts' })

    window.ethereum.on('chainChanged', () => window.location.reload())
    window.ethereum.on('accountsChanged', async () => {
      const acc = await ethereum.request({ method: 'eth_accounts' })
      setGlobalState('connectedAccount', acc[0])
      await loadData()
      await isWalletConnected()
      logOutWithCometChat()
    })

    if (accounts.length) {
      setGlobalState('connectedAccount', accounts[0])
    } else {
      setGlobalState('connectedAccount', '')
      console.log('No accounts found')
    }
    await loadData()
    await isAdmin()
  } catch (error) {
    reportError(error)
  }
}

const connectWallet = async () => {
  try {
    if (!ethereum) return alert('Please install Metamask')
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    setGlobalState('connectedAccount', accounts[0])
  } catch (error) {
    reportError(error)
  }
}

const addJobListing = async ({ jobTitle, description, tags, minBudget, maxBudget }) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getDappWorksContract()
      tx = await contract.addJobListing(jobTitle, description, tags, toWei(minBudget), toWei(maxBudget))
      await tx.wait()
      await loadData()
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const updateJob = async ({ id, jobTitle, description, tags, minBudget, maxBudget }) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getDappWorksContract()
      tx = await contract.updateJob(id, jobTitle, description, tags, toWei(minBudget), toWei(maxBudget))
      await tx.wait()
      await loadData()
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const deleteJob = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getDappWorksContract()
      tx = await contract.deleteJob(id)
      await tx.wait()
      await loadData()
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const bidForJob = async (id, amount) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getDappWorksContract()
      tx = await contract.bidForJob(id, toWei(amount))
      await tx.wait()
      await getJob(id)
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const approveUSDT = async (amount) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getUsdtContract()
      tx = await contract.approve(DappWorksAddress, toWei(amount))
      await tx.wait()
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const approveSpend = async (amount) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getUsdtContract()
      const dappworks_contract = await getDappWorksContract()
      tx = await contract.approve(dappworks_contract.address, toWei(amount))
      await tx.wait()
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const acceptBid = async (id, bidder) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getDappWorksContract()
      tx = await contract.acceptBid(id, bidder)
      await tx.wait()
      await getJob(id)
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const completeJob = async (id, githubUrl) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getDappWorksContract()
      tx = await contract.completeJob(id, githubUrl)
      await tx.wait()
      await getJob(id)
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const payout = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getDappWorksContract()
      tx = await contract.payout(id)
      await tx.wait()
      await getJob(id)
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const raiseDispute = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getDappWorksContract()
      tx = await contract.raiseDispute(id)
      await tx.wait()
      await getJob(id)
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const resolveDispute = async (id, percentage) => {
  if (!ethereum) return alert('Please install Metamask')
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getDappWorksContract()
      tx = await contract.resolveDispute(id, percentage)
      await tx.wait()
      await getJob(id)
      resolve(tx)
    } catch (err) {
      reportError(err)
      reject(err)
    }
  })
}

const getBidders = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getDappWorksContract()
    const bidders = await contract.getBidders(id)
    setGlobalState('bidders', structuredBidder(bidders))
  } catch (err) {
    reportError(err)
  }
}

const getJobs = async () => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getDappWorksContract()
    const jobs = await contract.getJobs()
    setGlobalState('jobs', structuredJobs(jobs))
  } catch (err) {
    reportError(err)
  }
}

const getMyJobs = async () => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getDappWorksContract()
    const jobs = await contract.getMyJobs()
    setGlobalState('myjobs', structuredJobs(jobs))
  } catch (err) {
    reportError(err)
  }
}

const getMyGigs = async () => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getDappWorksContract()
    const jobs = await contract.getAssignedJobs()
    setGlobalState('mygigs', structuredJobs(jobs))
  } catch (err) {
    reportError(err)
  }
}

const getMyBidJobs = async () => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getDappWorksContract()
    const jobs = await contract.getJobsForBidder()
    setGlobalState('mybidjobs', structuredJobs(jobs))
  } catch (err) {
    reportError(err)
  }
}

const getDisputedJobs = async () => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getDappWorksContract()
    const jobs = await contract.getDisputedJobs()
    setGlobalState('disputedJobs', structuredJobs(jobs))
  } catch (err) {
    reportError(err)
  }
}

const getJob = async (id) => {
  if (!ethereum) return alert('Please install Metamask')
  try {
    const contract = await getDappWorksContract()
    const job = await contract.getJob(id)
    setGlobalState('job', structuredJobs([job])[0])
  } catch (err) {
    reportError(err)
  }
}

const loadData = async () => {
  await getJobs()
  await getMyJobs()
  await getMyGigs()
  await getMyBidJobs()
  if (getGlobalState('isAdmin')) {
    await getDisputedJobs()
  }
}

const structuredJobs = (jobs) =>
  jobs
    .map((job) => ({
      id: job.id.toNumber(),
      owner: job.owner.toLowerCase(),
      freelancer: job.freelancer.toLowerCase(),
      jobTitle: job.jobTitle,
      description: job.description,
      tags: job.tags.split(','),
      minBudget: fromWei(job.minBudget),
      maxBudget: fromWei(job.maxBudget),
      finalBudget: fromWei(job.finalBudget),
      githubUrl: job.githubUrl,
      timestamp: new Date(job.timestamp.toNumber() * 1000).getTime(),
      state: job.state,
      completionPct: job.completionPct,
      bidders: job.bidders.map((address) => address.toLowerCase()),
    }))
    .sort((a, b) => b.timestamp - a.timestamp)

const structuredBidder = (bidders) =>
  bidders.map((bidder) => ({
    id: bidder.id.toNumber(),
    jId: bidder.jId.toNumber(),
    account: bidder.account.toLowerCase(),
    bidAmount: fromWei(bidder.bidAmount),
  }))

const reportError = (error) => {
  console.log(error)
}

export {
  connectWallet,
  isWalletConnected,
  addJobListing,
  updateJob,
  deleteJob,
  bidForJob,
  acceptBid,
  payout,
  getBidders,
  getJobs,
  getMyJobs,
  getJob,
  getMyBidJobs,
  getMyGigs,
  loadData,
  approveUSDT,
  completeJob,
  approveSpend,
  isAdmin,
  raiseDispute,
  resolveDispute,
  getDisputedJobs,
  getUsdtBalance
}
