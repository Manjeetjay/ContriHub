const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID ?? ''
const GITHUB_REDIRECT_URI = (import.meta.env.VITE_GITHUB_REDIRECT_URI ?? '').replace(/\/+$/, '')
const GITHUB_SCOPE = 'read:user user:email'

export function isGitHubOAuthConfigured() {
  return Boolean(GITHUB_CLIENT_ID)
}

export function buildGitHubOAuthUrl() {
  if (!isGitHubOAuthConfigured()) {
    return null
  }

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    scope: GITHUB_SCOPE,
  })

  if (GITHUB_REDIRECT_URI) {
    params.set('redirect_uri', GITHUB_REDIRECT_URI)
  }

  return `https://github.com/login/oauth/authorize?${params.toString()}`
}

export function startGitHubOAuth() {
  const url = buildGitHubOAuthUrl()

  if (!url) {
    return false
  }

  window.location.assign(url)
  return true
}

export function hasGitHubCallback() {
  if (typeof window === 'undefined') {
    return false
  }

  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.has('code') || searchParams.has('error')
}

export function readGitHubCallback() {
  const searchParams = new URLSearchParams(window.location.search)

  return {
    code: searchParams.get('code'),
    error: searchParams.get('error'),
  }
}

export function finishGitHubCallback(targetHash = '#/dashboard') {
  window.location.replace(`${window.location.origin}/${targetHash}`)
}
