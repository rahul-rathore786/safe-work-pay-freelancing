import React, { useState } from 'react'
import { setGlobalState, useGlobalState } from '../store'
import { FaTimes } from 'react-icons/fa'
import { completeJob } from '../services/blockchain'
import { toast } from 'react-toastify'

const CompleteJob = () => {
  const [completeModal] = useGlobalState('completeModal')
  const [jobListing] = useGlobalState('jobListing')
  const [githubUrl, setGithubUrl] = useState('')

  const closeModal = () => {
    setGlobalState('completeModal', 'scale-0')
    setGithubUrl('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!githubUrl) return

    await toast.promise(
      new Promise(async (resolve, reject) => {
        await completeJob(jobListing.id, githubUrl)
          .then(async (tx) => {
            closeModal()
            resolve(tx)
          })
          .catch((err) => reject(err))
      }),
      {
        pending: 'Submitting project...',
        success: 'Project submitted successfully 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
    bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${completeModal}`}
    >
      <div className="bg-white text-black shadow-md shadow-green-500 rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <div className="relative">
          <button
            onClick={closeModal}
            className="border-0 bg-transparent focus:outline-none absolute -top-2 -right-2"
          >
            <FaTimes />
          </button>
          <div>
            <h3 className="text-xl mb-8">Complete Project</h3>
            <form className="" onSubmit={handleSubmit}>
              <div className="mb-5 flex flex-col space-y-1">
                <label htmlFor="githubUrl">GitHub URL</label>
                <input
                  id="githubUrl"
                  value={githubUrl}
                  placeholder="e.g. https://github.com/user/repo"
                  type="text"
                  className="rounded-md text-sm"
                  onChange={(e) => setGithubUrl(e.target.value)}
                  required
                />
              </div>
              <div>
                <button className="px-9 py-2 bg-green-500 text-white rounded-md">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompleteJob
