import { useState } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import GuestRoute from './components/GuestRoute.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { hasGitHubCallback } from './lib/github.js'
import GitHubCallbackPage from './pages/GitHubCallbackPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SignupPage from './pages/SignupPage.jsx'

function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route
          element={<Navigate replace to="/login" />}
          path="/"
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <SignupPage />
            </GuestRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={<Navigate replace to="/profile" />}
        />
        <Route
          element={<Navigate replace to="/login" />}
          path="*"
        />
      </Routes>
    </HashRouter>
  )
}

function App() {
  const [isGitHubCallback, setIsGitHubCallback] = useState(() => hasGitHubCallback())

  function handleCallbackComplete() {
    // Clean the ?code=xxx query params from the URL without reloading
    const cleanUrl = `${window.location.origin}${window.location.pathname}#/profile`
    window.history.replaceState(null, '', cleanUrl)
    // Now flip the state so React shows AppRoutes instead of the callback page
    setIsGitHubCallback(false)
  }

  return (
    <AuthProvider>
      {isGitHubCallback
        ? <GitHubCallbackPage onComplete={handleCallbackComplete} />
        : <AppRoutes />}
    </AuthProvider>
  )
}

export default App
