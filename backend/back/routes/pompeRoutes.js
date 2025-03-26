const express = require('express');
const router = express.Router();
const Pompe = require('../models/Pompe');

// Get all pumps
router.get('/', async (req, res) => {
    try {
        const { stationId } = req.query;
        const query = stationId ? { station: stationId } : {};
        const Pompes = await Pompe.find(query).populate('station');        
        res.json(Pompes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new pump
router.post('/', async (req, res) => {
    const pompe = new Pompe(req.body);

    try {
        const newPompe = await pompe.save();
        res.status(201).json(newPompe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a specific pump by ID
router.get('/:id', async (req, res) => {
    try {
        const pompe = await Pompe.findOne( req.params.id );
        if (pompe) {
            res.json(pompe);
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
        const pompe = await Pompe.findByIdAndUpdate(req.params.id ,req.body,{ new:true,
            runValidators:true});
        if (!pompe) {
            return res.status(404).json({ message: 'Pump not found' });
        }

        res.json(pompe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a pump
router.delete('/:id', async (req, res) => {
    try {
        const pompe = await Pompe.findByIdAndDelete(req.params.id );
        if (!pompe) {
            return res.status(404).json({ message: 'Pump not found' });
        }
        res.json({ message: 'Pump deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/bulk', async (req, res) => {
  try {
    const Pompes = req.body; // expecting an array of employee objects
    const result = await Pompe.insertMany(Pompes);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;