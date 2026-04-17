import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import SlotCard from '../components/SlotCard'
import Toast from '../components/Toast'

export default function Dashboard() {
  const { user } = useAuth()
  const [lots, setLots] = useState([])
  const [selectedLotId, setSelectedLotId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingSlotId, setBookingSlotId] = useState(null) // Which slot is currently being booked
  const [toast, setToast] = useState({ message: '', type: 'success' })
  const [seeding, setSeeding] = useState(false)

  const showToast = (message, type = 'success') => setToast({ message, type })
  const clearToast = () => setToast({ message: '', type: 'success' })

  const fetchLots = useCallback(async () => {
    try {
      const { data } = await api.get('/parking/lots')
      setLots(data)
      // Select first lot by default (only on first load)
      setSelectedLotId((prev) => prev || (data[0]?._id ?? null))
    } catch (err) {
      showToast('Failed to load parking data', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLots()
  }, [fetchLots])

  const handleSeed = async () => {
    setSeeding(true)
    try {
      const { data } = await api.post('/parking/seed')
      showToast(data.message, 'success')
      setSelectedLotId(null) // Reset selection so first lot gets picked
      await fetchLots()
    } catch (err) {
      showToast('Failed to seed data: ' + (err.response?.data?.message || ''), 'error')
    } finally {
      setSeeding(false)
    }
  }

  const handleBook = async (slotId) => {
    setBookingSlotId(slotId)
    clearToast()

    // ---- Optimistic UI: update state immediately before API responds ----
    setLots((prev) =>
      prev.map((lot) => ({
        ...lot,
        slots: lot.slots.map((s) =>
          s._id === slotId
            ? { ...s, isOccupied: true, bookedBy: { _id: user._id } }
            : s
        ),
      }))
    )

    try {
      const { data } = await api.post(`/bookings/book/${slotId}`)
      showToast(`✅ Slot booked successfully! (${data.booking?.slot?.slotNumber})`, 'success')
    } catch (err) {
      // Revert optimistic update on failure
      setLots((prev) =>
        prev.map((lot) => ({
          ...lot,
          slots: lot.slots.map((s) =>
            s._id === slotId ? { ...s, isOccupied: false, bookedBy: null } : s
          ),
        }))
      )
      showToast(err.response?.data?.message || 'Booking failed', 'error')
    } finally {
      setBookingSlotId(null)
    }
  }

  const selectedLot = lots.find((l) => l._id === selectedLotId)
  const freeCount = selectedLot?.slots?.filter((s) => !s.isOccupied).length ?? 0
  const totalCount = selectedLot?.slots?.length ?? 0
  const occupancyPercent = totalCount > 0 ? Math.round(((totalCount - freeCount) / totalCount) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Parking Dashboard</h1>
            <p className="text-gray-500 mt-1">Select a lot and click a free slot to book it</p>
          </div>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400
              text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition shadow-sm"
          >
            {seeding ? '⏳ Seeding...' : '🌱 Seed Sample Data'}
          </button>
        </div>

        {/* Toast notification */}
        <Toast message={toast.message} type={toast.type} onClose={clearToast} />

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="text-4xl mb-3 animate-pulse">🅿️</div>
              <p className="text-gray-400">Loading parking lots...</p>
            </div>
          </div>
        ) : lots.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
            <div className="text-6xl mb-4">🏗️</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No parking lots yet</h3>
            <p className="text-gray-400 mb-6">Click "Seed Sample Data" above to create 3 demo parking lots with slots.</p>
            <button
              onClick={handleSeed}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold transition"
            >
              🌱 Seed Now
            </button>
          </div>
        ) : (
          <div className="flex gap-6 items-start">

            {/* ---- Sidebar: Lot Selector ---- */}
            <div className="w-64 flex-shrink-0 space-y-3">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Parking Lots</h2>
              {lots.map((lot) => {
                const free = lot.slots?.filter((s) => !s.isOccupied).length ?? 0
                const total = lot.slots?.length ?? 0
                const isSelected = lot._id === selectedLotId
                return (
                  <button
                    key={lot._id}
                    onClick={() => setSelectedLotId(lot._id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition shadow-sm ${
                      isSelected
                        ? 'bg-gray-900 border-green-500 text-white shadow-md'
                        : 'bg-white border-gray-200 text-gray-800 hover:border-green-300 hover:shadow'
                    }`}
                  >
                    <p className="font-semibold text-sm">{lot.name}</p>
                    <p className={`text-xs mt-0.5 ${isSelected ? 'text-gray-400' : 'text-gray-500'}`}>
                      📍 {lot.location}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        free === 0
                          ? 'bg-red-100 text-red-600'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {free} free
                      </span>
                      <span className={`text-xs ${isSelected ? 'text-gray-400' : 'text-gray-400'}`}>
                        {total} total
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* ---- Main: Slot Grid ---- */}
            {selectedLot && (
              <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                {/* Lot header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedLot.name}</h2>
                    <p className="text-gray-500 text-sm">📍 {selectedLot.location}</p>
                  </div>
                  {/* Occupancy stats */}
                  <div className="flex gap-4 text-center">
                    <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                      <p className="text-2xl font-bold text-green-600">{freeCount}</p>
                      <p className="text-xs text-green-700 font-medium">Available</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2">
                      <p className="text-2xl font-bold text-red-500">{totalCount - freeCount}</p>
                      <p className="text-xs text-red-600 font-medium">Occupied</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
                      <p className="text-2xl font-bold text-gray-700">{occupancyPercent}%</p>
                      <p className="text-xs text-gray-500 font-medium">Full</p>
                    </div>
                  </div>
                </div>

                {/* Occupancy bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Occupancy</span>
                    <span>{occupancyPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        occupancyPercent > 80 ? 'bg-red-500' : occupancyPercent > 50 ? 'bg-yellow-400' : 'bg-green-500'
                      }`}
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mb-5 text-xs font-medium text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-green-400 inline-block"></span> Available — click to book
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-red-400 inline-block"></span> Occupied
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-blue-400 inline-block"></span> Booked by you
                  </span>
                </div>

                {/* Slot Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-3">
                  {selectedLot.slots?.map((slot) => (
                    <SlotCard
                      key={slot._id}
                      slot={slot}
                      onBook={handleBook}
                      isBooking={bookingSlotId === slot._id}
                      currentUserId={user?._id}
                    />
                  ))}
                </div>

                {selectedLot.slots?.length === 0 && (
                  <p className="text-center text-gray-400 py-8">No slots in this lot.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
