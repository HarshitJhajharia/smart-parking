const Booking = require('../models/Booking');
const Slot = require('../models/Slot');

// @desc    Book an available slot
// @route   POST /api/bookings/book/:slotId
// @access  Private
const bookSlot = async (req, res) => {
  const { slotId } = req.params;

  try {
    // Find the slot
    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    // Check if already occupied
    if (slot.isOccupied) {
      return res.status(400).json({ message: 'This slot is already occupied' });
    }

    // Mark slot as occupied
    slot.isOccupied = true;
    slot.bookedBy = req.user._id;
    await slot.save();

    // Create a booking record
    const booking = await Booking.create({
      user: req.user._id,
      slot: slot._id,
      parkingLot: slot.parkingLot,
    });

    // Populate details for the response
    await booking.populate([
      { path: 'slot', select: 'slotNumber' },
      { path: 'parkingLot', select: 'name location' },
    ]);

    res.status(201).json({
      message: 'Slot booked successfully!',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Cancel a booking (frees the slot)
// @route   PUT /api/bookings/cancel/:bookingId
// @access  Private
const cancelBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only the user who booked can cancel
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Mark booking as cancelled
    booking.status = 'cancelled';
    await booking.save();

    // Free the slot
    const slot = await Slot.findById(booking.slot);
    if (slot) {
      slot.isOccupied = false;
      slot.bookedBy = null;
      await slot.save();
    }

    res.json({ message: 'Booking cancelled successfully', bookingId });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get all bookings for the logged-in user
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('slot', 'slotNumber isOccupied')
      .populate('parkingLot', 'name location')
      .sort({ createdAt: -1 }); // Newest first

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = { bookSlot, cancelBooking, getMyBookings };
