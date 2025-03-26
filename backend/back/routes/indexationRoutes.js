const express = require('express');
const router = express.Router();
const Indexation = require('../models/Indexation');

// Get all price indexations
router.get('/', async (req, res) => {
    try {
        const indexations = await Indexation.find();
        res.json(indexations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new price indexation
router.post('/', async (req, res) => {
    const indexation = new Indexation(req.body);

    try {
        const newIndexation = await indexation.save();
        res.status(201).json(newIndexation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a specific price indexation by ID
router.get('/:id', async (req, res) => {
    try {
        const indexation = await Indexation.findOne(req.params.id );
        if (indexation) {
            res.json(indexation);
        } else {
            res.status(404).json({ message: 'Price indexation not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a price indexation
router.put('/:id', async (req, res) => {
    try {
        const indexation = await Indexation.findByIdAndUpdate(req.params.id ,req.body,{ new:true,
            runValidators:true});
        if (!indexation) {
            return res.status(404).json({ message: 'Price indexation not found' });
        }

        // Update fields
   

        res.json(indexation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a price indexation
router.delete('/:id', async (req, res) => {
    try {
        const indexation = await Indexation.findByIdAndDelete( req.params.id );
        if (!indexation) {
            return res.status(404).json({ message: 'Price indexation not found' });
        }

        res.json({ message: 'Price indexation deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;