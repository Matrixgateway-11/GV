# Golden Village — Admin panel

Private dashboard for the website: visits and enquiries per **day / week / month**, where visitors come
from, and an inbox of every "Request Catalog" enquiry (status, internal notes, reply by email / WhatsApp,
CSV export).

It is a separate app from the website, deployed as its **own Vercel project** from the same GitHub repo
(Root Directory `admin`), so it has its own address that is not linked from the website.
Until the database is connected it runs in **demo mode** with sample data.

```bash
cd admin
npm install
npm run dev      # http://localhost:5173 (demo mode unless .env.local has the Supabase settings)
npm run build
```

## How it fits together

```
Website (gv project)                          Supabase (database + logins)          Admin (this app)
  Request Catalog form ──► /api/enquiry ──┬─► enquiries table  ◄──────────────────── reads / updates
  every visit           ──► /api/track  ──┘   page_views table ◄── admin_traffic()  ─ dashboard
                                │                                admin_breakdown()
                                └─► Resend ──► email to ENQUIRY_TO
```

Only emails listed in the `admin_users` table can sign in and read data; everyone else is refused by the
database itself, not just hidden by the app.

## One-time setup

### 1. Supabase (database and admin logins) — free plan is enough

1. Create a project at [supabase.com](https://supabase.com) (region: Singapore is closest to Indonesia).
2. **SQL Editor → New query**: paste all of `supabase/schema.sql` from this repo. In step 5 of that file,
   replace `you@example.com` with the email you will sign in with (any email for now). Click **Run**.
3. **Authentication → Sign In / Providers**: turn **off** "Allow new users to sign up".
4. **Authentication → Users → Add user → Create new user**: the same email, a strong password,
   tick **Auto Confirm User**.
5. **Project Settings → API (API Keys)**: you will need the **Project URL**, the **publishable / anon** key
   and the **secret / service_role** key in the next steps. Paste them straight into Vercel — don't share
   them in chat or commit them to GitHub.

### 2. Admin panel on Vercel (new project)

1. Vercel → **Add New… → Project** → import the `GV` repository again.
2. **Project Name**: something hard to guess, e.g. `gv-console-7k3m9` (this becomes the address,
   `gv-console-7k3m9.vercel.app`).
3. **Root Directory**: `admin`. Framework: Vite (detected automatically).
4. **Environment Variables**:
   - `VITE_SUPABASE_URL` = the Project URL
   - `VITE_SUPABASE_ANON_KEY` = the publishable / anon key (safe in the browser; the database rules protect the data)
   - `VITE_SITE_URL` = the public website address (optional, for the "View website" link)
5. **Deploy**. Then in Supabase → **Authentication → URL Configuration**, set **Site URL** to the admin
   address (so "Forgot password?" emails link back to the panel).

### 3. Website project on Vercel (the existing `gv` project)

Settings → Environment Variables, for **Production** and **Preview**:

- `SUPABASE_URL` = the Project URL
- `SUPABASE_SERVICE_ROLE_KEY` = the **secret / service_role** key (server-side only)

Redeploy. From then on, enquiries are saved and visits are counted. Visits and enquiries from the test
(preview) site are marked as test data; the panel hides them unless "Include test site" is switched on.

### 4. Enquiry emails (when the official addresses are ready)

1. Create an account at [resend.com](https://resend.com) → **API Keys → Create**.
2. In the website project's environment variables add:
   - `RESEND_API_KEY` = the key
   - `ENQUIRY_TO` = the official address(es), comma-separated
3. Without a verified domain, Resend only delivers to the email you signed up to Resend with. To send to
   any address (and from e.g. `website@goldenvillagefurnitureindonesia.com`), verify the domain in Resend
   (**Domains → Add**, then add the DNS records it shows) and set
   `ENQUIRY_FROM` = `Golden Village Website <website@goldenvillagefurnitureindonesia.com>`.
4. Redeploy the website.

## Day-to-day

- **Add an admin**: Supabase SQL Editor →
  `insert into public.admin_users (email) values ('name@company.com');`
  then Authentication → Users → Add user with that email.
- **Remove an admin**: `delete from public.admin_users where email = 'name@company.com';`
  and delete the user under Authentication → Users.
- **Change who receives enquiry emails**: edit `ENQUIRY_TO` in the website project and redeploy.
- **Forgot password**: use "Forgot password?" on the sign-in page.

## Privacy

Visit counting uses no cookies and stores no IP addresses: each visit records the page opened, the
referring site, the country (from Vercel's IP lookup) and the device type, plus a hash that changes every
day so a visitor is counted once per day but can't be followed over time. Enquiries store what the
visitor typed, the country their request came from, and a one-way hash of their IP used only to limit
spam (max 5 enquiries per hour per sender).
