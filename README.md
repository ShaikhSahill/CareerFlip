# CareerFlip Deployment & Production Fixes

This README documents all the changes and deployment steps made to get your CareerFlip project working with a deployed backend (Render) and frontend (Vercel), including CORS, OAuth, and routing fixes.

---

## 1. Update Frontend API URLs
- Replaced all instances of `http://localhost:5000` in frontend API calls with your live backend URL: `https://careerflip.onrender.com`.

---

## 2. Update Google OAuth Redirects in Backend
- Changed the redirect URLs in `googleAuthCallback` to point to your live frontend:
	- Success: `https://career-flip.vercel.app/dashboard`
	- Error: `https://career-flip.vercel.app/login?error=AuthFailed`
- File updated: `backend/src/controller/user.controller.js`

---

## 3. Google Cloud Console OAuth Settings
- Added the following to "Authorized redirect URIs":
	- `https://careerflip.onrender.com/api/user/auth/google/callback` (for production)
	- `http://localhost:5000/api/user/auth/google/callback` (for local dev)

---

## 4. Fix Vercel 404 on Client-Side Routes
- Created a `vercel.json` file in the frontend root with:
	```json
	{
		"rewrites": [
			{ "source": "/(.*)", "destination": "/" }
		]
	}
	```
- This allows React Router routes (like `/dashboard`) to work on Vercel.

---

## 5. CORS Configuration in Backend
- Updated CORS settings in `backend/src/app.js` to allow both local and production frontends:
	```js
	app.use(cors({
		origin: [
			'http://localhost:5173',
			'https://career-flip.vercel.app'
		],
		credentials: true
	}));
	```

---

## 6. Secure Cookie Settings for Cross-Site Auth
- Updated cookie settings in backend (login and googleAuthCallback) to:
	```js
	res.cookie("token", token, {
		httpOnly: true,
		sameSite: "none",
		secure: true
	});
	```
- This allows cookies to be sent securely between your backend and Vercel frontend.

---

## 7. Frontend: Always Use `withCredentials: true`
- When making API requests from frontend, always use:
	```js
	axios.get('https://careerflip.onrender.com/api/user/getuser', { withCredentials: true })
	```
- This ensures cookies are sent with requests.

---

## 8. Redeploy
- After each change, push your code and redeploy both frontend (Vercel) and backend (Render) for changes to take effect.

---

## Troubleshooting
- If you see CORS or cookie errors, double-check CORS and cookie settings.
- If you see 404s on client routes, ensure `vercel.json` is present and deployed.
- If Google OAuth fails, check the redirect URIs in Google Cloud Console and backend code.

---

**You are now set up for production!**