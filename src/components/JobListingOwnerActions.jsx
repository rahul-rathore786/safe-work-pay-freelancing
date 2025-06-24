import React, { useEffect } from 'react'
import {
  FaEthereum,
  FaPenAlt,
  FaTrashAlt,
  FaMoneyBill,
  FaArrowRight,
} from 'react-icons/fa'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { setGlobalState } from '../store'
import { Link, useNavigate } from 'react-router-dom'


const JobListingOwnerActions = ({ jobListing, editable }) => {

  const navigate = useNavigate()

  const openUpdateModal = () => {
    setGlobalState('updateModal', 'scale-100')
    setGlobalState('jobListing', jobListing)
  }

  const openPayoutModal = () => {
    setGlobalState('payoutModal', 'scale-100')
    setGlobalState('jobListing', jobListing)
  }

  const openDeleteModal = () => {
    setGlobalState('deleteModal', 'scale-100')
    setGlobalState('jobListing', jobListing)
  }

  const openDisputeModal = () => {
    setGlobalState('raiseDisputeModal', 'scale-100');
    setGlobalState('job', jobListing);
  };

  const viewBidders = (id) => {
    navigate(`/viewbidders/${id}`)
  }

  return (
    <div className="border-t border-b border-l border-r border-gray-300 py-3 px-5 mt-2">
      <h4>{jobListing.jobTitle}</h4>
      <div className="flex mt-2 items-center">
        <FaMoneyBill className="text-md cursor-pointer" />
        <span className="text-md">${jobListing.minBudget} - ${jobListing.maxBudget}</span>
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
      {(jobListing.state >= 2) && jobListing.githubUrl && ( // Completed, Disputed, or Resolved
        <div className="mt-4">
          <h5 className="font-semibold">Submitted Work</h5>
          <a href={jobListing.githubUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
            {jobListing.githubUrl}
          </a>
        </div>
      )}
      <div className="flex flex-col mt-5 space-y-3">
        {editable && (
            <>
                {jobListing.state === 0 && ( // Open
                    <div className="flex mt-5 space-x-3">
                        <button
                            onClick={openUpdateModal}
                            className="flex items-center px-3 py-1 border-[1px] border-green-500 text-green-500 space-x-2 rounded-md"
                        >
                            <FaPenAlt />
                            <span className="text-sm">Update</span>
                        </button>
                        <button
                            onClick={openDeleteModal}
                            className="flex items-center px-2 py-1 border-[1px] border-red-500 text-red-500 space-x-2 rounded-md text-sm"
                        >
                            <FaTrashAlt />
                            <span className="text-sm">Delete</span>
                        </button>
                        <button
                            className="text-sm py-1 px-3 bg-green-400 text-white flex items-center space-x-3 rounded-md"
                            onClick={() => viewBidders(jobListing.id)}
                        >
                            <span>View bidders</span>
                            <FaArrowRight className="-rotate-45" />
                        </button>
                    </div>
                )}

                {jobListing.state === 1 && ( // InProgress
                    <div className="flex mt-5 space-x-3">
                        <Link
                            to={`/chats/${jobListing.freelancer}`}
                            className="flex items-center px-3 py-1 border-[1px] border-green-500 text-green-500 space-x-2 rounded-md"
                        >
                            <span className="text-sm">Chat with freelancer</span>
                        </Link>
                    </div>
                )}

                {jobListing.state === 2 && ( // Completed
                    <div className="flex mt-5 space-x-3">
                        <button
                            onClick={openPayoutModal}
                            className="flex items-center px-3 py-1 border-[1px] border-sky-500 text-sky-500 space-x-2 rounded-md"
                        >
                            <FaMoneyBill />
                            <span className="text-sm">Pay Freelancer</span>
                        </button>
                        <Link
                            to={`/chats/${jobListing.freelancer}`}
                            className="flex items-center px-3 py-1 border-[1px] border-green-500 text-green-500 space-x-2 rounded-md"
                        >
                            <span className="text-sm">Chat with freelancer</span>
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
                        This project is in dispute. An admin is reviewing the case. You will be notified of the outcome.
                    </p>
                )}

                {jobListing.state === 4 && ( // Resolved
                    <div className="">
                        <button className="text-sm px-2 py-1 text-green-600 mt-3 flex items-center space-x-1 cursor-default">
                            <span>Project Resolved & Paid</span>
                            <IoMdCheckmarkCircleOutline />
                        </button>
                    </div>
                )}
            </>
        )}
    </div>
    </div>
  )
}

export default JobListingOwnerActions
