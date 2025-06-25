import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { resolveDispute } from '../services/blockchain'
import { useGlobalState, setGlobalState } from '../store'

const ResolveDispute = () => {
  const [resolveDisputeModal] = useGlobalState('resolveDisputeModal')
  const [job] = useGlobalState('job')
  const [completionPct, setCompletionPct] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!job || !completionPct || completionPct < 0 || completionPct > 100) {
      toast.error('Please enter a valid percentage (0-100).')
      return
    }

    setLoading(true)
    await toast.promise(
      resolveDispute(job.id, completionPct),
      {
        pending: 'Resolving Dispute...',
        success: 'Dispute resolved and funds distributed successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
    setLoading(false)
    closeModal()
  }

  const closeModal = () => {
    setGlobalState('resolveDisputeModal', 'scale-0')
    setCompletionPct('')
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center
      justify-center bg-black bg-opacity-50 transform
      transition-transform duration-300 ${resolveDisputeModal}`}
    >
      <div className="bg-white shadow-xl shadow-[#0c2856] rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="font-semibold">Resolve Dispute</p>
            <button
              type="button"
              className="border-0 bg-transparent focus:outline-none"
              onClick={closeModal}
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex justify-start items-center mt-5">
            <div className="ml-3">
                <h3 className="text-base font-semibold">{job?.jobTitle}</h3>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center rounded-xl mt-5">
            <p>Enter the completion percentage (0-100) for the freelancer.</p>
            <input
              type="number"
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none focus:ring focus:ring-opacity-40"
              placeholder="e.g. 75"
              min="0"
              max="100"
              value={completionPct}
              onChange={(e) => setCompletionPct(e.target.value)}
              required
            />
            <small className="text-center text-gray-500 mt-2">
                The remaining funds will be returned to the client. Platform fees will be deducted from the total amount.
            </small>
          </div>

          <button
            type="submit"
            className="flex justify-center items-center text-white bg-green-500
            hover:bg-green-600 py-2 px-4 rounded-full mt-5 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Resolve & Distribute Funds'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResolveDispute
