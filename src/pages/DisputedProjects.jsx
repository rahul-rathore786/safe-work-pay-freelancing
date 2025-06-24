import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalState, setGlobalState, truncate } from '../store'
import { getDisputedJobs } from '../services/blockchain'
import Header from '../components/Header'

const DisputedProjects = () => {
  const [isAdmin] = useGlobalState('isAdmin')
  const [disputedJobs] = useGlobalState('disputedJobs')
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAdmin) {
      navigate('/')
    } else {
      getDisputedJobs()
    }
  }, [isAdmin, navigate])

  const handleResolveClick = (job) => {
    setGlobalState('job', job)
    setGlobalState('resolveDisputeModal', 'scale-100')
  }

  const handleResolveDisputeClick = () => {
    window.open('http://localhost:3500/', '_blank')
  }


  return (
    <div className="">
      <Header />
      <button className="bg-blue-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full mx-auto block my-4" onClick={handleResolveDisputeClick}>Resolve Dispute By AI</button>

      <div className="w-4/5 mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Disputed Projects</h1>
      {disputedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {disputedJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-2">{job.jobTitle}</h2>
              <p className="text-gray-600 mb-2">Job Description: {job.description}</p>
              {job.githubUrl && (
                <p className="text-gray-600 mb-2">
                  Github:&nbsp;
                  <a
                    href={job.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {job.githubUrl}
                  </a>
                </p>
              )}
              <p className="text-gray-600 mb-2">Client: {truncate(job.owner,4,4,11)}</p>
              <p className="text-gray-600 mb-4">Freelancer: {truncate(job.freelancer,4,4,11)}</p>
              {job.tags && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.tags.map((tag,i)=>(
                    <span key={i} className="px-2 py-1 bg-gray-200 text-xs rounded-full">{tag}</span>
                  ))}
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">{job.finalBudget} USDT</span>
                <button
                  onClick={() => handleResolveClick(job)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full"
                >
                  Resolve
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No disputed projects at the moment.</p>
      )}
      </div>
    </div>
  )
}

export default DisputedProjects
