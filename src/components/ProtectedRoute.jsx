import { useAuthContext } from '@asgardeo/auth-react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const { state } = useAuthContext()

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center gap-3 text-green-700">
        <svg className="animate-spin w-7 h-7" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <span className="font-medium">Authenticating…</span>
      </div>
    )
  }

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
