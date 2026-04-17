import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import Toast from '../components/Toast'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)
  const [tab, setTab] = useState('active') // 'active' | 'cancelled'
  const [toast, setToast] = useState({ message: '', type: 'success' })

  const showToast = (message, type = 'success') => setToast({ message, type })
  const clearToast = () => setToast({ message: '', type: 'success' })

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get('/bookings/my')
        setBookings(data)
      } catch (err) {
        showToast('Failed to load bookings', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const handleCancel = async (bookingId) => {
    setCancellingId(bookingId)
    clearToast()

    // Optimistic UI: update immediately
    setBookings((prev) =>
      prev.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' } : b))
    )

    try {
      await api.put(`/bookings/cancel/${bookingId}`)
      showToast('Booking cancelled. The slot is now free.', 'success')
    } catch (err) {
      // Revert on failure
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: 'active' } : b))
      )
      showToast(err.response?.data?.message || 'Cancellation failed', 'error')
    } finally {
      setCancellingId(null)
    }
  }

  const filteredBookings = bookings.filter((b) => b.status === tab)
  const activeCount = bookings.filter((b) => b.status === 'active').length
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500 mt-1">View and manage all your parking reservations</p>
        </div>

        <Toast message={toast.message} type={toast.type} onClose={clearToast} />

        {/* Stats Row */}
        {!loading && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-green-600">{activeCount}</p>
              <p className="text-sm text-gray-500 mt-1">Active Bookings</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-gray-400">{cancelledCount}</p>
              <p className="text-sm text-gray-500 mt-1">Cancelled</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl border border-gray-200 p-1 shadow-sm w-fit">
          {['active', 'cancelled'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg font-semibold capitalize text-sm transition ${
                tab === t
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {t} ({t === 'active' ? activeCount : cancelledCount})
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3 animate-pulse">📋</div>
            <p className="text-gray-400">Loading your bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <div className="text-5xl mb-4">{tab === 'active' ? '🅿️' : '📭'}</div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">
              No {tab} bookings
            </h3>
            <p className="text-gray-400 text-sm mb-5">
              {tab === 'active'
                ? "You don't have any active bookings. Head to the dashboard to book a slot."
                : "You haven't cancelled any bookings yet."}
            </p>
            {tab === 'active' && (
              <Link
                to="/dashboard"
                className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition"
              >
                Book a Slot →
              </Link>
            )}
          </div>
        ) : (
          /* Bookings List */
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className={`bg-white rounded-2xl border shadow-sm p-5 transition ${
                  booking.status === 'cancelled'
                    ? 'border-gray-200 opacity-70'
                    : 'border-gray-200 hover:border-green-300 hover:shadow'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Booking Info */}
                  <div className="flex gap-4 items-start">
                    {/* Slot number badge */}
                    <div className={`text-center rounded-xl px-3 py-2 min-w-[60px] ${
                      booking.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      <p className="text-xl font-bold">{booking.slot?.slotNumber}</p>
                      <p className="text-xs font-medium">Slot</p>
                    </div>

                    <div>
                      <p className="font-bold text-gray-900 text-lg">{booking.parkingLot?.name}</p>
                      <p className="text-gray-500 text-sm">📍 {booking.parkingLot?.location}</p>
                      <p className="text-gray-400 text-xs mt-2">
                        🕐 Booked: {formatDate(booking.bookedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Right: Status + Cancel */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        booking.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {booking.status === 'active' ? '● Active' : '✕ Cancelled'}
                    </span>

                    {booking.status === 'active' && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="text-sm bg-red-50 hover:bg-red-100 border border-red-200 text-red-600
                          px-4 py-1.5 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-wait"
                      >
                        {cancellingId === booking._id ? '⏳ Cancelling...' : 'Cancel Booking'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
