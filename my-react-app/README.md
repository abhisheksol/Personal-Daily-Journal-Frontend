# Daily Journal frontend

A responsive React/Vite frontend for the Daily Journal Django API.

## Run locally

```bash
npm install
npm run dev
```

The frontend reads `VITE_API_BASE_URL` from `.env`. Never put credentials or Django secrets in Vite environment variables.

## Backend contract and assumptions

- The API root defaults to `http://localhost:8000`.
- JWT login and refresh use `/api/token/` and `/api/token/refresh/`.
- Registration sends `username`, `first_name`, `email`, and `password`. Adjust `src/api/authApi.js` if the serializer differs.
- Journal lists may be arrays or DRF paginated objects. `journalApi.listAll()` follows every `next` page so analytics stay complete.
- Journal IDs are treated as opaque URL-safe values, so integers and UUIDs both work.
- The initial mood values sent to Django are `Bad`, `Okay`, `Good`, and `Great`. They must match the serializer choices exactly.
- Access tokens remain in memory. A JSON refresh token is kept in `sessionStorage` so the tab can restore a session. For production, prefer a backend-issued Secure, HttpOnly refresh cookie.
- Logout clears browser-held credentials. It cannot revoke an issued token unless Django exposes a blacklist/revocation endpoint.

## Django CORS

Allow the Vite origin in Django, for example with `django-cors-headers`:

```python
INSTALLED_APPS = [
    # ...
    "corsheaders",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    # ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

Use the production frontend origin in deployment. Do not disable browser CORS protections.

## Verification

```bash
npm run lint
npm run build
```
