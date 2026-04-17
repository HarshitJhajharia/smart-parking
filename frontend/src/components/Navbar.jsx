import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-green-400 hover:text-green-300">
          <span className="text-2xl">🅿️</span>
          <span>SmartPark</span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          <Link
            to="/dashboard"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              isActive('/dashboard')
                ? 'bg-green-500 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            🏠 Dashboard
          </Link>
          <Link
            to="/my-bookings"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              isActive('/my-bookings')
                ? 'bg-green-500 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            📋 My Bookings
          </Link>
        </div>

        {/* User info + logout */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2 rounded-lg font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
