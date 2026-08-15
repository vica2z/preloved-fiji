# PreLoved Fiji — Phase 1 Prototype (React)

A working prototype of the PreLoved Fiji marketplace — buyer & seller app plus admin panel — built in React + Vite, ready to host on Vercel for client review.

## What's inside

- **Buyer & seller app** — login (OTP / Google), browse, search & filters, item detail, checkout, sell flow (with AI photo step), messaging, offers, profile, settings, favourites, orders, ratings.
- **Payment gateways** — working **M-PAiSA (Vodafone)** and **MyCash (Digicel)** checkout screens: enter number → PIN pad → confirmation → order created. Card and cash-on-meetup are included as methods too.
- **Admin panel** — a detailed Guide page, dashboard, full add/edit/delete for listings, users and orders, disputes, reports, and the monetization tools (featured listings, ad banners, category fees).
- **Live two-way sync** — changes in the admin panel appear in the app instantly, and vice versa.
- **Saved data** — changes persist in the browser (localStorage). Use the **↺ Reset** button in the top bar to restore the original sample data.

> All names, phone numbers and details are fictional sample data for the demo.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL shown (usually http://localhost:5173).

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build
```

## Deploy to Vercel

**Option A — through the Vercel website (easiest):**
1. Push this folder to a GitHub repository.
2. Go to vercel.com → **Add New… → Project** → import that repo.
3. Vercel auto-detects Vite. Leave the defaults:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click **Deploy**. You'll get a shareable link in about a minute.

**Option B — Vercel CLI:**
```bash
npm i -g vercel
vercel
```
Follow the prompts (accept the detected settings). Run `vercel --prod` for a production URL.

No environment variables or extra configuration are needed for this prototype.
