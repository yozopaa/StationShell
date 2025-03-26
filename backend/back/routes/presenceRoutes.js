const express = require('express');
const router = express.Router();
const Presence = require('../models/Presence');

// Get all presence records (with populated employee data)
router.get('/', async (req, res) => {
    try {
        const presences = await Presence.find()
            .populate('IdEmploye', 'NomEmploye PrenomEmploye'); // Populate employee name
        res.json(presences);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new presence record
router.post('/', async (req, res) => {
    const presence = new Presence(
        req.body);

    try {
        const newPresence = await presence.save();
        res.status(201).json(newPresence);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a specific presence record by ID (with populated employee data)
router.get('/:id', async (req, res) => {
    try {
        const presence = await Presence.findOne( req.params.id)
            .populate('IdEmploye', 'NomEmploye PrenomEmploye');
        if (presence) {
            res.json(presence);
        } else {
            res.status(404).json({ message: 'Presence record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a presence record
router.put('/:id', async (req, res) => {
    try {
        const presence = await Presence.findByIdAndUpdate(req.params.id ,req.body,{ new:true,
            runValidators:true});
        if (!presence) {
            return res.status(404).json({ message: 'Presence record not found' });
        }

  
        res.json(presence);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a presence record
router.delete('/:id', async (req, res) => {
    try {
        const presence = await Presence.findByIdAndDelete( req.params.id);
        if (!presence) {
            return res.status(404).json({ message: 'Presence record not found' });
        }

    
        res.json({ message: 'Presence record deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;