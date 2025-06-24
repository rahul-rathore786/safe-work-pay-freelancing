import React from 'react'
import { Link } from 'react-router-dom'
import { connectWallet, getUsdtBalance } from '../services/blockchain'
import { truncate, useGlobalState } from '../store'
import {useEffect, useState} from 'react'

const MobileHeader = ({ toggle }) => {
  const [connectedAccount] = useGlobalState('connectedAccount')
  const [isAdmin] = useGlobalState('isAdmin')
  const [balance, setBalance] = useState('')

  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await getUsdtBalance(connectedAccount)
      setBalance(balance)
    }
    fetchBalance()
  }, [connectedAccount])

  return (
    <section
      className={`md:hidden block absolute top-5 right-0 py-3 px-4 bg-white shadow-lg rounded-md ${
        toggle ? 'visible' : 'invisible'
      }`}
    >
      <div className="flex flex-col space-y-3">
        <Link to={'/mybids'} className="text-gray-600">
          My Bids
        </Link>
        <Link to={'/myjobs'} className="text-gray-600">
          My Jobs
        </Link>
        <Link to={'/myprojects'} className="text-gray-600">
          My Projects
        </Link>
        <Link to={'/messages'} className="text-gray-600">
          Messages
        </Link>

        {isAdmin && (
          <Link to={'/disputed-projects'} className="text-red-600 font-semibold">
            Disputed Projects
          </Link>
        )}

        {connectedAccount ? (
          <div className="flex items-center space-x-5 text-gray-600">
          <button className="bg-green-500 text-white py-1 px-5 rounded-sm">
            {truncate(connectedAccount, 4, 4, 11)}
          </button>
          {/* show balance from new line */}
          <p className="text-gray-600">Balance:</p>
          <button className="bg-green-500 text-white py-1 px-5 rounded-sm">
            {balance} USDT
          </button>
          </div>
        ) : (
          <button
            className="bg-green-500 text-white py-1 px-5 rounded-full"
            onClick={connectWallet}
          >
            connect wallet
          </button>
        )}
      </div>
    </section>
  )
}

export default MobileHeader
