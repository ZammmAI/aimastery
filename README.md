# 🚀 AI Mastery — Complete Setup Guide
### From zero to live website in ~45 minutes
### Your email: zmohomad78@gmail.com

---

## 📁 YOUR FILES (what's in this folder)

```
aimastery/
├── index.html         ← Your website
├── app.js             ← All the JavaScript
├── api/
│   └── send-email.js  ← Sends emails automatically
├── package.json       ← Tells Vercel it is a Node project
├── vercel.json        ← Vercel configuration
├── supabase-setup.sql ← Run once to set up your database
└── README.md          ← This guide
```

---

## STEP 1 — Create a GitHub Account (5 min)

1. Go to **https://github.com**
2. Click **Sign up**
3. Use your email: zmohomad78@gmail.com
4. Choose a username — e.g. `aimastery-lk`
5. Verify your email

---

## STEP 2 — Upload Your Files to GitHub (5 min)

1. On GitHub, click the **+** button (top right) → **New repository**
2. Name it: `aimastery`
3. Set it to **Public**
4. Click **Create repository**
5. On the next page, click **uploading an existing file**
6. Drag and drop ALL these files from this folder:
   - `index.html`
   - `app.js`
   - `package.json`
   - `vercel.json`
   - `supabase-setup.sql`
   - `api/send-email.js`

   ⚠️ IMPORTANT: For `api/send-email.js`, GitHub needs you to create
   the folder. Click "Create new file", type `api/send-email.js`
   as the filename — GitHub auto-creates the `api` folder for you.
   Then paste the contents of send-email.js into it.

7. Click **Commit changes** (green button)

---

## STEP 3 — Create a Supabase Account (5 min)

1. Go to **https://supabase.com**
2. Click **Start your project**
3. Sign up with your Google account (zmohomad78@gmail.com)
4. Click **New Project**
5. Fill in:
   - **Name:** aimastery
   - **Database Password:** choose a strong password — SAVE THIS
   - **Region:** Southeast Asia (Singapore) — closest to Sri Lanka
6. Click **Create new project** — wait ~2 minutes

---

## STEP 4 — Set Up Your Database (2 min)

1. In Supabase, click **SQL Editor** (left sidebar, looks like `</>`)
2. Click **New query**
3. Open the file `supabase-setup.sql` from this folder
4. Copy ALL the text from that file
5. Paste it into the SQL Editor
6. Click **Run** (green button)
7. You should see "Success. No rows returned"

✅ Your database is ready!

---

## STEP 5 — Get Your Supabase Keys (2 min)

1. In Supabase, click **Project Settings** (gear icon, bottom left)
2. Click **API** in the settings menu
3. You'll see two important things — COPY BOTH:
   - **Project URL** — looks like: `https://abcdefgh.supabase.co`
   - **anon public** key — a long string starting with `eyJ...`
4. Open your `public/index.html` file
5. Find these two lines near the bottom:
   ```
   const SUPABASE_URL = 'YOUR_SUPABASE_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```
6. Replace `YOUR_SUPABASE_URL` with your Project URL
7. Replace `YOUR_SUPABASE_ANON_KEY` with your anon key
8. Save the file

---

## STEP 6 — Create a Resend Account (5 min)

1. Go to **https://resend.com**
2. Click **Get Started**
3. Sign up with zmohomad78@gmail.com
4. Verify your email
5. On the dashboard, click **API Keys** (left sidebar)
6. Click **Create API Key**
7. Name it: `aimastery`
8. Click **Add** — COPY THE KEY (starts with `re_...`) — you only see it once!

---

## STEP 7 — Deploy to Vercel (5 min)

1. Go to **https://vercel.com**
2. Click **Sign up** → choose **Continue with GitHub**
3. Authorize Vercel to access your GitHub
4. Click **Add New Project**
5. You'll see your `aimastery` repository — click **Import**
6. Leave all settings as default
7. Click **Deploy**
8. Wait ~1 minute — your site is now LIVE! 🎉

Vercel gives you a URL like: `https://aimastery-xyz.vercel.app`

---

## STEP 8 — Add Your Secret Keys to Vercel (5 min)

This is how Resend and your owner email get connected — safely.

1. In Vercel, go to your project
2. Click **Settings** (top menu)
3. Click **Environment Variables** (left sidebar)
4. Add these one by one — click **Add** after each:

   | Name | Value |
   |------|-------|
   | `RESEND_API_KEY` | your Resend key (re_...) |
   | `OWNER_EMAIL` | zmohomad78@gmail.com |

5. Click **Save**
6. Go back to **Deployments** → click **Redeploy** on the latest deployment
7. Click **Redeploy** to confirm

✅ Everything is now connected!

---

## STEP 9 — Test It! (2 min)

1. Go to your live Vercel URL
2. Fill in the enrollment form with YOUR OWN details to test
3. Click **Complete Enrollment**
4. You should see:
   - ✅ Success message on the website
   - ✅ A welcome email in your inbox (zmohomad78@gmail.com)
   - ✅ A notification email to zmohomad78@gmail.com
   - ✅ A new row in Supabase → Table Editor → enrollments

If something doesn't work, WhatsApp +94 75 386 3070 or check Vercel logs:
Vercel → your project → **Functions** tab → click `send-email`

---

## STEP 10 — Fill in Your Bank Details (2 min)

In `public/index.html`, find the bank box section and replace:
- `YOUR BANK NAME` → e.g. Commercial Bank
- `YOUR FULL NAME` → your actual name
- `XXXX XXXX XXXX` → your account number
- `YOUR BRANCH` → your branch name

Then on GitHub, click the file → pencil icon → edit → Commit changes.
Vercel rebuilds automatically in 30 seconds.

---

## STEP 11 — Add Your YouTube Video (1 min)

1. Upload your intro video to YouTube
2. Copy the video ID from the URL
   - URL: `https://youtube.com/watch?v=dQw4w9WgXcQ`
   - ID: `dQw4w9WgXcQ`
3. In `public/app.js`, find:
   ```
   const videoId = 'YOUR_YOUTUBE_VIDEO_ID';
   ```
4. Replace with your actual ID

---

## 📊 How to View Enrollments

1. Go to **https://supabase.com**
2. Open your `aimastery` project
3. Click **Table Editor** (left sidebar)
4. Click **enrollments** table
5. You'll see every person who enrolled, their details, and status

To mark someone as verified after payment:
- Click the `status` cell → change from `pending` to `verified`

---

## 🌐 Custom Domain (Optional — do this later)

When you're ready for a proper domain like `aimastery.lk`:

1. Buy from **https://domains.lk** (~Rs. 3,000/year)
2. In Vercel → Settings → Domains → Add `aimastery.lk`
3. Follow Vercel's instructions to connect it
4. Done — your site is at `aimastery.lk`

---

## 🆘 Common Problems & Fixes

| Problem | Fix |
|---------|-----|
| Form submits but no email received | Check Vercel → Functions → send-email for errors |
| "Database error" on form submit | Re-run the SQL in Supabase SQL Editor |
| Site not updating after changes | Wait 30 seconds, or force refresh (Ctrl+Shift+R) |
| Emails going to spam | Add your domain in Resend settings |
| Can't find Supabase keys | Settings → API in your Supabase project |

---

## 📞 Summary of All Accounts You'll Create

| Service | URL | What for |
|---------|-----|----------|
| GitHub | github.com | Stores your code |
| Vercel | vercel.com | Hosts your website live |
| Supabase | supabase.com | Saves enrollments |
| Resend | resend.com | Sends emails |

All free. No credit card needed.

---

✅ **That's it! Follow each step one by one and your full system will be live.**
