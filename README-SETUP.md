# BuyHub setup

## Private product manager
After deployment, open `/admin.html` to sign in, upload PDFs (up to 25 MB), set a USD price, publish, and delete products. The dashboard uses a private admin password and an HMAC session secret. Never commit secrets to GitHub or send them in chat.

## Required Netlify environment variables
Set these in Netlify Site configuration > Environment variables:
- `SITE_URL`: deployed Netlify URL, including https://
- `ADMIN_PASSWORD`: choose a strong, unique admin password
- `ADMIN_SESSION_SECRET`: long random secret (at least 32 random characters)
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`
- `NOWPAYMENTS_API_KEY`, `NOWPAYMENTS_IPN_SECRET` (only when ready to accept payments)

## Cloudflare R2
Create a private R2 bucket and API credentials. The credentials must permit uploading objects and reading/download signing for the bucket. Do not make the bucket public. The admin issues short-lived signed upload URLs; PDFs remain private and paid downloads are served with short-lived signed URLs.

## Deploy
After setting the environment variables, trigger a fresh deploy in Netlify. Visit `https://YOUR-SITE.netlify.app/admin.html` and sign in. Upload a PDF, enter its title, description and price, and publish.

## Important
This is a starter admin dashboard, not yet audited for production security. It does not currently support product image uploads, customer emails, refunds, or an order-management screen. Payment processing still requires NOWPayments credentials and a successful end-to-end test. Check current provider fees and free-tier limits before accepting orders.
