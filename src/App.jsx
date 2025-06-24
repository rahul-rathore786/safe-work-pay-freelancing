import { Routes, Route } from 'react-router-dom'
import {
  Home,
  JobListing,
  MyProjects,
  Chats,
  ViewBidders,
  MyBids,
  MyJobs,
  RecentConversations,
  DisputedProjects,
} from './pages'
import { ToastContainer } from 'react-toastify'
import { useEffect } from 'react'
import { isWalletConnected } from './services/blockchain'
import AuthenticatedRoutes from './utils/AuthenticatedRoutes'
import Authenticate from './pages/Authenticate'
import { useGlobalState } from './store'
import { CreateJob, UpdateJob, CompleteJob, PlaceBid, RaiseDispute, ResolveDispute } from './components'

const App = () => {
  const [connectedAccount] = useGlobalState('connectedAccount')
  useEffect(() => {
    isWalletConnected()
  }, [connectedAccount])

  useEffect(() => {
    const handleAccountsChanged = () => {
      window.location.reload()
    }

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      }
    }
  }, [])

  return (
    <div className="min-h-screen font-[poppins]">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/joblisting/:id" element={<JobListing />} />
        <Route path="/myprojects" element={<MyProjects />} />
        <Route path="/viewbidders/:id" element={<ViewBidders />} />
        <Route path="/mybids" element={<MyBids />} />
        <Route path="/myjobs" element={<MyJobs />} />
        <Route path="/authenticate" element={<Authenticate />} />

        <Route element={<AuthenticatedRoutes />}>
          <Route path="/messages" element={<RecentConversations />} />
          <Route path="/chats/:id" element={<Chats />} />
        </Route>

        <Route path="/disputed-projects" element={<DisputedProjects />} />
      </Routes>

      <CreateJob />
      <UpdateJob />
      <CompleteJob />
      <PlaceBid />
      <RaiseDispute />
      <ResolveDispute />

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  )
}

export default App
