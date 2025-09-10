# Auth System with OTP Verification

A secure full-stack authentication system with signup, login, password reset, and OTP email verification. Built with React, Node.js, Express, MongoDB, and JWT, featuring a responsive UI with in-card loading indicators.

## ✨ Features

-  User signup and login
-  OTP email verification for signup and password reset
-  Password reset with OTP
-  JWT-based authentication for secure access
-  Responsive UI built with Tailwind CSS
-  In-card loading indicators during API requests

## 🛠️ Tech Stack

-  **Frontend:** React, Tailwind CSS
-  **Backend:** Node.js, Express
-  **Database:** MongoDB
-  **Authentication:** JWT, Nodemailer

## ⚙️ Installation

To get a local copy up and running, follow these simple steps.

1. **Clone the repository**

   ```sh
   git clone https://github.com/vishxlkr/AuthSystem-OTP.git
   cd AuthSystem-OTP
   ```

2. **Setup Server**

   ```sh
   cd server
   npm install
   ```

   Next, create a `.env` file in the `server` directory and fill in your environment variables (see below).

   ```sh
   npm run start
   ```

   (Or `npm run server` if you have that script)

3. **Setup Client**
   ```sh
   cd ../client
   npm install
   ```
   Next, create a `.env` file in the `client` directory (see below).
   ```sh
   npm run dev
   ```
   The app should now be running at `http://localhost:5173` (or the port specified by your Vite config).

## 🔑 Environment Variables

Create a `.env` file in the **server** directory and add the following configuration:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173

# Email credentials for Nodemailer (e.g., using Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

You will also need to create a `.env` file in the **client** directory for the API URL:

```
VITE_API_URL=http://localhost:5000
```

## 📸 Screenshots

<img width="1919" height="1079" alt="Screenshot 2025-09-02 210128" src="https://github.com/user-attachments/assets/fc782413-6598-498f-87ee-cb5099de81b5" />
<img width="1919" height="1079" alt="Screenshot 2025-09-02 210110" src="https://github.com/user-attachments/assets/1957b295-6c77-49a6-b290-2bfb54578eef" />
<img width="1919" height="1079" alt="Screenshot 2025-09-02 210142" src="https://github.com/user-attachments/assets/e2792dbb-0c53-418d-b1e5-c340d3d9d35b" />
<img width="1919" height="1079" alt="Screenshot 2025-09-02 210223" src="https://github.com/user-attachments/assets/5ed70ec4-23b5-4145-b9ce-50034beea7ad" />
<img width="1919" height="1079" alt="Screenshot 2025-09-02 210333" src="https://github.com/user-attachments/assets/645dd6a5-cf5c-4177-95ba-386d3ff27801" />

---
