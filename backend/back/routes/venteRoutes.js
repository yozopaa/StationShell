const express = require('express');
const router = express.Router();
const Vente = require('../models/Vente');

// Get all sales
router.get('/', async (req, res) => {
    try {
      const { stationId } = req.query; // Optional query parameter
      const query = stationId ? { station: stationId } : {};
      const ventes = await Vente.find(query).populate('station');
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
        const vente = await Vente.findOne(req.params.id);
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
        const vente = await Vente.findByIdAndUpdate(req.params.id ,req.body,{ new:true,
            runValidators:true});
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
        const vente = await Vente.findByIdAndDelete( req.params.id);
        if (!vente) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        res.json({ message: 'Sale deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Example of a bulk insert endpoint


router.post('/bulk', async (req, res) => {
  try {
    const Ventes = req.body; // expecting an array of employee objects
    const result = await Vente.insertMany(Ventes);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;