# 🅿️ SmartPark — Full-Stack Parking Management System

A full-stack web application for managing parking lots, booking slots, and tracking reservations.

**Tech Stack:** React + Vite + Tailwind CSS (Frontend) | Node.js + Express + MongoDB (Backend) | JWT Auth

---

## 📁 Project Structure

```
smart-parking/
├── backend/
│   ├── server.js                   # Express app entry point
│   ├── .env.example                # Copy to .env and fill in values
│   ├── models/
│   │   ├── User.js                 # bcrypt pre-save hook for passwords
│   │   ├── ParkingLot.js           # Lot name, location, totalSlots
│   │   ├── Slot.js                 # slotNumber, isOccupied, bookedBy (ref User)
│   │   └── Booking.js              # user, slot, parkingLot refs + status
│   ├── controllers/
│   │   ├── authController.js       # signup, login, getMe
│   │   ├── parkingController.js    # getLots, getLotById, seedData
│   │   └── bookingController.js    # bookSlot, cancelBooking, getMyBookings
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT protect middleware
│   └── routes/
│       ├── authRoutes.js
│       ├── parkingRoutes.js
│       └── bookingRoutes.js
│
└── frontend/
    ├── index.html
    ├── vite.config.js              # Proxies /api → localhost:5000
    ├── tailwind.config.js
    └── src/
        ├── main.jsx                # App entry point
        ├── App.jsx                 # Routes + PrivateRoute/PublicRoute guards
        ├── index.css               # Tailwind directives
        ├── api/
        │   └── axios.js            # Axios instance with JWT interceptor
        ├── context/
        │   └── AuthContext.jsx     # Global user state, login/logout
        ├── components/
        │   ├── Navbar.jsx          # Top navigation bar
        │   ├── SlotCard.jsx        # Individual slot button (Free/Taken/Mine)
        │   └── Toast.jsx           # Auto-dismiss notification
        └── pages/
            ├── Login.jsx
            ├── Signup.jsx
            ├── Dashboard.jsx       # Lot selector + slot grid + optimistic UI
            └── MyBookings.jsx      # Active/cancelled tabs + cancel booking
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB running locally (or a MongoDB Atlas URI)

### 1. Clone & Setup Backend

```bash
cd smart-parking/backend
npm install
cp .env.example .env
```

Edit `.env`:
```
MONGO_URI=mongodb://localhost:27017/smart-parking
JWT_SECRET=pick_any_long_random_string_here
PORT=5000
```

Start backend:
```bash
npm run dev     # uses nodemon for auto-restart
```
→ API running at http://localhost:5000

### 2. Setup Frontend

```bash
cd smart-parking/frontend
npm install
npm run dev
```
→ App running at http://localhost:3000

### 3. Seed Demo Data

1. Open http://localhost:3000
2. Sign up for an account
3. On the Dashboard, click **"🌱 Seed Sample Data"**
4. This creates 3 parking lots with 24 total slots

---

## 🗺️ API Reference

### Auth Routes (`/api/auth`)
| Method | Endpoint    | Auth | Description            |
|--------|-------------|------|------------------------|
| POST   | `/signup`   | ❌   | Register new user      |
| POST   | `/login`    | ❌   | Login, returns JWT     |
| GET    | `/me`       | ✅   | Get current user info  |

### Parking Routes (`/api/parking`)
| Method | Endpoint         | Auth | Description                    |
|--------|------------------|------|--------------------------------|
| GET    | `/lots`          | ✅   | All lots + their slots         |
| GET    | `/lots/:lotId`   | ✅   | Single lot with slots          |
| POST   | `/seed`          | ✅   | Seed 3 demo lots (resets data) |

### Booking Routes (`/api/bookings`)
| Method | Endpoint              | Auth | Description               |
|--------|-----------------------|------|---------------------------|
| POST   | `/book/:slotId`       | ✅   | Book a free slot          |
| PUT    | `/cancel/:bookingId`  | ✅   | Cancel booking, free slot |
| GET    | `/my`                 | ✅   | Get my bookings           |

---

## 🧠 Key Concepts for Resume

### 1. MongoDB Schema Design with ObjectId Relations
```js
// Slot.js — references User and ParkingLot
bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
parkingLot: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingLot' }

// Used with .populate() in queries:
await Booking.find({ user: req.user._id })
  .populate('slot', 'slotNumber')
  .populate('parkingLot', 'name location')
```

### 2. JWT Authentication Flow
```
Signup/Login → Server returns JWT token
→ Frontend stores token in localStorage
→ Axios interceptor attaches token to every request header: "Authorization: Bearer <token>"
→ Backend authMiddleware verifies token on protected routes
```

### 3. Optimistic UI (instant updates without waiting for API)
```js
// In Dashboard.jsx — update state BEFORE the API responds
setLots(prev => prev.map(lot => ({
  ...lot,
  slots: lot.slots.map(s =>
    s._id === slotId ? { ...s, isOccupied: true } : s
  )
})))
// Then call the API, and revert if it fails
```

### 4. MVC Pattern
- **Models** — Mongoose schemas (data layer)
- **Controllers** — Business logic (what to do with requests)
- **Routes** — URL mapping (which controller handles which route)

---

## ✅ Features Checklist

- [x] User signup and login with JWT
- [x] Password hashing with bcrypt (pre-save hook)
- [x] Protected routes (frontend + backend)
- [x] View all parking lots with slot counts
- [x] Visual slot grid (Free / Taken / Mine states)
- [x] Book an available slot (one-click)
- [x] Optimistic UI — slot updates instantly
- [x] My Bookings page with Active/Cancelled tabs
- [x] Cancel booking — frees the slot immediately
- [x] Seed endpoint for demo data
- [x] Clean MVC folder structure
- [x] Axios interceptor for auto JWT attachment
- [x] Proper ObjectId relations with `.populate()`
