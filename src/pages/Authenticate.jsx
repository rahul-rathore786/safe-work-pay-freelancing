import { toast } from 'react-toastify'
import { Header } from '../components'
import { loginWithCometChat, signUpWithCometChat } from '../services/chat'
import { setGlobalState, useGlobalState } from '../store'
import { useNavigate } from 'react-router-dom'

const Authenticate = () => {
  const [connectedAccount] = useGlobalState('connectedAccount')
  const navigate = useNavigate()

  // Return a user-friendly error message based on CometChat error codes
  const getAuthErrorMessage = (err) => {
    if (!err || typeof err !== 'object') return 'Unexpected error occurred. Please try again.'

    switch (err.code) {
      case 'ERR_UID_ALREADY_EXISTS':
        return 'User already exists. Please log in.'
      case 'ERR_UID_NOT_FOUND':
        return 'User not found. Please sign up first.'
      case 'MISSING_PARAMETERS':
        return 'No wallet connected. Please connect your wallet.'
      case 'INVALID_UID':
        return 'Invalid wallet address. Please connect a valid wallet.'
      default:
        return err.message || 'Unexpected error occurred. Please try again.'
    }
  }

  const handleSignUp = async () => {
    if (!connectedAccount) {
      toast.error('Please connect your wallet before signing up.')
      return
    }

    try {
      await toast.promise(
        signUpWithCometChat(connectedAccount),
        {
          pending: 'Signing up...',
          success: 'Signed up successfully, please login 👌',
          error: {
            render({ data }) {
              return getAuthErrorMessage(data)
            },
          },
        }
      )
    } catch (err) {
      // Error already handled by toast, but log for dev inspection
      console.log('Signup error:', err)
    }
  }

  const handleLogin = async () => {
    if (!connectedAccount) {
      toast.error('Please connect your wallet before logging in.')
      return
    }

    try {
      const user = await toast.promise(
        loginWithCometChat(connectedAccount),
        {
          pending: 'Logging in...',
          success: 'Logged in successfully 👌',
          error: {
            render({ data }) {
              return getAuthErrorMessage(data)
            },
          },
        }
      )

      // Only reached on success
      setGlobalState('currentUser', user)
      navigate('/messages')
    } catch (err) {
      // Error already shown via toast; log for dev insight
      console.log('Login error:', err)
    }
  }

  return (
    <>
      <Header />

      <div className="w-full sm:w-3/5 mx-auto mt-8 px-3">
        <h1 className="text-2xl font-bold text-center">Chats Authentication</h1>
        <p className="text-center">
          Login or sign up to chat with your client.
        </p>

        <div className="flex justify-center items-center space-x-3 mt-5">
          <button
            onClick={handleLogin}
            className="flex justify-center items-center space-x-1 py-1 px-5 rounded-full
          bg-blue-500 text-white max-sm:text-sm"
          >
            Login
          </button>
          <button
            onClick={handleSignUp}
            className="py-1 px-5 rounded-full bg-green-500 text-white max-sm:text-sm"
          >
            Sign up
          </button>
        </div>
      </div>
    </>
  )
}

export default Authenticate
