# SAWANGA Investment Limited — Website

Premium building finishes & interior solutions. Live, production-ready website with a working
**Painter Referral Portal**, **Request-a-Quote** engine, and **Contact** system.

**Brand:** Royal Blue & Gold · _Finishes That Build Trust_
**Stack:** Next.js 14 (App Router) · Supabase (Auth + Postgres) · Resend (email) · Tailwind CSS · Vercel

---

## What's included

| Page / Feature | Route | Backed by |
|---|---|---|
| Homepage | `/` | static |
| Products | `/products` | static |
| Solutions (Developers/Contractors/Institutions/Homeowners) | `/solutions` | static |
| About | `/about` | static |
| Contact (form → DB + email) | `/contact` | Supabase + Resend |
| Request a Quote (form → DB + email) | `/quote` | Supabase + Resend |
| Painter Portal (sign-up / how it works) | `/painter-portal` | Supabase Auth |
| Painter Login | `/painter-portal/login` | Supabase Auth |
| Painter Dashboard (referrals, points, redeem) | `/painter-portal/dashboard` | Supabase (RLS-protected) |

**Painter rewards model:** painters earn a **percentage of each confirmed referred sale**
(default **3%**, set in `app/api/referrals/route.ts`). Points are credited automatically by a
database trigger the moment a referral is marked `approved`, and are redeemable via M-Pesa,
bank, or store credit.

---

## Go live in ~20 minutes (lightweight)

### 1. Create a Supabase project
1. Go to **supabase.com** → New Project (name it `sawanga`).
2. Once ready, open **SQL Editor** → paste the entire contents of
   [`supabase/schema.sql`](supabase/schema.sql) → **Run**. This creates all tables, security
   policies, and the auto-reward trigger.
3. (Recommended) **Authentication → Providers → Email**: for the smoothest painter sign-up,
   you can turn **off** "Confirm email" so painters land straight in their dashboard. Leave it
   on if you prefer email verification.

### 2. Get a Resend API key (for emails)
1. Go to **resend.com** → create an account → **API Keys** → create one.
2. **Domains** → add `sawangainvestments.com` and add the DNS records they show you
   (this lets emails send from `noreply@sawangainvestments.com`).
   _Skip this step and leave `RESEND_API_KEY` blank to launch without email — forms still
   save to the database._

### 3. Set environment variables
Copy `.env.example` → `.env.local` and fill in the values from steps 1 & 2.

### 4. Push to GitHub
```bash
git init
git add .
git commit -m "SAWANGA Investments website"
git branch -M main
git remote add origin https://github.com/bmaitho/Sawanga-Investments.git
git push -u origin main
```

### 5. Deploy on Vercel
1. Go to **vercel.com** → **Add New Project** → import `bmaitho/Sawanga-Investments`.
2. Under **Environment Variables**, add the same 4 keys from your `.env.local`.
3. **Deploy.**

### 6. Connect your domain
1. In Vercel → Project → **Settings → Domains** → add `sawangainvestments.com` and
   `www.sawangainvestments.com`.
2. Vercel shows the DNS records to add at your domain registrar. Add them. SSL is automatic.

### 7. Professional email + Gmail sync
For `info@sawangainvestments.com` synced with Gmail, the simplest path is **Google Workspace**
(workspace.google.com) — add your domain, create the `info@` mailbox, and it works as a normal
Gmail inbox. Quote/contact notifications are sent to `info@sawangainvestments.com` automatically.

---

## Run locally
```bash
npm install
cp .env.example .env.local   # fill in your keys
npm run dev                  # http://localhost:3000
```

---

## Managing the business (admin)

There's no separate admin UI yet — you manage leads and approve referrals directly in the
**Supabase dashboard → Table Editor**:

- **`quote_requests`** / **`contact_messages`** — incoming leads (also emailed to you).
- **`referrals`** — to approve: set `sale_value` to the confirmed amount, then change
  `status` to `approved`. The trigger automatically credits the painter
  (`sale_value × reward_rate`) to their `total_points`.
- **`redemptions`** — painter payout requests; mark `paid` once you've sent the money.

A built-in admin dashboard can be added as a fast follow-up.

---

## Customising
- **Company details, phones, products, partners:** `lib/data.ts`
- **Reward percentage:** `DEFAULT_RATE` in `app/api/referrals/route.ts`
- **Colors / fonts:** `tailwind.config.ts` + `app/globals.css`
- **Email templates:** `lib/email.ts`

---

© SAWANGA Investment Limited. Built with care.
