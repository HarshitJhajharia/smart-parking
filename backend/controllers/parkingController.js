const ParkingLot = require('../models/ParkingLot');
const Slot = require('../models/Slot');

// @desc    Get all parking lots with their slots
// @route   GET /api/parking/lots
// @access  Private
const getLots = async (req, res) => {
  try {
    const lots = await ParkingLot.find();

    // For each lot, fetch its slots
    const lotsWithSlots = await Promise.all(
      lots.map(async (lot) => {
        const slots = await Slot.find({ parkingLot: lot._id }).populate('bookedBy', 'name email');
        return {
          ...lot.toObject(),
          slots,
        };
      })
    );

    res.json(lotsWithSlots);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Get a single parking lot with slots
// @route   GET /api/parking/lots/:lotId
// @access  Private
const getLotById = async (req, res) => {
  try {
    const lot = await ParkingLot.findById(req.params.lotId);
    if (!lot) {
      return res.status(404).json({ message: 'Parking lot not found' });
    }

    const slots = await Slot.find({ parkingLot: lot._id }).populate('bookedBy', 'name email');

    res.json({ ...lot.toObject(), slots });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

// @desc    Seed sample data (3 lots with slots) — for demo purposes
// @route   POST /api/parking/seed
// @access  Private
const seedData = async (req, res) => {
  try {
    // Clear existing data
    await ParkingLot.deleteMany({});
    await Slot.deleteMany({});

    const lotsData = [
      { name: 'Lot A — Main Gate', location: 'Near Main Entrance', totalSlots: 10 },
      { name: 'Lot B — Library', location: 'Behind Library Block', totalSlots: 8 },
      { name: 'Lot C — Cafeteria', location: 'Cafeteria Parking Zone', totalSlots: 6 },
    ];

    for (const lotData of lotsData) {
      const lot = await ParkingLot.create(lotData);

      // Create slots for this lot
      const slotDocs = [];
      for (let i = 1; i <= lotData.totalSlots; i++) {
        slotDocs.push({
          slotNumber: `${lot.name.split(' ')[1]}${i}`, // e.g., "A1", "B3"
          parkingLot: lot._id,
          isOccupied: false,
          bookedBy: null,
        });
      }
      await Slot.insertMany(slotDocs);
    }

    res.json({ message: '✅ Sample data seeded successfully! 3 parking lots created.' });
  } catch (error) {
    res.status(500).json({ message: 'Seed error: ' + error.message });
  }
};

module.exports = { getLots, getLotById, seedData };
