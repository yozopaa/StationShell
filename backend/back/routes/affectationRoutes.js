const express = require('express');
const router = express.Router();
const Affectation = require('../models/Affectation');

router.get('/', async (req, res) => {
    try {
        const affectations = await Affectation.find()
            .populate('IdEmploye', 'NomEmploye PrenomEmploye') 
            .populate('IdStation', 'NomStation');            
        res.json(affectations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    const affectation = new Affectation({
        IdAffectation: req.body.IdAffectation,
        DateDebut: req.body.DateDebut,
        DateFin: req.body.DateFin,
        IdEmploye: req.body.IdEmploye,
        IdStation: req.body.IdStation
    });

    try {
        const newAffectation = await affectation.save();
        res.status(201).json(newAffectation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const affectation = await Affectation.findOne({ IdAffectation: req.params.id })
            .populate('IdEmploye', 'NomEmploye PrenomEmploye')
            .populate('IdStation', 'NomStation');
        if (affectation) {
            res.json(affectation);
        } else {
            res.status(404).json({ message: 'Affectation not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const affectation = await Affectation.findOne({ IdAffectation: req.params.id });
        if (!affectation) {
            return res.status(404).json({ message: 'Affectation not found' });
        }

        Object.keys(req.body).forEach(key => {
            affectation[key] = req.body[key];
        });

        const updatedAffectation = await affectation.save();
        res.json(updatedAffectation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const affectation = await Affectation.findOne({ IdAffectation: req.params.id });
        if (!affectation) {
            return res.status(404).json({ message: 'Affectation not found' });
        }

        await Affectation.deleteOne({ IdAffectation: req.params.id });
        res.json({ message: 'Affectation deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;