import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { connectWallet, getUsdtBalance } from '../services/blockchain'
import { truncate, useGlobalState } from '../store'
import { BsList, BsX } from 'react-icons/bs'
import MobileHeader from './MobileHeader'
import { useEffect } from 'react'

const Header = () => {
  const [connectedAccount] = useGlobalState('connectedAccount')
  const [isAdmin] = useGlobalState('isAdmin')
  const [isOpen, setIsOpen] = useState(false)
  const [balance, setBalance] = useState('')
  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await getUsdtBalance(connectedAccount)
      setBalance(balance)
    }
    fetchBalance()
  }, [connectedAccount])

  return (
    <header className="bg-white w-full mx-auto p-5 flex justify-between items-center flex-wrap shadow-md">
      <Link className="text-green-600 font-[risque] text-2xl" to={'/'}>
        SafeWorkPay
      </Link>
      <div className="items-center space-x-5 md:block hidden">
        <Link to={'/'} className="text-gray-600">
          Home
        </Link>
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
          // make div margin from the top
          <div className="flex items-left space-x-5 text-gray-600 mt-3">
          <p className="text-gray-600">Connected Account:</p>
          <button className="bg-green-500 text-white py-1 px-5 rounded-full">

             {truncate(connectedAccount, 4, 4, 11)}
          </button>
          <p className="text-gray-600">Balance:</p>
          <button className="bg-green-500 text-white py-1 px-5 rounded-full">
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

      <div className="md:hidden block relative" onClick={handleToggle}>
        {!isOpen ? (
          <BsList className="text-2xl cursor-pointer" />
        ) : (
          <BsX className="text-2xl cursor-pointer" />
        )}
        <MobileHeader toggle={isOpen} />
      </div>
    </header>
  )
}

export default Header
