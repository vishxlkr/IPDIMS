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

### For User

<img width="1919" height="1079" alt="Screenshot 2025-12-02 013344" src="https://github.com/user-attachments/assets/fe860409-84b2-4ab3-91a6-27c1fe22412c" />
<img width="1583" height="827" alt="Screenshot 2025-12-02 013409" src="https://github.com/user-attachments/assets/4e755927-e503-44a0-a3f1-3e56fc6eaf3f" />
<img width="1919" height="1079" alt="Screenshot 2025-12-02 013506" src="https://github.com/user-attachments/assets/8c8b6fed-cb2c-4bd9-a9df-ee57c1b8b894" />
<img width="1919" height="1079" alt="Screenshot 2025-12-02 013510" src="https://github.com/user-attachments/assets/ca2e256b-8c39-484a-a1df-0b33ee23d954" />

### For Admin

<img width="1501" height="871" alt="Screenshot 2025-12-02 014348" src="https://github.com/user-attachments/assets/56e2da64-5ecb-4e4f-a1ea-eda6ced8ec9a" />
<img width="1919" height="1079" alt="Screenshot 2025-12-02 013420" src="https://github.com/user-attachments/assets/5fb43d6e-42b5-4908-b627-973ed24e2fb3" />
<img width="1919" height="1079" alt="Screenshot 2025-12-02 013425" src="https://github.com/user-attachments/assets/4a502397-fb9a-4b91-b383-97639eef6d00" />
<img width="1919" height="1079" alt="Screenshot 2025-12-02 013432" src="https://github.com/user-attachments/assets/f6df3b43-c79b-4cb8-aec1-e43780a32a57" />
<img width="1919" height="1079" alt="Screenshot 2025-12-02 013436" src="https://github.com/user-attachments/assets/e3fe943c-7ab8-4945-bd02-13e49f723c56" />
<img width="1919" height="1079" alt="Screenshot 2025-12-02 013439" src="https://github.com/user-attachments/assets/563fbb31-5000-4a69-b40b-feb2431c3b4b" />

### For Reviewer

<img width="1534" height="865" alt="Screenshot 2025-12-02 014354" src="https://github.com/user-attachments/assets/804ccbce-9677-4698-bc7b-bc0a0cde610a" />
<img width="1919" height="1079" alt="Screenshot 2025-12-02 013556" src="https://github.com/user-attachments/assets/b31e70bd-8d56-413a-a239-3e8618210499" />
<img width="1919" height="1079" alt="Screenshot 2025-12-02 013600" src="https://github.com/user-attachments/assets/40fec5db-c745-4c03-8ce0-b3beb0e52562" />
<img width="1911" height="1068" alt="Screenshot 2025-12-02 013604" src="https://github.com/user-attachments/assets/b90a61fe-f9e2-4049-8047-de3b9a69a23d" />

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
