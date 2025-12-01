# IPDIMS – Paper Submission and Review Platform

A full‑stack platform for managing paper submissions, peer review, registration, and admin workflows. The monorepo contains a Node/Express API, a user‑facing React app, and an admin/reviewer React app.

## Structure

-  `server` – Express + MongoDB API (auth, submissions, registrations, admin, reviewer)
-  `client` – User web app (React + Vite)
-  `admin` – Admin/Reviewer web app (React + Vite)

## Tech Stack

-  Backend: Node.js, Express 5, Mongoose, JWT, Multer, Cloudinary, Nodemailer
-  Frontend: React 19, Vite, React Router, Tailwind CSS
-  Database: MongoDB

## Prerequisites

-  Node.js 18+ and npm
-  MongoDB connection string
-  Cloudinary account (for file uploads)
-  SMTP credentials (for OTP and emails)

## Install

From the repository root:

```
cd server && npm install
cd ../client && npm install
cd ../admin && npm install
```

## Environment Variables

Create a `.env` file in each app as shown.

Server (`server/.env`):

```
PORT=4000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>

# Admin login (used for /api/admin/login)
ADMIN_EMAIL=<admin-login-email>
ADMIN_PASSWORD=<admin-login-password>

# Cloudinary
CLOUDINARY_NAME=<cloudinary-cloud-name>
CLOUDINARY_API_KEY=<cloudinary-api-key>
CLOUDINARY_SECRET_KEY=<cloudinary-secret>

# SMTP for Nodemailer
EMAIL_HOST=<smtp-host>        # e.g. smtp.gmail.com
EMAIL_PORT=<smtp-port>        # e.g. 587
EMAIL_USER=<smtp-user>
EMAIL_PASS=<smtp-app-password>
```

Client (`client/.env`):

```
VITE_BACKEND_URL=http://localhost:4000
```

Admin (`admin/.env`):

```
VITE_BACKEND_URL=http://localhost:4000
```

## Screenshots

### User

![User Dashboard](<Screenshot 2025-12-02 013344.png>)
![alt text](<Screenshot 2025-12-02 013409.png>)
![alt text](<Screenshot 2025-12-02 013506-1.png>)
![alt text](<Screenshot 2025-12-02 013510-2.png>)

### Admin

![alt text](<Screenshot 2025-12-02 014348.png>)
![alt text](<Screenshot 2025-12-02 013420.png>)
![alt text](<Screenshot 2025-12-02 013425.png>)
![alt text](<Screenshot 2025-12-02 013432.png>)
![alt text](<Screenshot 2025-12-02 013436.png>)
![alt text](<Screenshot 2025-12-02 013439.png>)

### For Reviewer

![alt text](<Screenshot 2025-12-02 014354.png>)
![alt text](<Screenshot 2025-12-02 013556.png>)
![alt text](<Screenshot 2025-12-02 013600.png>)
![alt text](<Screenshot 2025-12-02 013604.png>)

## Run Locally

Backend API:

```
cd server
npm run server   # dev with nodemon
# or
npm start        # node server.js
```

User App:

```
cd client
npm run dev
# visit the URL printed by Vite (e.g., http://localhost:5173)
```

Admin/Reviewer App:

```
cd admin
npm run dev
# visit the URL printed by Vite (e.g., http://localhost:5174)
```

## API Overview

Base URL: `http://localhost:4000`

User routes (`/api/user`):

-  `POST /signup` – Send OTP to email
-  `POST /verify-otp` – Verify OTP and issue token
-  `POST /login`
-  `POST /forgot-password`
-  `POST /reset-password`
-  `GET /profile` – requires `Authorization: Bearer <token>`
-  `POST /update-profile` – multipart (optional `image`)
-  `POST /add-submission` – multipart (file `attachment`)
-  `GET /my-submissions`
-  `POST /registration` – multipart (file `paymentProof`)

Admin routes (`/api/admin`):

-  `POST /login` – returns admin token (`atoken`)
-  `POST /add-reviewer` – multipart (`image`), auth required
-  `GET /all-reviewer`, `GET /reviewer/:id`, `POST /change-availability/:reviewerId`
-  `GET /submissions`, `GET /submission/:id`, `POST /assign-submission`, `POST /change-submission-status`, `DELETE /submission/:id`
-  `GET /users`, `GET /user/:id`, `GET /user/:id/submissions`, `DELETE /user/:id`
-  `GET /registrations`, `GET /registration/user/:userId`, `DELETE /registrations/:id`, `PUT /mark-feedback-seen/:id`
-  `POST /notify-author`

Reviewer routes (`/api/reviewer`):

-  `POST /login` – returns reviewer token (`rtoken`)
-  `GET /profile`, `PUT /profile`
-  `GET /submissions`, `GET /submissions/:id`
-  `POST /submissions/:id/review`
-  `GET /dashboard`

## Authentication

-  User: send `Authorization: Bearer <token>` header
-  Admin: send `atoken: <admin-token>` header. Token is JWT of `ADMIN_EMAIL + ADMIN_PASSWORD` signed with `JWT_SECRET`.
-  Reviewer: send `rtoken: <reviewer-token>` header

## File Uploads

-  Uses Multer to parse multipart form data
-  Files are uploaded to Cloudinary
   -  Submissions: stored as `resource_type: raw` (PDF/doc/zip)
   -  Profile images: stored as `resource_type: image`

## Email & OTP

-  Nodemailer sends OTP for signup and password reset using the SMTP settings from `server/.env`.

## Scripts

-  Server: `npm run server` (dev), `npm start` (prod)
-  Client/Admin: `npm run dev`, `npm run build`, `npm run preview`

## Production Notes

-  Build frontends: run `npm run build` in `client` and `admin` and deploy the static assets
-  Run the API with a process manager (e.g., PM2) and configure all environment variables
-  Put the API behind a reverse proxy (Nginx/Apache) and enable HTTPS

## License

The server package declares ISC. Adjust or add a project-wide license if needed.
