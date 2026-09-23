# Ornac - MERN Saree Ecommerce Platform

Production-ready ecommerce platform for an offline saree store with realtime stock updates, admin inventory control, payments, and role-based auth.

## Architecture

- Frontend: React (Vite), Tailwind CSS, Framer Motion
- Backend: Node.js, Express, Socket.IO
- Database: MongoDB Atlas (Mongoose)
- Media: Cloudinary
- Payments: Pluggable provider layer (MOCK active, Razorpay/Stripe placeholders)
- Deploy: Frontend on Vercel, Backend on Render

## Project Structure

```txt
frontend/
  src/
    components/
    pages/
    hooks/
    context/
    services/
    utils/

backend/
  controllers/
  routes/
  models/
  middleware/
  services/
    payment/
  config/
  sockets/
  utils/
  scripts/
```

## Step-by-Step Setup (Local)

## 1) Prerequisites

Install:
- Node.js 20+
- npm 10+
- MongoDB Atlas account
- Cloudinary account
- Razorpay account
- Stripe account

## 2) Clone and install

```bash
git clone <your-repo-url>
cd Ornac

cd backend
npm install

cd ../frontend
npm install
```

From the repository root, you can start both applications together:

```bash
npm run dev
```

If Windows PowerShell says that `npm.ps1` cannot be loaded because script execution
is disabled, use the Windows command shim instead (this does not change your
machine's execution policy):

```powershell
npm.cmd run dev
```

## 3) Configure environment variables

Create `backend/.env` from `backend/.env.example` and fill all values:

```env
PORT=5000
MONGO_URI=...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...

RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...

ADMIN_NAME=Ornac Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=StrongPassword123
ADMIN_PHONE=9999999999
```

Create `frontend/.env` from `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

## 4) Create admin user (recommended best setup)

Run this once from `backend`:

```bash
npm run seed:admin
```

This script is idempotent:
- creates admin if not present
- promotes existing user to admin if needed

## 5) Start backend

From `backend`:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`.

## 6) Start frontend

From `frontend`:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.

## 7) Verify full local flow

- Open the Vite URL printed in the terminal (normally `http://localhost:5173`)
- Confirm `http://localhost:5000/health` returns `{"ok":true,...}` before using the store
- Register/Login
- Login as admin (from seeded email/password)
- Add product from admin dashboard with image upload
- Browse products on storefront
- Place COD and Online Demo (MOCK) orders
- Confirm realtime stock changes in another browser tab

---

## Deployment (Production) - Step by Step

This repository includes [render.yaml](render.yaml), which creates both required Render services:

- `ornaq-api`: Node/Express web service (Free plan)
- `ornaq-web`: Vite static site (Free)

The frontend is static; the API must be a separate web service. Do not deploy the frontend as a Node web service.

## A) Prepare MongoDB Atlas

1. Create an Atlas cluster and a database user.
2. In Atlas Network Access, allow connections from Render. For an initial deploy, `0.0.0.0/0` works; restrict it later if you have Render's fixed outbound IPs on a paid plan.
3. Copy the `mongodb+srv://...` connection string for Render's `MONGO_URI` variable.

## B) Deploy both services with the Blueprint

1. Commit and push this repository to GitHub.
2. In Render, choose **New > Blueprint** and select the repository. Render detects `render.yaml` at the repository root.
3. Enter the values requested for `sync: false` variables. Do not put secrets in Git.
4. Create the Blueprint. Wait for `ornaq-api` to become live, then copy its URL, for example `https://ornaq-api.onrender.com`.
5. Set these frontend variables in the `ornaq-web` service and manually deploy it again:

```env
VITE_API_URL=https://ornaq-api.onrender.com/api
VITE_SOCKET_URL=https://ornaq-api.onrender.com
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

6. Copy the `ornaq-web` URL, then set the API's `CLIENT_URL` to that exact URL, for example `https://ornaq-web.onrender.com`. Redeploy `ornaq-api`.
7. Test `https://ornaq-api.onrender.com/health`, then open the frontend URL.

The backend's required production variables are `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and the three Cloudinary values for image uploads. Configure Google OAuth, Razorpay, OTP, and email variables only for the features you enable. See [backend/.env.example](backend/.env.example) and [frontend/.env.example](frontend/.env.example) for every supported variable.

For Google sign-in, add the final frontend URL as an Authorized JavaScript Origin in Google Cloud Console.

## C) Free-tier behaviour

Render Free web services spin down after 15 minutes without traffic. The first API request after that can take about a minute while it starts; this is expected. The frontend static site does not spin down. Store images in Cloudinary and data in MongoDB Atlas—Render's Free web-service filesystem is temporary.

## D) Payment provider mode (current + future)

Current mode:
- Online checkout uses `MOCK` provider through `backend/services/payment/paymentService.js`
- Simulates 2-3s delay, then random success/failure
- Returns `transactionId` and `paymentStatus`

Future mode:
- Add real integration inside:
  - `backend/services/payment/razorpayProvider.js`
  - `backend/services/payment/stripeProvider.js`
- No controller or frontend contract change needed, just provider implementation and env setup

## E) Post-deploy checklist

- Login/Register works
- Admin page protected by role
- Product image upload works (Cloudinary)
- CSV bulk product upload works from admin dashboard
- Quick stock +/- controls work from admin dashboard
- Stock updates broadcast in realtime
- `orderCreated` and `paymentStatusUpdated` socket events are received on client
- MOCK online payment flow shows both success and failure paths

## Commands

Run these from the repository root after installing dependencies:

```powershell
# Install root and application dependencies (first time only)
npm.cmd install
npm.cmd install --prefix backend
npm.cmd install --prefix frontend

# Start API and frontend together for local development
npm.cmd run dev

# Or start either application separately
npm.cmd run dev:backend
npm.cmd run dev:frontend

# Production build check for the frontend
npm.cmd run build --prefix frontend

# Start the production API locally
npm.cmd run start --prefix backend

# Optional database setup
npm.cmd run seed:admin --prefix backend
npm.cmd run seed:products --prefix backend
```

Use `npm` in Command Prompt, macOS, or Linux. `npm.cmd` avoids PowerShell's local execution-policy block on this Windows machine.

---

## Docker Run (Optional)

From project root:

```bash
docker compose up --build
```

---

## CI

GitHub Actions workflow is available at:

- `.github/workflows/ci.yml`

It installs apps and builds frontend on each push/PR.
