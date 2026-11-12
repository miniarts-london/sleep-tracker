import { clearToken, getToken, type Profile } from './auth'
import type { EntryDetail } from '../models/assets'
import { Config } from '../config'

const host = Config.apiHost.replace(/\/+$/, '')

export const LOGIN_PATH = '/login'

// Thrown after a 401 on an authenticated request, once the redirect to /login has started.
// Callers can ignore it: the page is about to change.
export class UnauthorizedError extends Error {
  constructor() {
    super('Not logged in')
    this.name = 'UnauthorizedError'
  }
}

export function redirectToLogin() {
  clearToken()
  if (typeof window !== 'undefined' && window.location.pathname !== LOGIN_PATH) {
    window.location.assign(LOGIN_PATH)
  }
}

type ApiFetchOptions = {
  method?: 'GET' | 'POST'
  body?: unknown
  // false for login/register: no token is sent, and a 401 there means
  // "wrong username or password", not "session expired".
  auth?: boolean
}

// The one place that talks to the API. Adds the JSON headers and the
// Bearer token, and sends the user to /login when the token is missing or rejected.
export async function apiFetch(path: string, { method = 'GET', body, auth = true }: ApiFetchOptions = {}) {
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  if (auth) {
    const token = getToken()
    if (!token) {
      redirectToLogin()
      throw new UnauthorizedError()
    }
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${host}${path}`, {
    method,
    headers,
    cache: 'no-store',
    body: body === undefined ? undefined : JSON.stringify(body),
  }).catch((err) => {
    console.log(`Failed ${method} '${path}'`)
    throw err
  })

  if (auth && res.status === 401) {
    redirectToLogin()
    throw new UnauthorizedError()
  }

  return res
}

// ---------- entries ----------

export async function getAssetDetails(id: string): Promise<EntryDetail[]> {
  const res = await apiFetch(`/api/users/${encodeURIComponent(id)}/entries`)

  if (res.status === 403) {
    throw new Error('You can only view your own entries')
  }
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export async function fetchAssetListFromAPI(): Promise<EntryDetail[]> {
  const res = await apiFetch('/api/entries')

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export async function addNewData(data: unknown) {
  const res = await apiFetch('/api/entries', { method: 'POST', body: data })
  return res.json()
}

// ---------- auth ----------

export type FieldError = { fieldName: string; message: string }

// Same { success, details } shape the API uses for entries.
export type RegisterResponse =
  | { success: true; details: null }
  | { success: false; details: FieldError[] | null }

export async function registerUser(data: {
  username: string
  password: string
  first_name: string
  last_name: string
}): Promise<RegisterResponse> {
  const res = await apiFetch('/api/auth/register', { method: 'POST', body: data, auth: false })
  const json = await res.json().catch(() => null)
  if (json && typeof json.success === 'boolean') return json
  return { success: false, details: null }
}

export type LoginResult =
  | { ok: true; token: string; expiresIn: number; profile?: Profile }
  | { ok: false; error: string; details?: FieldError[] }

export async function loginUser(data: { username: string; password: string }): Promise<LoginResult> {
  const res = await apiFetch('/api/auth/login', { method: 'POST', body: data, auth: false })
  const json = await res.json().catch(() => null)

  if (res.ok && json?.token) {
    const profile =
      typeof json.first_name === 'string' && typeof json.last_name === 'string'
        ? { firstName: json.first_name, lastName: json.last_name }
        : undefined
    return { ok: true, token: json.token, expiresIn: json.expires_in, profile }
  }
  // 401 → { error }, 400 → { success: false, details }
  return {
    ok: false,
    error: json?.error ?? 'Login failed',
    details: Array.isArray(json?.details) ? json.details : undefined,
  }
}
