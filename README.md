# CareerFlip
---
⚠️ Important: Google OAuth Verification Limitation
Why this issue exists

Google requires all OAuth applications to be verified before they can be used publicly.
The CareerFlip Google OAuth project is not yet verified by Google.

Because of this restriction:
Public Google sign-in is not allowed
OAuth login works only for test users

This limitation applies from testing to production deployment
---
✅ Temporary Login Workaround

Until Google OAuth verification is approved, please use the following test credentials to access the application:

Email: shaikhaadill404@gmail.com


⚠️ These credentials are provided only for demo, testing, and evaluation purposes.
---
❗ OAuth Dependency Note (Important)

If you log in without Google OAuth, the following limitation applies:

❌ The Roadmap → Schedule feature will NOT work

Reason: Google Calendar access is only permitted via OAuth
Without OAuth, the app cannot:
Access your Google Calendar
Create or sync schedules

✅ The Schedule feature works only when logged in via Google OAuth.
---
🔐 Final Note

Once Google OAuth verification is approved:
Public sign-in will be enabled for everyone
Temporary test credentials will be removed
Calendar and scheduling features will work normally for all users
---
🚀 Skip Registration (Limited Access)

You can skip registration/login and directly access the dashboard using the link below:

👉 https://career-flip.vercel.app/dashboard

⚠️ Important limitation when skipping login:
❌ Google Calendar will NOT work
❌ Roadmap → Schedule feature will NOT work

Reason: Calendar access requires Google OAuth permissions, which are unavailable without OAuth login
