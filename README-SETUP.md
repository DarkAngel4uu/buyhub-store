# BuyHub setup

## Private product manager
Open `/admin.html` after deployment. Sign in, choose a PDF up to 4 MB, enter its title, description and USD price, and publish. You can delete products from the dashboard. PDFs are stored privately in Netlify Blobs; Cloudflare R2 is not required.

## Required Netlify environment variables
In Netlify > your BuyHub site > Site configuration > Environment variables, add:
- `ADMIN_PASSWORD`: a strong, unique admin password
- `ADMIN_SESSION_SECRET`: a long random secret (at least 32 random characters)
- `SITE_URL`: your deployed site URL including https:// (needed for payments)
- `NOWPAYMENTS_API_KEY` and `NOWPAYMENTS_IPN_SECRET`: only when ready to accept payments

Never commit secrets to GitHub or send them in chat. Enter them only in Netlify's environment variable settings.

## PDF storage
The admin upload function stores PDFs in the private `buyhub-pdfs` Netlify Blobs store. The download function serves a file only after the matching order is marked paid. Netlify Functions have a buffered request limit; the dashboard therefore limits uploads to 4 MB. Netlify's free plan has a monthly usage-credit limit, and downloads count toward bandwidth usage. Check your Netlify usage page regularly.

## Deploy and configure
After the GitHub changes deploy, open `https://YOUR-SITE.netlify.app/admin.html`. Add the two admin environment variables above, then trigger a fresh deploy so the functions receive them. Sign in and publish a small test PDF.

## Important
The dashboard is a starter implementation and has not had an independent security audit. Payment processing still requires NOWPayments credentials and a successful end-to-end test. No customer email, refunds, or order-management screen is included. Check current provider fees and Netlify free-plan limits before accepting orders.
