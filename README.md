# 🅿️ SmartPark — Smart Parking Management System

A full-stack web application that allows users to find, book, and manage parking slots in real time.

## 🌐 Live Demo

Frontend: https://your-frontend.vercel.app
Backend: https://your-backend.onrender.com

---

## 🚀 Tech Stack

**Frontend**

* React (Vite)
* Tailwind CSS
* Axios

**Backend**

* Node.js
* Express.js
* MongoDB (Mongoose)

**Authentication**

* JWT (JSON Web Tokens)
* bcrypt (password hashing)

---

## ✨ Features

* User authentication (Signup/Login)
* Secure JWT-based authorization
* View multiple parking lots
* Real-time slot availability
* Book parking slots instantly
* Cancel bookings
* “My Bookings” dashboard
* Optimistic UI updates (instant feedback)

---

## 📸 Screenshots

### 🔐 Login Page

(Add your screenshot here)

### 📊 Dashboard

(Add your screenshot here)

---

## 📁 Project Structure

```
smart-parking/
├── backend/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   └── api/
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/HarshitJhajharia/smart-parking.git
cd smart-parking
```

---

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Update `.env`:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=5000
```

Run backend:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

### Backend (.env)

* `MONGO_URI`
* `JWT_SECRET`
* `PORT`

### Frontend (.env)

* `VITE_API_URL`

---

## 🧠 Key Concepts Implemented

* REST API design
* JWT authentication flow
* MongoDB schema relationships (ObjectId + populate)
* MVC architecture (Model-View-Controller)
* Axios interceptors for token handling
* Optimistic UI updates

---

## 💡 Why this project stands out

* Built a complete full-stack application from scratch
* Implemented secure authentication and protected routes
* Designed scalable backend architecture using MVC
* Created responsive UI with real-time interaction
* Demonstrates real-world problem solving

---

## 📌 Future Improvements

* Payment integration
* Admin dashboard
* Real-time updates using WebSockets
* Map-based parking visualization

---

## 👨‍💻 Author

Harshit Jhajharia
GitHub: https://github.com/HarshitJhajharia
