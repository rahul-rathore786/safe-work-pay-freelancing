import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { bidForJob } from '../services/blockchain'
import { useGlobalState, setGlobalState } from '../store'

const PlaceBid = () => {
  const [placeBidModal] = useGlobalState('placeBidModal')
  const [jobListing] = useGlobalState('jobListing')
  const [amount, setAmount] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid bid amount.')
      return
    }

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await bidForJob(jobListing.id, amount)
          .then(() => {
            closeModal()
            resolve()
          })
          .catch(() => reject())
      }),
      {
        pending: 'Approving & Bidding...',
        success: 'Application successful 👌',
        error: 'Encountered error 🤯',
      },
    )
  }

  const closeModal = () => {
    setGlobalState('placeBidModal', 'scale-0')
    setAmount('')
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 transform transition-transform duration-300 ${placeBidModal}`}
    >
      <div className="bg-white shadow-xl shadow-black rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="font-semibold">Place Your Bid</p>
            <button
              type="button"
              className="border-0 bg-transparent focus:outline-none"
              onClick={closeModal}
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex justify-between items-center bg-gray-300 rounded-xl mt-5 p-2">
            <input
              className="block w-full text-sm resize-none text-slate-500 bg-transparent border-0 focus:outline-none focus:ring-0"
              type="number"
              step="0.01"
              min="0.01"
              name="amount"
              placeholder="Bid Amount (USDT)"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2.5 bg-green-500 text-white font-medium text-s leading-tight uppercase rounded-full shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out mt-5"
          >
            Submit Bid
          </button>
        </form>
      </div>
    </div>
  )
}

export default PlaceBid
