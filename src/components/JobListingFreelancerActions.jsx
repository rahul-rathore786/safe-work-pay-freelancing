import React from 'react'
import { FaMoneyBill } from 'react-icons/fa'
import { setGlobalState } from '../store'
import { Link } from 'react-router-dom'

const JobListingFreelancerActions = ({ jobListing }) => {
  const openCompleteModal = () => {
    setGlobalState('completeModal', 'scale-100')
    setGlobalState('jobListing', jobListing)
  }

  const openDisputeModal = () => {
    setGlobalState('raiseDisputeModal', 'scale-100')
    setGlobalState('job', jobListing)
  }

  return (
    <div className="border-t border-b border-l border-r border-gray-300 py-3 px-5 mt-2">
      <h4>{jobListing.jobTitle}</h4>
      <div className="flex mt-2 items-center">
        <FaMoneyBill className="text-md cursor-pointer" />
        <span className="text-md">${jobListing.finalBudget}</span>
      </div>
      <div className="flex items-center mt-3 text-sm flex-wrap gap-3">
        {jobListing.tags.length > 0
          ? jobListing.tags.map((tag, i) => (
              <button key={i} className="px-4 py-1 bg-gray-200 rounded-lg mr-2">
                {tag}
              </button>
            ))
          : null}
      </div>
      <p className="pr-7 mt-5 text-sm">{jobListing.description}</p>
      <div className="flex flex-col mt-5 space-y-3">
        {jobListing.state === 1 && ( // InProgress
          <div className="flex space-x-3">
            <button
              onClick={openCompleteModal}
              className="flex items-center px-3 py-1 border-[1px] border-green-500 text-green-500 space-x-2 rounded-md"
            >
              <span className="text-sm">Complete Job</span>
            </button>
            <Link
              to={`/chats/${jobListing.owner}`}
              className="flex items-center px-3 py-1 border-[1px] border-green-500 text-green-500 space-x-2 rounded-md"
            >
              <span className="text-sm">Chat with client</span>
            </Link>
          </div>
        )}
        {jobListing.state === 2 && ( // Completed
          <div className="flex flex-col items-start space-y-2">
            <p className="text-sm text-gray-500">Project submitted. Waiting for client to release payment.</p>
            <Link
              to={`/chats/${jobListing.owner}`}
              className="flex items-center px-3 py-1 border-[1px] border-green-500 text-green-500 space-x-2 rounded-md"
            >
              <span className="text-sm">Chat with client</span>
            </Link>
            <button
              onClick={openDisputeModal}
              className="flex items-center px-3 py-1 border-[1px] border-red-500 text-red-500 space-x-2 rounded-md"
            >
              <span className="text-sm">Raise Dispute</span>
            </button>
          </div>
        )}
        {jobListing.state === 3 && ( // Disputed
          <p className="text-sm text-orange-500 font-semibold">
            This project is in dispute. An admin will review the case.
          </p>
        )}
        {jobListing.state === 4 && ( // Resolved
          <p className="text-sm text-green-600 font-semibold">
            Project completed! Funds paid based on dispute resolution. 🎉
          </p>
        )}
      </div>
    </div>
  )
}

export default JobListingFreelancerActions
