# Deployment Checklist

## GitHub Preparation
- [x] All build-blocking type errors resolved (e.g., `join` import).
- [x] `@vercel/blob` stream optimization implemented in `actions.ts`.
- [x] Server Actions body size limit increased to 10MB in `next.config.mjs`.
- [x] Authentication logic updated to support `callbackUrl` redirects.
- [x] `.env.example` file created with latest requirements.
- [ ] Push all local changes to the `main` branch.

## Vercel Project Settings
### 1. Repository
- Ensure the project is linked to `AyseArucu/stl-pdf-remove`.
- Set **Root Directory** to `ecommerce-platform`.

### 2. Environment Variables
- Add the following keys in the Vercel Dashboard:
  - `DATABASE_URL` (Your production DB URL)
  - `PRISMA_FIELD_ENCRYPTION_KEY`
  - `BLOB_READ_WRITE_TOKEN`
  - `NEXTAUTH_SECRET`
  - `NEXT_PUBLIC_SITE_URL`
  - `RESEND_API_KEY`

### 3. Build & Deployment
- Check that the framework preset is set to **Next.js**.
- Trigger a new deployment from the `main` branch.

## Post-Deployment Verification
- [ ] Test STL file upload (>5MB).
- [ ] Test user login and verify automatic redirect.
- [ ] Verify PDF tool functionality.
