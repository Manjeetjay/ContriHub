const SESSION_STORAGE_KEY = 'contrihub.auth.session'

export function loadStoredSession() {
  try {
    const storedValue = window.localStorage.getItem(SESSION_STORAGE_KEY)
    return storedValue ? JSON.parse(storedValue) : null
  } catch {
    return null
  }
}

export function saveStoredSession(session) {
  if (!session) {
    window.localStorage.removeItem(SESSION_STORAGE_KEY)
    return
  }

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
}
