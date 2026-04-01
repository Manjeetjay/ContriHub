import { useEffect, useMemo, useRef, useState } from 'react'
import { FiGithub } from 'react-icons/fi'
import BackButton from '../components/BackButton.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { readGitHubCallback } from '../lib/github.js'

function GitHubCallbackPage({ onComplete }) {
  const { authenticateWithGitHub } = useAuth()
  const callback = useMemo(() => readGitHubCallback(), [])
  const hasStarted = useRef(false)
  const [status, setStatus] = useState(
    callback.error ? 'error' : callback.code ? 'loading' : 'error',
  )
  const [message, setMessage] = useState(
    callback.error
      ? 'GitHub sign-in was cancelled or denied.'
      : callback.code
        ? 'Completing GitHub sign-in...'
        : 'GitHub did not return an authorization code.',
  )

  useEffect(() => {
    if (callback.error || !callback.code) {
      return
    }

    // Prevent double-execution in React StrictMode —
    // GitHub authorization codes are single-use
    if (hasStarted.current) {
      return
    }
    hasStarted.current = true

    async function completeCallback() {
      try {
        await authenticateWithGitHub(callback.code)

        setStatus('success')
        setMessage('GitHub sign-in complete. Redirecting to your profile.')

        window.setTimeout(() => {
          if (onComplete) {
            onComplete()
          }
        }, 800)
      } catch (callbackError) {
        setStatus('error')
        setMessage(callbackError.message)
      }
    }

    completeCallback()
  }, [authenticateWithGitHub, callback.code, callback.error, onComplete])

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-4 text-slate-100">
      <section className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900/85 p-8 shadow-2xl shadow-black/30 backdrop-blur">
        <BackButton fallback="/login" />

        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-lg text-slate-100 ring-1 ring-white/10">
          <FiGithub />
        </span>
        <p className="mt-6 inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-200">
          GitHub
        </p>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {status === 'error' ? 'GitHub sign-in failed' : 'GitHub sign-in'}
        </h1>
        <p className="mt-4 text-sm leading-6 text-slate-400 sm:text-base">{message}</p>

      </section>
    </main>
  )
}

export default GitHubCallbackPage
