import { AuthProvider } from '@asgardeo/auth-react'

const config = {
  clientID:           import.meta.env.VITE_ASGARDEO_CLIENT_ID,
  baseUrl:            import.meta.env.VITE_ASGARDEO_BASE_URL,
  signInRedirectURL:  import.meta.env.VITE_ASGARDEO_SIGNIN_REDIRECT  || window.location.origin,
  signOutRedirectURL: import.meta.env.VITE_ASGARDEO_SIGNOUT_REDIRECT || window.location.origin,
  scope: ['openid', 'profile', 'email'],
}

export function AsgardeoProvider({ children }) {
  return <AuthProvider config={config}>{children}</AuthProvider>
}
