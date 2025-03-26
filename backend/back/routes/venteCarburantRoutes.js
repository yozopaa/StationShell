const express = require('express');
const router = express.Router();
const VenteCarburant = require('../models/VenteCarburant');

// Get all fuel sales
router.get('/', async (req, res) => {
    try {
        const ventesCarburant = await VenteCarburant.find().populate('station');
        res.json(ventesCarburant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Create a new fuel sale
router.post('/', async (req, res) => {
    const venteCarburant = new VenteCarburant(req.body);

    try {
        const newVenteCarburant = await venteCarburant.save();
        res.status(201).json(newVenteCarburant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a specific fuel sale by ID
router.get('/:id', async (req, res) => {
    try {
        const venteCarburant = await VenteCarburant.findOne( req.params.id );
        if (venteCarburant) {
            res.json(venteCarburant);
        } else {
            res.status(404).json({ message: 'Fuel sale not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a fuel sale
router.put('/:id', async (req, res) => {
    try {
        const venteCarburant = await VenteCarburant.findByIdAndUpdate(req.params.id ,req.body,{ new:true,
            runValidators:true});;
        if (!venteCarburant) {
            return res.status(404).json({ message: 'Fuel sale not found' });
        }

        // Update fields
        res.json(venteCarburant);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a fuel sale
router.delete('/:id', async (req, res) => {
    try {
        const venteCarburant = await VenteCarburant.findByIdAndDelete( req.params.id );
        if (!venteCarburant) {
            return res.status(404).json({ message: 'Fuel sale not found' });
        }

        res.json({ message: 'Fuel sale deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;