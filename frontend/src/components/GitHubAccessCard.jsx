import { useState } from 'react'
import { FiGithub } from 'react-icons/fi'
import { isGitHubOAuthConfigured, startGitHubOAuth } from '../lib/github.js'

function GitHubAccessCard({ buttonLabel = 'Continue with GitHub' }) {
  const [error, setError] = useState('')
  const oauthConfigured = isGitHubOAuthConfigured()

  function handleOAuthStart() {
    setError('')

    if (!oauthConfigured) {
      setError('GitHub OAuth is not configured yet. Add VITE_GITHUB_CLIENT_ID and VITE_GITHUB_REDIRECT_URI.')
      return
    }

    startGitHubOAuth()
  }

  return (
    <section className="mt-6 border-t border-white/10 pt-6">
      <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
        Or
      </p>

      <button
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
        onClick={handleOAuthStart}
        type="button"
      >
        <FiGithub />
        {buttonLabel}
      </button>

      {error ? (
        <p className="mt-4 text-sm leading-6 text-rose-400">
          {error}
        </p>
      ) : null}
    </section>
  )
}

export default GitHubAccessCard
