const express = require('express');
const router = express.Router();
const EntreeStock = require('../models/EntreeStock');

// Get all stock entries (with populated product data)
router.get('/', async (req, res) => {
    try {
        const entrees = await EntreeStock.find()
            .populate('IdProduit', 'NomProduit Unite'); // Populate product name and unit
        res.json(entrees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new stock entry
router.post('/', async (req, res) => {
    const entree = new EntreeStock(req.body);

    try {
        const newEntree = await entree.save();
        res.status(201).json(newEntree);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a specific stock entry by ID (with populated product data)
router.get('/:id', async (req, res) => {
    try {
        const entree = await EntreeStock.findOne( req.params.id )
            .populate('IdProduit', 'NomProduit Unite');
        if (entree) {
            res.json(entree);
        } else {
            res.status(404).json({ message: 'Stock entry not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a stock entry
router.put('/:id', async (req, res) => {
    try {
        const entree = await EntreeStock.findOne( req.params.id );
        if (!entree) {
            return res.status(404).json({ message: 'Stock entry not found' });
        }

        //

        res.json(entree);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a stock entry
router.delete('/:id', async (req, res) => {
    try {
        const entree = await EntreeStock.findByIdAndDelete( req.params.id );
        if (!entree) {
            return res.status(404).json({ message: 'Stock entry not found' });
        }

        
        res.json({ message: 'Stock entry deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;