// App settings that are safe to ship to the browser.
// Nothing secret belongs here: this file ends up in the client bundle.
// (Secrets such as JWT_SECRET live only in the API's environment variables.)

export const Config = {
  // The browser calls this directly, so it is public anyway (visible in DevTools → Network).
  // To run against a local API, change it to e.g. 'http://localhost:3001'.
  apiHost: 'https://sleep-tracker-api.vercel.app',
} as const
