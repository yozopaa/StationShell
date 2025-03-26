const express = require('express');
const router = express.Router();
const Fournisseur = require('../models/Fournisseur');

// Get all suppliers
router.get('/', async (req, res) => {
    try {
        const fournisseurs = await Fournisseur.find();
        res.json(fournisseurs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new supplier
router.post('/', async (req, res) => {
    const fournisseur = new Fournisseur(req.body);

    try {
        const newFournisseur = await fournisseur.save();
        res.status(201).json(newFournisseur);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a specific supplier by ID
router.get('/:id', async (req, res) => {
    try {
        const fournisseur = await Fournisseur.findOne(req.params.id );
        if (fournisseur) {
            res.json(fournisseur);
        } else {
            res.status(404).json({ message: 'Supplier not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a supplier
router.put('/:id', async (req, res) => {
    try {
        const fournisseur = await Fournisseur.findByIdAndUpdate(req.params.id ,req.body,{ new:true,
            runValidators:true});;
        if (!fournisseur) {
            return res.status(404).json({ message: 'Supplier not found' });
        }


       
        res.json(fournisseur);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a supplier
router.delete('/:id', async (req, res) => {
    try {
        const fournisseur = await Fournisseur.findByIdAndDelete( req.params.id );
        if (!fournisseur) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.json({ message: 'Supplier deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/bulk', async (req, res) => {
  try {
    const Fournisseurs = req.body; // expecting an array of employee objects
    const result = await Fournisseur.insertMany(Fournisseurs);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;