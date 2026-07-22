# Nexora AI

Nexora AI is a modern student productivity and learning management web application built with React on the frontend and Node.js/Express on the backend. It helps students plan their academic life with tasks, assignments, attendance tracking, exams, notes, goals, reminders, analytics, and an AI assistant powered by Groq.

## Overview

Nexora AI combines a polished student dashboard with practical academic tools so users can:

- manage daily tasks and deadlines
- track assignments, exams, and attendance
- save notes and study goals
- receive reminders and notifications
- use an AI assistant for study planning and productivity suggestions
- access admin tools for managing app content and users

## Key Features

### Student Experience
- Landing page with product overview and onboarding flow
- Secure authentication with login, registration, password recovery, and email verification
- Guided onboarding for first-time users
- Personalized dashboard with productivity metrics
- Task manager with priorities and deadlines
- Assignment tracker with due dates and study planning
- Attendance tracking with subject-wise progress and warnings
- Exam and calendar-based planning
- Notes and reminders system
- Analytics and progress tracking
- Pomodoro timer for focused study sessions
- AI assistant for productivity and study support

### Admin Features
- Admin-only dashboard and access controls
- User oversight and administrative management tools

### AI Capabilities
- Groq-backed AI assistant
- Study planning suggestions
- Assignment and deadline prioritization
- Attendance analysis and productivity summaries
- Saved AI chat history for ongoing support

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Framer Motion
- React Router DOM
- Zustand for state management
- Lucide icons
- Recharts for analytics visuals

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Nodemailer for email flows
- Cloudinary for media uploads
- Groq API integration
- CORS and environment-based config

## Project Structure

```text
.
├── src/                    # React frontend app
│   ├── components/         # Reusable UI and layout components
│   ├── hooks/              # Custom React hooks
│   ├── layouts/            # App shell and page structure
│   ├── pages/              # Main app pages
│   ├── services/           # API and app services
│   ├── store/              # Zustand store
│   └── utils/              # Helpers and utilities
├── server/                 # Backend API
│   ├── src/                # Express server source code
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth and error middleware
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── services/       # Email, AI, and admin services
│   │   └── utils/          # Token and helper utilities
│   └── package.json
├── public/                 # Static assets
├── DEPLOYMENT.md           # Deployment notes
└── package.json            # Frontend scripts and dependencies
```

## Requirements

Before you run the application, make sure you have:

- Node.js installed (preferably version 18 or newer)
- npm installed
- MongoDB running locally or a MongoDB Atlas URI
- A Groq API key for AI features
- Optional: Cloudinary credentials and SMTP credentials for uploads and email

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd "Student NEXORA AI"
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
cd ..
```

## Environment Configuration

Create a backend environment file in the server folder:

```bash
cd server
Copy-Item .env.example .env
```

If you are using PowerShell, the command above is correct. On Linux or macOS, use:

```bash
cp .env.example .env
```

Then update the values in the new `.env` file.

### Required environment variables

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/nexora_ai
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CLIENT_URL=http://127.0.0.1:5173
ALLOWED_ORIGINS=http://127.0.0.1:5173,http://localhost:5173
CONTACT_TO_EMAIL=your-email@example.com
SMTP_EMAIL=your-smtp-email
SMTP_PASS=your-smtp-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
GROQ_API_KEY=your-groq-api-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
```

> The backend will fail to start without a valid MongoDB connection string and JWT secrets.

## Running the Application Locally

### Start the frontend

From the project root:

```bash
npm run dev
```

This starts the Vite app on port 5173.

### Start the backend

In a second terminal:

```bash
cd server
npm run dev
```

The backend will start on port 5000 by default.

### Health check

Once the backend is running, verify it here:

```bash
http://localhost:5000/api/health
```

Expected response:

```json
{ "ok": true, "service": "nexora-ai-api" }
```

## Production Build

### Build the frontend

```bash
npm run build
```

### Preview the frontend build locally

```bash
npm run preview
```

### Start the backend in production mode

```bash
cd server
npm start
```

## API Overview

The server exposes REST APIs for:

- authentication and user management
- tasks
- assignments
- attendance
- exams
- notes
- goals
- notifications
- AI assistant
- admin operations
- contact form submissions

You can reach the backend base URL at:

```text
http://localhost:5000
```

## Deployment

This project is prepared for deployment using a frontend hosting service such as Vercel and a backend service such as Render.

### Recommended deployment setup
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Media storage: Cloudinary
- Email delivery: SMTP / Gmail

For the full deployment checklist and environment setup, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Contributing

Contributions are welcome. If you want to improve the app:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Open a pull request

## License

This project is intended for educational and personal use. Please review repository licensing before using it in a commercial setting.
- Database: MongoDB Atlas
- File storage: Cloudinary
- Email: SMTP service

For full deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Troubleshooting

### MongoDB connection issues
- Confirm that `MONGODB_URI` is correct
- Make sure MongoDB is reachable from your environment
- If using Atlas, ensure your IP address is allowed

### Frontend cannot reach backend
- Confirm the backend is running on port 5000
- Verify `CLIENT_URL` and `ALLOWED_ORIGINS`
- Check that your frontend is using the correct API base URL

### AI features not working
- Make sure `GROQ_API_KEY` is set in the server environment
- Confirm the backend has access to the internet and the Groq API

## Notes

Nexora AI is designed as a student-focused productivity tool. The experience is intentionally personalized and adaptive, with features that help users organize their academics, stay on top of deadlines, and improve study habits using both structured tracking and AI assistance.

## License

This project is for educational and personal use unless a separate license is provided.
