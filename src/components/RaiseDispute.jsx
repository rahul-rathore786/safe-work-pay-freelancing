import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { raiseDispute } from '../services/blockchain'
import { useGlobalState, setGlobalState } from '../store'

const RaiseDispute = () => {
  const [raiseDisputeModal] = useGlobalState('raiseDisputeModal')
  const [job] = useGlobalState('job')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!job) return

    setLoading(true)
    await toast.promise(
      raiseDispute(job.id),
      {
        pending: 'Raising Dispute...',
        success: 'Dispute raised successfully, awaiting admin review 👌',
        error: 'Encountered error 🤯',
      }
    )
    setLoading(false)
    closeModal()
  }

  const closeModal = () => {
    setGlobalState('raiseDisputeModal', 'scale-0')
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center
      justify-center bg-black bg-opacity-50 transform
      transition-transform duration-300 ${raiseDisputeModal}`}
    >
      <div className="bg-white shadow-xl shadow-[#0c2856] rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="font-semibold">Raise a Dispute</p>
            <button
              type="button"
              className="border-0 bg-transparent focus:outline-none"
              onClick={closeModal}
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex justify-start items-center mt-5">
            <img
              src={job?.image || 'https://via.placeholder.com/50'}
              alt="job avatar"
              className="w-12 h-12 rounded-full"
            />
            <div className="ml-3">
                <h3 className="text-base font-semibold">{job?.jobTitle}</h3>
            </div>
          </div>

          <div
            className="flex flex-col justify-center items-center rounded-xl mt-5"
          >
            <p>Are you sure you want to raise a dispute for this project?</p>
            <small className="text-center text-red-500">
                This will lock the funds and notify the administrator to review the case. This action cannot be undone.
            </small>
          </div>

          <button
            type="submit"
            className="flex justify-center items-center text-white bg-red-500
            hover:bg-red-600 py-2 px-4 rounded-full mt-5 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm & Raise Dispute'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default RaiseDispute
