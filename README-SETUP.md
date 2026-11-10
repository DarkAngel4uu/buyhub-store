# BuyHub setup

This repository is the BuyHub storefront starter. It is not ready to accept payments until the setup below is completed.

## 1. Add products
Add each product to `assets/products.js` and to the `products` allowlist in `netlify/functions/create-payment.mjs`. Each entry needs a matching unique `id`, product name, USD price and private Cloudflare R2 object key (`r2Key` in the function). Keep the PDF private; do not place paid PDFs in the public site folder.

## 2. Cloudflare R2
Create a private R2 bucket, upload your PDF files, and create R2 API credentials with read access to that bucket. Do not share credentials in chat or commit them to GitHub.

## 3. Netlify environment variables
Set these in Netlify Site configuration > Environment variables:
- `SITE_URL`: your deployed Netlify site URL, including https://
- `NOWPAYMENTS_API_KEY`: NOWPayments API key
- `NOWPAYMENTS_IPN_SECRET`: IPN secret from NOWPayments
- `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`

Only enter secrets in Netlify's environment variable settings, never in source files or GitHub.

## 4. Deploy
Import this GitHub repository into Netlify. Netlify should detect `netlify.toml`; use the repository root as the base and publish directory `.`. Install dependencies from `package.json`. Redeploy after setting environment variables.

## 5. Test before launch
Use NOWPayments sandbox/test mode if available. Verify the IPN signature, successful payment update, and one-time/short-lived download link. This starter currently has no customer email notifications, refunds workflow, or admin dashboard.

## Important
NOWPayments and Cloudflare R2 may have fees, minimums, or account requirements. Check their current terms before enabling payments. Netlify free usage limits can change. Do not promise customers a download until a real test order completes successfully.
