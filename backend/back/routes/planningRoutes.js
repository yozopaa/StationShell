const express = require('express');
const router = express.Router();
const planning = require('../models/Planning');

// Get all pumps
router.get('/', async (req, res) => {
    try {
        const Plannings = await planning.find().populate('station');
        res.json(Plannings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Create a new pump
router.post('/', async (req, res) => {
    const Planning = new planning(req.body);

    try {
        const newPlanning = await Planning.save();
        res.status(201).json(newPlanning);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Get a specific pump by ID
router.get('/:id', async (req, res) => {
    try {
        const Planning = await planning.findOne( req.params.id );
        if (Planning) {
            res.json(Planning);
        } else {
            res.status(404).json({ message: 'Pump not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a pump
router.put('/:id', async (req, res) => {
    try {
        const Planning = await planning.findByIdAndUpdate(req.params.id ,req.body,{ new:true,
            runValidators:true});
        if (!Planning) {
            return res.status(404).json({ message: 'Pump not found' });
        }

        // Update field


        res.json(Planning);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a pump
router.delete('/:id', async (req, res) => {
    try {
        const Planning = await planning.findByIdAndDelete(req.params.id );
        if (!Planning) {
            return res.status(404).json({ message: 'Pump not found' });
        }

        res.json({ message: 'Pump deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/bulk', async (req, res) => {
  try {
    const Plannings = req.body; // expecting an array of employee objects
    const result = await planning.insertMany(Plannings);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  } 
});

module.exports = router;