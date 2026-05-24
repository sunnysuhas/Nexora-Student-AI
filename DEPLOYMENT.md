# Nexora AI Deployment Guide

This setup keeps the project free-friendly:

- Frontend: Vercel
- Backend API: Render web service
- Database: MongoDB Atlas M0 free cluster
- Uploads: Cloudinary free plan
- Email OTP: Gmail SMTP app password
- AI: Groq API key

## 1. Push Code To GitHub

Commit the project and push it to a GitHub repository. Do not commit `.env` or `server/.env`.

## 2. Deploy Backend On Render

1. Open Render and create a new Blueprint from this repo, or create a Web Service manually.
2. If creating manually:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Health Check Path: `/api/health`
3. Add these Render environment variables:

```env
NODE_ENV=production
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=generate-a-long-random-secret
JWT_REFRESH_SECRET=generate-a-second-long-random-secret
SMTP_EMAIL=nexoraai.platformsp@gmail.com
SMTP_PASS=your-gmail-app-password
GROQ_API_KEY=your-groq-api-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
CONTACT_TO_EMAIL=sunnysuhas108@gmail.com
CLIENT_URL=https://your-vercel-app.vercel.app
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

After Render deploys, test:

```txt
https://your-render-service.onrender.com/api/health
```

Expected:

```json
{ "ok": true, "service": "nexora-ai-api" }
```

## 3. Deploy Frontend On Vercel

1. Import the same GitHub repo into Vercel.
2. Framework Preset: Vite
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Add this Vercel environment variable:

```env
VITE_API_URL=https://your-render-service.onrender.com/api
```

6. Deploy.

## 4. Update Backend CORS After Vercel URL Exists

After Vercel gives you the final URL, go back to Render and set:

```env
CLIENT_URL=https://your-vercel-app.vercel.app
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

Redeploy the Render backend.

## 5. MongoDB Atlas Network Access

For free Render deployments, outbound IPs may not be static. For the MVP, Atlas Network Access usually needs:

```txt
0.0.0.0/0
```

Use a strong database username/password. For a stricter production setup later, move to hosting with static outbound IP support.

## 6. Final Smoke Test

Test these in production:

1. Landing page loads.
2. Register with a real email.
3. OTP email arrives.
4. Verify OTP.
5. Login.
6. Complete onboarding.
7. Create a task, assignment, attendance subject, note, and exam.
8. Refresh the page and confirm data persists.
9. Upload profile image.
10. Try AI assistant.
11. Confirm logged-out users cannot access `/dashboard`.
12. Confirm student users cannot access `/admin`.

## Notes

Render free services can sleep when inactive, so the first request after inactivity may be slow. That is normal for free hosting.
