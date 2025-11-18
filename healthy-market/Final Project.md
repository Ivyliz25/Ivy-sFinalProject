🌱 Healthy Market – Sustainable Marketplace Platform

A full-stack MERN application that promotes eco-friendly trading, tracks carbon emissions, reduces waste, and connects traders with consumers who value sustainability.

This platform includes:

🔐 User authentication (Admin + Trader)

🛒 Marketplace for healthy/eco-friendly products

♻️ Carbon Emission & Waste Tracking System

📊 Admin & Trader Dashboards

🔎 Product Inspection System

⚙️ Automated Cron Jobs

🌐 Fully decoupled frontend & backend

🚀 Live Tech Stack
Frontend

React (Vite)

React Router

Axios

TailwindCSS (optional)

Context API / LocalStorage for auth

Backend

Node.js + Express

MongoDB + Mongoose

JWT Authentication

Bcrypt Password Hashing

Cron Jobs (node-cron)

CORS enabled

📁 Project Structure
healthy-market/
│── client/               # React frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env
│
│── server/               # Express backend
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── config/
│   │   ├── jobs/
│   │   └── index.js
│   └── .env
│
└── README.md

🔐 Authentication System
Roles:

Admin

Trader

Each receives a JWT token after login.

Routes are protected using auth.js middleware.

🌍 Sustainability Features
✔ 1. Carbon Emission Tracking

Each trader logs their CO₂ emissions:

Transport

Packaging

Production

Stored in EmissionLog model.

✔ 2. Waste Tracking

Traders can also submit waste logs.

Stored in WasteLog.

✔ 3. Eco Analytics

Admins can view sustainability reports:

Highest emitters

Most eco-friendly traders

Monthly emission changes

✔ 4. Product Eco Score

Each product can show:

Carbon badge

Emission rating

Waste score (future)

🛒 Marketplace Features

Create & view products

Inspect product details

Link products to specific traders

Browse trader marketplace

📊 Dashboards
Trader Dashboard:

View your own products

Add new products

View your emission logs

Manage your eco profile

Admin Dashboard:

Manage all traders

View environmental analytics

System insights

Monitor platform emissions

🔌 Environment Variables
Backend .env
PORT=5000
MONGO_URI=mongodb://localhost:27017/healthy-market
JWT_SECRET=your_secret_key
LOG_LEVEL=info
SENTRY_DSN=

Frontend .env
VITE_API_URI=http://localhost:5000/api

⚙️ API Endpoints
Auth
Method	Endpoint	Description
POST	/api/auth/register	Create new user
POST	/api/auth/login	Login user
Products
Method	Endpoint	Description
GET	/api/products	Get all products
POST	/api/products	Add new product (auth)
Traders
Method	Endpoint	Description
GET	/api/traders	Get all traders
GET	/api/traders/:id	Get trader profile
Analytics
Method	Endpoint	Description
GET	/api/analytics	Sustainability analytics (auth)
🛠 Installation & Setup
1️⃣ Install dependencies

Backend:

cd server
npm install


Frontend:

cd client
npm install

2️⃣ Start backend
cd server
npm run dev

3️⃣ Start frontend
cd client
npm run dev


Frontend will run on:
👉 http://localhost:5173/

Backend runs on:
👉 http://localhost:5000/

🎯 What this app is for

Healthy Market is designed to:

✔ Promote eco-friendly commerce
✔ Connect sustainable traders with conscious consumers
✔ Allow every trader to track their environmental impact
✔ Provide admin-level environmental oversight
✔ Serve as a full modern MERN project with real-world utility

👩‍💻 Author

Ivy
Full-stack Developer(MERN)