# Rai Dispatch — website setup

This guide covers lead delivery and tracking for the Rai Dispatch website.
For the domain migration and recorded launch checks, also see
[the SEO audit and migration record](docs/SEO-AUDIT-AND-MIGRATION.md).

There are two jobs:

1. **Lead delivery** — make sure the website can actually send you the leads
   people fill in. **Do this before you spend a dollar on ads.**
2. **Tracking** — tell Google Ads which clicks turned into phone calls and
   form submissions, so your ad money goes where it works.

Every setting below is pasted into the same place (Vercel), and every one of
them needs the same last step: **redeploy**. That step is where almost
everybody gets stuck, so it has its own section.

---

## 0. Check the delivery configuration

Open this address in any browser — phone or laptop:

```
https://raidispatch.com/api/lead
```

You will see a line of text like this:

```json
{"ok":true,"configured":{"resend":true,"webhook":false,"autoReply":true},"message":"Lead delivery is configured. ..."}
```

Read it like this:

| What you see | What it means |
| --- | --- |
| `"ok":true` | At least one delivery channel has the required configuration values. This does **not** prove that messages are delivered. |
| `"ok":false` | No delivery channel has all required values. Forms show an error and the phone number when they cannot send. Start at section 1. |
| `"resend":true` | A Resend key and sender address are configured; their validity and delivery have not been checked. |
| `"webhook":true` | A webhook URL is configured; its acceptance and downstream actions have not been checked. |
| `"autoReply":true` | A carrier acknowledgement will be attempted after a notification channel accepts the lead. |

This page never shows your passwords or keys — only true/false. It is safe to
open anywhere, and safe to send to whoever is helping you.

This endpoint checks configuration presence only. It does not test API-key
validity, sender verification, provider acceptance, or inbox receipt. Use it
after changing a setting, then complete the owner test in section 4. If the
result is unexpected, check the environment values and deployment (section 3).

---

## 1. Lead delivery

Pick **Option A**, **Option B**, or both. Both is better: if one service has a
bad day, the other still catches the lead.

Until a channel is configured, a form submission returns an error and shows
the phone number. Successful submission means a configured service accepted
the notification request; actual inbox receipt or a completed webhook action
must be confirmed separately.

### Option A — get every lead as an email (recommended)

The email integration uses **Resend**. Use the existing account and verified
sender if they are already configured. Check the account’s current plan and
sending limits there; sender authentication helps delivery but does not
guarantee inbox placement.

**Keep email separate from the web-domain change.** The website URL is
`https://raidispatch.com`. The existing inbox `sam@railogistics.us` and the
old-domain sender examples below are intentionally retained. Do not change
them to `@raidispatch.com` until the replacement mailbox, sending-domain DNS,
and actual delivery are verified. Preserve existing MX, SPF, DKIM, and DMARC
records while changing website DNS.

1. Sign in to the existing **resend.com** account. Create an account only if
   the business does not already have one.
2. Under **Domains**, check the existing verified sender domain. For the
   retained examples, that domain is `railogistics.us`. Add it only if it
   is not already present; a website migration alone does not require a new
   sending domain.
3. Resend shows you a few **DNS records**. Copy them into wherever your domain
   is managed, such as Porkbun. Add only the required mail records and
   preserve the website and existing email records. Wait until the sending
   domain shows **Verified** in Resend before using its sender address.
4. Keep an existing working key when appropriate. If a new key is needed,
   use **API Keys** → **Create API Key** with sending permission.
5. If you created a key, save it directly to your password manager or the
   intended Vercel environment variable. Never put it in GitHub, screenshots,
   or this document.
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

**The carrier acknowledgement is attempted afterward.** When an email
address is provided and auto-reply is enabled, the application attempts a
brief acknowledgement from
`LEAD_FROM_EMAIL`: it confirms what they sent, gives your phone number as the
fastest route, and lists your dispatch hours. It promises nothing about
timing. If you would rather it did not go out, add a variable called
`LEAD_AUTO_REPLY` with the value `off`. If that courtesy email ever fails, it
does not change the successful owner-notification result. Check provider
logs separately if an acknowledgement is missing.

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

The lead conversion fires only after the API reports that at least one
notification service accepted the request. If all delivery attempts fail,
the form displays the phone number and does not record a successful lead
conversion. Provider acceptance is not a measurement of inbox receipt or a
completed sale. A call-click event likewise records a tap, not a connected
phone conversation.

---

## 3. Where to paste all of this (Vercel)

1. Go to **vercel.com** and sign in.
2. Open the existing **fazeel-rai-logistics** project connected to
   **royfazeel/Fazeel-Rai-Logistics**. The dashboard name may retain the old
   brand. Do not create a duplicate project for this change.
3. Click **Settings** in the top row.
4. Click **Environment Variables** in the left-hand list.
5. For each value you collected above, click **Add New** and fill in:
   - **Key** — the name exactly as written in this document. Capitals and
     underscores matter. `Lead_To_Email` is not the same as `LEAD_TO_EMAIL`.
   - **Value** — paste the value. No quote marks, no spaces before or after.
   - **Environments** — select **Production** for live delivery. Configure
     Preview and Development separately; use test destinations there if
     needed rather than unintentionally sending local tests to a live inbox.
6. Click **Save**. Repeat for the next one.

### Then redeploy — this is the step everybody misses

Settings do nothing until the site is rebuilt.

1. Click **Deployments** in the top row.
2. Find the deployment at the top of the list.
3. Click the **…** button on the right of that row.
4. Choose **Redeploy**, then confirm.
5. Wait for the deployment to report success and confirm the intended
   production commit is serving the site.

Now open `https://raidispatch.com/api/lead` again (section 0) and check it says
what you expect.

---

## 4. Prove it works, properly

Do this once, on your phone, before the ads go live.

1. Open `https://raidispatch.com/api/lead`. Confirm `"ok":true`; this checks
   configuration only. The next steps verify actual delivery.
2. Go to `https://raidispatch.com/contact`. Fill the form in with **your own
   name, your own phone number and your own email**, pick any equipment, and
   send it.
3. You should see **"Message sent"** on the page.
4. Check the `LEAD_TO_EMAIL` inbox and spam folder for the lead notification.
   If it does not arrive, inspect the Resend delivery logs before treating
   the test as passed. The **Call** button should contain the number you typed.
5. If auto-reply is enabled, check the email address you entered for the
   "We received your request" acknowledgement. Check its delivery separately.
6. If you set up a webhook, check the Google Sheet / Slack / SMS as well.
7. Repeat using a quote button on the home page, such as **Get a free setup**,
   so both the contact form and quote modal are verified.
8. Delete the test lead from wherever it landed, so you are not calling
   yourself back next week.

---

## 5. When something is wrong

**The form says "We couldn't send that just now."**
Open `/api/lead`. If it says `"ok":false`, the variables are missing or you
have not redeployed. If it says `"ok":true`, the settings are there but the
sending attempt may have failed. Check Vercel and provider logs for the
actual reason, including invalid credentials, sender verification, rate
limits, network failures, or a failing webhook.

**`/api/lead` still says false after I added everything.**
You have not redeployed. Section 3, second half. If you did redeploy, check
the spelling of the variable names and that you ticked **Production**.

**No email arrives, but the form says "Message sent".**
1. Check the spam folder and search your inbox for "New lead".
2. In Resend, open **Logs** — it shows every message and why it bounced.
3. Confirm the domain still shows **Verified**.
4. Confirm `LEAD_TO_EMAIL` is spelled correctly.

**Emails land in spam.**
Check sender authentication and provider delivery logs, then review the
recipient mail system’s spam handling. Correct DNS does not by itself
guarantee inbox placement. Mark a legitimate test message as "not spam" if
your mail provider supports that action.

**A carrier says he filled the form and heard nothing.**
Ask what the carrier saw and check the notification provider’s logs for the
submission time. A form confirmation means the service accepted a request;
it does not establish that it reached your inbox. `/api/lead` only reports
the current configuration and cannot diagnose a past delivery.

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

After any change: **Save → Redeploy → check `/api/lead` → verify an authorized
test notification at its destination.**

---

## Google Analytics — already connected

The existing GA4 measurement ID **G-K31P16P0SB** is built into the site. It is
retained across the web-domain migration, so no replacement ID is required
solely because the public hostname changes. Tag loading and event receipt
still need to be verified in the browser and Analytics.

To confirm it is working: open the site, then in Google Analytics go to
**Reports → Realtime** and confirm the visit and expected events appear.
Browser privacy settings, blockers, and reporting delays can affect this check.

You only need `NEXT_PUBLIC_GA4_ID` if you ever want to point the site at a
different property — setting it overrides the built-in one.

Google **Ads** conversion tracking is separate and still needs its own values
(`NEXT_PUBLIC_GADS_ID` and the two conversion labels) — see the table above.
