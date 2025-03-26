const express = require('express');
const router = express.Router();
const Produit = require('../models/Produits');

// Get all products
router.get('/', async (req, res) => {
    try {
        const { stationId } = req.query;
        const query = stationId ? { station: stationId } : {};
        const Produitss = await Produit.find(query).populate('station');
        res.json(Produitss);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new product
router.post('/', async (req, res) => {
    const produit = new Produit(req.body);

    try {
        const newProduit = await produit.save();
        res.status(201).json(newProduit);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a specific product by ID
router.get('/:id', async (req, res) => {
    try {
        const produit = await Produit.findOne(req.params.id );
        if (produit) {
            res.json(produit);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a product
router.put('/:id', async (req, res) => {
    try {
        const produit = await Produit.findByIdAndUpdate(req.params.id ,req.body,{ new:true,
            runValidators:true});;
        if (!produit) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update fields
       
        res.json(produit);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a product
router.delete('/:id', async (req, res) => {
    try {
        const produit = await Produit.findByIdAndDelete( req.params.id );
        if (!produit) {
            return res.status(404).json({ message: 'Product not found' });
        }

        
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/bulk', async (req, res) => {
  try {
    const Produits = req.body; // expecting an array of employee objects
    const result = await Produit.insertMany(Produits);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;