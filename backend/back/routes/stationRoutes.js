const express = require('express');
const router = express.Router();
const Station = require('../models/Station');

// Get all stations
router.get('/', async (req, res) => {
    try {
        const stations = await Station.find();
        res.json(stations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new station
router.post('/', async (req, res) => {
    const station = new Station(req.body);

    try {
        const newStation = await station.save();
        res.status(201).json(newStation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a specific station by ID
router.get('/:id', async (req, res) => {
    try {
      console.log('Fetching station with id:', req.params.id);
      const station = await Station.findById(req.params.id);
      if (station) {
        res.json(station);
      } else {
        res.status(404).json({ message: 'Station not found' });
      }
    } catch (error) {
      console.error('Error fetching station:', error.message);
      res.status(500).json({ message: error.message });
    }
  });
// Update a station
router.put('/:id', async (req, res) => {
    try {
        const station = await Station.findByIdAndUpdate(req.params.id ,req.body,{ new:true,
            runValidators:true});;
        if (!station) {
            return res.status(404).json({ message: 'Station not found' });
        }

        // Update fields
   
        res.json(station);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a station
router.delete('/:id', async (req, res) => {
    try {
        const station = await Station.findByIdAndDelete( req.params.id );
        if (!station) {
            return res.status(404).json({ message: 'Station not found' });
        }

        res.json({ message: 'Station deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;