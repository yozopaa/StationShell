const express = require('express');
const router = express.Router();
const Citerne = require('../models/Citerne');

// Get all tanks
router.get('/', async (req, res) => {
    try {
      const citernes = await Citerne.find().populate('station');
      res.json(citernes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
// Create a new tank
router.post('/', async (req, res) => {
    const citerne = new Citerne(req.body);

    try {
        const newCiterne = await citerne.save();
        res.status(201).json(newCiterne);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a specific tank by ID
router.get('/:id', async (req, res) => {
    try {
        const citerne = await Citerne.findOne(req.params.id);
        if (citerne) {
            res.json(citerne);
        } else {
            res.status(404).json({ message: 'Tank not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a tank
router.put('/:id', async (req, res) => {
    try {
        const citerne = await Citerne.findByIdAndUpdate(req.params.id ,req.body,{ new:true,
            runValidators:true});
        if (!citerne) {
            return res.status(404).json({ message: 'Tank not found' });
        }

        // Update field


        res.json(citerne);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a tank
router.delete('/:id', async (req, res) => {
    try {
        const citerne = await Citerne.findByIdAndDelete(req.params.id);
        if (!citerne) {
            return res.status(404).json({ message: 'Tank not found' });
        }
        res.json({ message: 'Tank deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/bulk', async (req, res) => {
    try {
      const Citernes = req.body; // expecting an array of employee objects
      const result = await Citerne.insertMany(Citernes);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
module.exports = router;