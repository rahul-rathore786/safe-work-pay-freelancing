import React, { useState } from 'react'
import { truncate } from '../store'
import { approveSpend, acceptBid, getUsdtBalance } from '../services/blockchain'
import { toast } from 'react-toastify'
import { MdOutlineChat } from 'react-icons/md'
import { Link } from 'react-router-dom'

import { useGlobalState } from '../store'

const ApplicantsCard = ({ bidder }) => {
  const [connectedAccount] = useGlobalState('connectedAccount')
  const [isApproving, setIsApproving] = useState(false)
  const [isApproved, setIsApproved] = useState(false)
  const [isAccepting, setIsAccepting] = useState(false)

  const handleApprove = async (amount) => {
    setIsApproving(true)
    await toast.promise(
      approveSpend(amount),
      {
        pending: 'Approving spend...',
        success: 'Approval successful! You can now accept the bid. 👌',
        error: 'Encountered error during approval 🤯',
      }
    )
    setIsApproved(true)
    setIsApproving(false)
  }

  const handleAccept = async (jid, account) => {
    const balance = await getUsdtBalance(connectedAccount)
    if (parseFloat(balance) < parseFloat(bidder.bidAmount)) {
      return toast.error('Insufficient USDT balance to accept this bid')
    }
    setIsAccepting(true)
    await toast.promise(
      acceptBid(jid, account),
      {
        pending: 'Accepting bid...',
        success: 'Bid accepted successfully! The project has started. 🎉',
        error: 'Encountered error while accepting bid 🤯',
      }
    )
    setIsAccepting(false)
  }

  return (
    <div
      className="my-3 bg-white shadow-lg p-3 rounded-lg flex justify-between
    items-center border-[1px] border-gray-300 flex-wrap"
    >
      <div>
        <h4>{truncate(bidder.account, 4, 4, 11)}</h4>
        <p className="text-sm text-gray-500">Bid: ${bidder.bidAmount}</p>
      </div>
      <div className="flex items-center space-x-3">
        <Link
          to={`/chats/${bidder.account}`}
          className="flex justify-center items-center space-x-1 py-1 px-5 rounded-full
          bg-blue-500 text-white max-sm:text-sm"
        >
          <MdOutlineChat size={20} />
          <span>Chat</span>
        </Link>
        
        {!isApproved ? (
            <button
              onClick={() => handleApprove(bidder.bidAmount)}
              className="py-1 px-5 rounded-full bg-yellow-500 text-white max-sm:text-sm disabled:bg-gray-400"
              disabled={isApproving}
            >
              {isApproving ? 'Approving...' : 'Approve'}
            </button>
        ) : (
            <button
              onClick={() => handleAccept(bidder.jId, bidder.account)}
              className="py-1 px-5 rounded-full bg-green-500 text-white max-sm:text-sm disabled:bg-gray-400"
              disabled={isAccepting}
            >
              {isAccepting ? 'Accepting...' : 'Accept Bid'}
            </button>
        )}
      </div>
    </div>
  )
}

export default ApplicantsCard
