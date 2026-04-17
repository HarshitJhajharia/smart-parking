// SlotCard — shows a single parking slot
// Props:
//   slot: { _id, slotNumber, isOccupied }
//   onBook: function(slotId)
//   isBooking: boolean (is this specific slot being booked right now?)
//   currentUserId: string (to highlight slots booked by current user)

export default function SlotCard({ slot, onBook, isBooking, currentUserId }) {
  const isMine = slot.bookedBy && slot.bookedBy._id === currentUserId
  const isFree = !slot.isOccupied

  let bgClass = ''
  let label = ''
  let emoji = ''
  let cursor = 'cursor-not-allowed'

  if (isBooking) {
    bgClass = 'bg-yellow-100 border-yellow-300 text-yellow-700'
    label = 'Booking...'
    emoji = '⏳'
    cursor = 'cursor-wait'
  } else if (isMine) {
    bgClass = 'bg-blue-100 border-blue-300 text-blue-800'
    label = 'Mine'
    emoji = '🔵'
    cursor = 'cursor-not-allowed'
  } else if (slot.isOccupied) {
    bgClass = 'bg-red-100 border-red-200 text-red-700'
    label = 'Taken'
    emoji = '🔴'
    cursor = 'cursor-not-allowed'
  } else {
    bgClass = 'bg-green-50 border-green-300 text-green-800 hover:bg-green-500 hover:text-white hover:border-green-500 hover:scale-105'
    label = 'Free'
    emoji = '🟢'
    cursor = 'cursor-pointer'
  }

  return (
    <button
      onClick={() => isFree && !isBooking && onBook(slot._id)}
      disabled={!isFree || isBooking}
      title={isFree ? `Click to book slot ${slot.slotNumber}` : `Slot ${slot.slotNumber} is ${isMine ? 'booked by you' : 'occupied'}`}
      className={`
        border-2 rounded-xl p-3 text-center transform transition-all duration-150
        ${bgClass} ${cursor}
        disabled:transform-none
      `}
    >
      <div className="text-lg font-bold">{slot.slotNumber}</div>
      <div className="text-lg mt-1">{isBooking ? '⏳' : emoji}</div>
      <div className="text-xs font-medium mt-1">{isBooking ? 'Booking...' : label}</div>
    </button>
  )
}
