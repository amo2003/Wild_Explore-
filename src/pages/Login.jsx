import { useAuthContext } from '@asgardeo/auth-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { state, signIn } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (state.isAuthenticated) navigate('/dashboard', { replace: true })
  }, [state.isAuthenticated, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-800 to-green-600 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 w-full max-w-md text-center">
        <div className="text-6xl mb-4">🌿</div>
        <h1 className="text-2xl font-extrabold text-green-900 mb-1">WildExplore Admin</h1>
        <p className="text-gray-500 text-sm mb-8">
          Sign in with your WSO2 Asgardeo account to access the admin dashboard
        </p>

        <button
          onClick={() => signIn()}
          className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-base flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
          </svg>
          Sign in Admin
        </button>

        <p className="text-xs text-gray-400 mt-6">
          Powered by WSO2 Asgardeo · Secure OIDC Authentication
        </p>
      </div>
    </div>
  )
}
