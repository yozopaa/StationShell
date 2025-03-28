const express = require('express');
const router = express.Router();
const Vente = require('../models/Vente');

// Get all sales
router.get('/', async (req, res) => {
    try {
      const { stationId } = req.query; // Optional query parameter
      const query = stationId ? { station: stationId } : {};
      // Populate both station and ProduitNom fields
      const ventes = await Vente.find(query)
        .populate('station')
        .populate('ProduitNom');
      res.json(ventes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// Create a new sale
router.post('/', async (req, res) => {
    const vente = new Vente(req.body);
    try {
        const newVente = await vente.save();
        res.status(201).json(newVente);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a specific sale by ID
router.get('/:id', async (req, res) => {
    try {
        const vente = await Vente.findById(req.params.id);
        if (vente) {
            res.json(vente);
        } else {
            res.status(404).json({ message: 'Sale not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a sale
router.put('/:id', async (req, res) => {
    try {
        const vente = await Vente.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!vente) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        res.json(vente);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a sale
router.delete('/:id', async (req, res) => {
    try {
        const vente = await Vente.findByIdAndDelete(req.params.id);
        if (!vente) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        res.json({ message: 'Sale deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Bulk insert endpoint
router.post('/bulk', async (req, res) => {
  try {
    const ventes = req.body; // Expecting an array of sale objects
    const result = await Vente.insertMany(ventes);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;