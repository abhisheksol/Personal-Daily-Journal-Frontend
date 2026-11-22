let accessToken = null
let refreshToken = null
try { refreshToken = sessionStorage.getItem('journal_refresh_token') } catch { /* Session storage can be unavailable in restricted browser contexts. */ }
export const tokenStore = {
  getAccess: () => accessToken,
  getRefresh: () => refreshToken,
  set: ({ access, refresh }) => {
    accessToken = access || null
    if (refresh) {
      refreshToken = refresh
      try { sessionStorage.setItem('journal_refresh_token', refresh) } catch { /* Keep the refresh token in memory for this page session. */ }
    }
  },
  clear: () => {
    accessToken = null
    refreshToken = null
    try { sessionStorage.removeItem('journal_refresh_token') } catch { /* Nothing to clear when storage is unavailable. */ }
  },
}
