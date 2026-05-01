import type { StoredSession } from '../types'

export function getStoredSession(): StoredSession | null {
  const rawSession = localStorage.getItem('vetprime.session') || sessionStorage.getItem('vetprime.session')

  if (!rawSession) {
    return null
  }

  const session = JSON.parse(rawSession) as StoredSession

  if (new Date(session.expiresAt) <= new Date()) {
    clearStoredSession()
    return null
  }

  return session
}

export function saveStoredSession(session: StoredSession, remember: boolean) {
  const storage = remember ? localStorage : sessionStorage

  clearStoredSession()
  storage.setItem('vetprime.session', JSON.stringify(session))
}

export function clearStoredSession() {
  localStorage.removeItem('vetprime.session')
  sessionStorage.removeItem('vetprime.session')
}
