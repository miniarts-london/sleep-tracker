// Login token storage. localStorage only exists in the browser, so these
// return null / do nothing on the server, and every access is wrapped in
// try/catch because storage can be blocked (private mode, site data off).

const TOKEN_KEY = 'auth_token'
const EXPIRES_KEY = 'auth_expires_at'
const PROFILE_KEY = 'auth_profile'

// The logged-in user's registered names, from the login response.
export type Profile = { firstName: string; lastName: string }

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const expiresAt = Number(localStorage.getItem(EXPIRES_KEY))
    // Drop a token we already know has expired instead of sending it and getting a 401.
    if (!token || (expiresAt && Date.now() >= expiresAt)) {
      clearToken()
      return null
    }
    return token
  } catch {
    return null
  }
}

// expiresInSeconds comes from the login response's expires_in.
export function setToken(token: string, expiresInSeconds?: number, profile?: Profile) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
    if (expiresInSeconds) {
      localStorage.setItem(EXPIRES_KEY, String(Date.now() + expiresInSeconds * 1000))
    } else {
      localStorage.removeItem(EXPIRES_KEY)
    }
    if (profile) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
    } else {
      localStorage.removeItem(PROFILE_KEY)
    }
  } catch {
    // Storage unavailable: the user will just be sent back to /login.
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EXPIRES_KEY)
    localStorage.removeItem(PROFILE_KEY)
  } catch {
    // nothing to clear
  }
}

// Null when logged out, or logged in before names were stored.
export function getProfile(): Profile | null {
  if (!getToken()) return null
  try {
    const parsed = JSON.parse(localStorage.getItem(PROFILE_KEY) ?? 'null')
    if (typeof parsed?.firstName === 'string' && typeof parsed?.lastName === 'string') {
      return parsed
    }
  } catch {
    // missing or corrupt: treat as no profile
  }
  return null
}

export function isLoggedIn(): boolean {
  return getToken() !== null
}
