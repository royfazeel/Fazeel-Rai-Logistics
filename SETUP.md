# Rai Logistics — website setup

This is the only document you need. It assumes you have never touched code.
Follow it top to bottom. Nothing here requires a developer.

There are two jobs:

1. **Lead delivery** — make sure the website can actually send you the leads
   people fill in. **Do this before you spend a dollar on ads.**
2. **Tracking** — tell Google Ads which clicks turned into phone calls and
   form submissions, so your ad money goes where it works.

Every setting below is pasted into the same place (Vercel), and every one of
them needs the same last step: **redeploy**. That step is where almost
everybody gets stuck, so it has its own section.

---

## 0. The 30-second health check

Open this address in any browser — phone or laptop:

```
https://railogistics.us/api/lead
```

You will see a line of text like this:

```json
{"ok":true,"configured":{"resend":true,"webhook":false,"autoReply":true},"message":"Lead delivery is configured. ..."}
```

Read it like this:

| What you see | What it means |
| --- | --- |
| `"ok":true` | Leads are reaching you. Good. |
| `"ok":false` | **Nothing is set up.** Forms show visitors your phone number instead of taking a message. Start at section 1. |
| `"resend":true` | Lead emails are switched on. |
| `"webhook":true` | Leads are also being pushed to Zapier/Make/Sheets. |
| `"autoReply":true` | Carriers who leave an email get an automatic "we got it" reply. |

This page never shows your passwords or keys — only true/false. It is safe to
open anywhere, and safe to send to whoever is helping you.

Use it every time you change a setting. If it does not say what you expect,
you almost certainly have not redeployed (section 3).

---

## 1. Lead delivery

Pick **Option A**, **Option B**, or both. Both is better: if one service has a
bad day, the other still catches the lead.

Until one of them is set up, the forms are honest with the visitor — they say
we could not send the message and show your phone number. A lead is never
quietly thrown in the bin, but it never reaches you either.

### Option A — get every lead as an email (recommended)

We use a service called **Resend**. Its free tier is far more than a dispatch
business needs. Sending through a real service is what keeps lead emails out
of the spam folder.

1. Go to **resend.com** and create an account.
2. Click **Domains**, then **Add Domain**, and enter `railogistics.us`.
3. Resend shows you a few **DNS records**. Copy them into wherever your domain
   is managed (GoDaddy, Namecheap, Cloudflare, or Vercel if the domain lives
   there). If someone else set up your domain, send them that screen and ask
   them to add the records — it is a five-minute job for them.
   Wait until the domain shows **Verified** in Resend. This is the step that
   keeps your leads out of spam. Do not skip it.
4. Click **API Keys**, then **Create API Key**. Give it any name. Sending
   permission is enough.
5. **Copy the key immediately** — it starts with `re_` and Resend only shows
   it once. Paste it somewhere safe for the next five minutes.
6. You now have three values for section 3:

   | Name to type in Vercel | Value to paste |
   | --- | --- |
   | `RESEND_API_KEY` | the `re_...` key you just copied |
   | `LEAD_FROM_EMAIL` | `leads@railogistics.us` (must be on the domain you verified) |
   | `LEAD_TO_EMAIL` | the inbox you want leads in, e.g. `sam@railogistics.us` |

**What the lead email looks like.** The subject line tells you who it is and
what he drives before you even open it — for example
`New lead: Marcus Webb · Reefers · wants a callback`. Inside, at the top,
there is a big red **Call** button and a **Text** button: tap either one on
your phone and it dials or texts the carrier straight away. Underneath, in
callback order: name, phone, whether he asked to be called, equipment, MC
number, preferred lanes, whether he is a new authority or switching, his
factoring situation, his email, and his message. If you hit **Reply**, your
reply goes to the carrier, not to the website.

**The carrier also gets a short reply.** Whenever someone leaves an email
address, they get a brief, professional acknowledgement from
`LEAD_FROM_EMAIL`: it confirms what they sent, gives your phone number as the
fastest route, and lists your dispatch hours. It promises nothing about
timing. If you would rather it did not go out, add a variable called
`LEAD_AUTO_REPLY` with the value `off`. If that courtesy email ever fails, it
changes nothing about your lead — yours is sent first and is never affected.

### Option B — send leads anywhere else, with no code (webhook)

Use this if you want leads dropping into a Google Sheet, a CRM, a text
message, or Slack.

1. In **Zapier** (zapier.com) create a new Zap. Make is the same idea.
2. For the trigger choose **Webhooks by Zapier** -> **Catch Hook**.
3. Zapier gives you a web address. Copy it. That is your `LEAD_WEBHOOK_URL`.
4. For the action, pick whatever you want to happen: "Add row to Google
   Sheets", "Send SMS", "Create HubSpot contact", "Send channel message in
   Slack".
5. Turn the Zap on.

Every lead is sent to that address with all the same details. Two fields make
this easy: `subject` (the same one-line summary as the email subject) and
`summary` (the whole lead as plain text). If you are setting up an SMS or a
Slack message, use `summary` on its own and you are done.

| Name to type in Vercel | Value to paste |
| --- | --- |
| `LEAD_WEBHOOK_URL` | the Catch Hook address Zapier gave you |

---

## 2. Google Ads and Analytics tracking

Skip this only if you are not running ads yet. Without it, Google Ads cannot
tell which clicks became a phone call or a form submission, so it cannot spend
your budget on the ones that work.

You need up to four values.

1. **GA4 measurement ID** — in Google Analytics: **Admin** -> **Data Streams**
   -> your website. It looks like `G-XXXXXXXXXX`.
2. **Google Ads conversion ID** — in Google Ads: **Goals** -> **Conversions**
   -> **Summary**, then open a conversion action and look at the tag setup. It
   looks like `AW-XXXXXXXXX`.
3. **Two conversion labels.** In Google Ads create two conversion actions of
   type *Website*: one called something like "Phone call click" and one called
   "Lead form submit". Each one gives you a "send to" value that looks like
   `AW-XXXXXXXXX/AbC-D_efGhIjKlM`. Copy each one whole, including the part
   before the slash.

| Name to type in Vercel | Value to paste |
| --- | --- |
| `NEXT_PUBLIC_GA4_ID` | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_GADS_ID` | `AW-XXXXXXXXX` |
| `NEXT_PUBLIC_GADS_CALL_LABEL` | the phone-call "send to" value |
| `NEXT_PUBLIC_GADS_LEAD_LABEL` | the lead-form "send to" value |

The lead conversion fires **only when a lead was genuinely delivered**. If
delivery ever fails, the visitor is shown your phone number and no conversion
is counted — so the numbers in Google Ads stay honest and your bidding stays
sane.

---

## 3. Where to paste all of this (Vercel)

1. Go to **vercel.com** and sign in.
2. Open the **Rai Logistics** project.
3. Click **Settings** in the top row.
4. Click **Environment Variables** in the left-hand list.
5. For each value you collected above, click **Add New** and fill in:
   - **Key** — the name exactly as written in this document. Capitals and
     underscores matter. `Lead_To_Email` is not the same as `LEAD_TO_EMAIL`.
   - **Value** — paste the value. No quote marks, no spaces before or after.
   - **Environments** — tick **Production**, **Preview** and **Development**.
6. Click **Save**. Repeat for the next one.

### Then redeploy — this is the step everybody misses

Settings do nothing until the site is rebuilt.

1. Click **Deployments** in the top row.
2. Find the deployment at the top of the list.
3. Click the **…** button on the right of that row.
4. Choose **Redeploy**, then confirm.
5. Wait for the status to go green (about a minute).

Now open `https://railogistics.us/api/lead` again (section 0) and check it says
what you expect.

---

## 4. Prove it works, properly

Do this once, on your phone, before the ads go live.

1. Open `https://railogistics.us/api/lead`. Confirm `"ok":true`.
2. Go to `https://railogistics.us/contact`. Fill the form in with **your own
   name, your own phone number and your own email**, pick any equipment, and
   send it.
3. You should see **"Message sent"** on the page.
4. Within a minute the lead email should be in the `LEAD_TO_EMAIL` inbox
   (check spam the first time). Tap the red **Call** button — your own phone
   should start dialling the number you typed in.
5. Check the email address you used: you should also have the short "We
   received your request" acknowledgement.
6. If you set up a webhook, check the Google Sheet / Slack / SMS as well.
7. Do the same again with the **Get a Free Quote** button on the home page, so
   both forms are proven.
8. Delete the test lead from wherever it landed, so you are not calling
   yourself back next week.

---

## 5. When something is wrong

**The form says "We couldn't send that just now."**
Open `/api/lead`. If it says `"ok":false`, the variables are missing or you
have not redeployed. If it says `"ok":true`, the settings are there but the
sending service rejected the message — most often the Resend domain is not
verified yet, or `LEAD_FROM_EMAIL` is on a different domain from the one you
verified.

**`/api/lead` still says false after I added everything.**
You have not redeployed. Section 3, second half. If you did redeploy, check
the spelling of the variable names and that you ticked **Production**.

**No email arrives, but the form says "Message sent".**
1. Check the spam folder and search your inbox for "New lead".
2. In Resend, open **Logs** — it shows every message and why it bounced.
3. Confirm the domain still shows **Verified**.
4. Confirm `LEAD_TO_EMAIL` is spelled correctly.

**Emails land in spam.**
The domain is almost certainly not fully verified in Resend. Go back to
section 1, step 3, and make sure every DNS record is in place. Also mark the
first one as "not spam" in your own inbox.

**A carrier says he filled the form and heard nothing.**
He was shown either a confirmation or your phone number — the site never fails
silently. Ask which he saw. If he saw the phone number, delivery was down at
that moment; check `/api/lead` and Resend's logs.

**I am getting spam through the form.**
There is already a hidden trap field that catches most bots, and a limit of 5
submissions per visitor per 10 minutes. If real spam starts getting through,
tell your developer — the fix is a shared rate-limit store or turning on
Vercel's firewall for that one address.

**I want leads to go to a different inbox.**
Change `LEAD_TO_EMAIL` in Vercel, then redeploy, then re-check `/api/lead`.

**I want to stop the automatic reply to carriers.**
Add `LEAD_AUTO_REPLY` with the value `off`, then redeploy. `/api/lead` will
then show `"autoReply":false`.

---

## 6. Every setting, on one page

| Name | What it is | Needed for |
| --- | --- | --- |
| `RESEND_API_KEY` | Resend API key, starts with `re_` | Lead emails |
| `LEAD_FROM_EMAIL` | Verified "from" address, e.g. `leads@railogistics.us` | Lead emails |
| `LEAD_TO_EMAIL` | Inbox the leads land in | Lead emails |
| `LEAD_AUTO_REPLY` | Set to `off` to stop the carrier acknowledgement | Optional |
| `LEAD_WEBHOOK_URL` | Zapier / Make catch-hook address | Zapier, Sheets, SMS, Slack |
| `NEXT_PUBLIC_GA4_ID` | `G-XXXXXXXXXX` | Google Analytics |
| `NEXT_PUBLIC_GADS_ID` | `AW-XXXXXXXXX` | Google Ads |
| `NEXT_PUBLIC_GADS_CALL_LABEL` | Phone-call conversion "send to" value | Google Ads |
| `NEXT_PUBLIC_GADS_LEAD_LABEL` | Lead-form conversion "send to" value | Google Ads |

After any change: **Save -> Redeploy -> check `/api/lead`.**
