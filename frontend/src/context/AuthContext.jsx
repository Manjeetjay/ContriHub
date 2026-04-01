import { useEffect, useState } from 'react'
import { api, getErrorMessage } from '../lib/api.js'
import { loadStoredSession, saveStoredSession } from '../lib/storage.js'
import { AuthContext } from './auth-context.js'

function createSession(payload, provider, profile, authenticatedAt = new Date().toISOString()) {
  return {
    email: payload.email ?? '',
    role: payload.role ?? 'USER',
    token: payload.token ?? '',
    provider,
    authenticatedAt,
    profile,
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => loadStoredSession())
  const [isProfileLoading, setIsProfileLoading] = useState(false)

  useEffect(() => {
    saveStoredSession(session)
  }, [session])

  useEffect(() => {
    if (!session?.token || session.profile) {
      return
    }

    let isCancelled = false

    async function restoreProfile() {
      setIsProfileLoading(true)

      try {
        const profile = await fetchProfile(session.token)

        if (isCancelled) {
          return
        }

        setSession((currentSession) => {
          if (!currentSession) {
            return currentSession
          }

          return {
            ...currentSession,
            profile,
          }
        })
      } catch {
        if (isCancelled) {
          return
        }

        setSession(null)
      } finally {
        if (!isCancelled) {
          setIsProfileLoading(false)
        }
      }
    }

    restoreProfile()

    return () => {
      isCancelled = true
    }
  }, [session])

  async function fetchProfile(token) {
    try {
      const response = await api.get('/api/v1/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  async function finalizeAuthentication(payload, provider) {
    const profile = await fetchProfile(payload.token)
    const nextSession = createSession(payload, provider, profile)

    setSession(nextSession)

    return nextSession
  }

  async function register(formValues) {
    try {
      const response = await api.post('/api/v1/auth/register', formValues)
      return finalizeAuthentication(response.data, 'password')
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  async function login(formValues) {
    try {
      const response = await api.post('/api/v1/auth/login', formValues)
      return finalizeAuthentication(response.data, 'password')
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  async function authenticateWithGitHub(code) {
    try {
      const response = await api.post('/api/v1/auth/github', { code })
      return finalizeAuthentication(response.data, 'github')
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  }

  async function refreshProfile() {
    if (!session?.token) {
      return null
    }

    setIsProfileLoading(true)

    try {
      const profile = await fetchProfile(session.token)

      setSession((currentSession) => {
        if (!currentSession) {
          return currentSession
        }

        return {
          ...currentSession,
          profile,
        }
      })

      return profile
    } catch (error) {
      throw new Error(error.message)
    } finally {
      setIsProfileLoading(false)
    }
  }

  function logout() {
    setSession(null)
  }

  const value = {
    session,
    isAuthenticated: Boolean(session),
    isProfileLoading,
    register,
    login,
    authenticateWithGitHub,
    refreshProfile,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
