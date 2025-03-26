const express = require('express');
const router = express.Router();
const ServiceDisponible = require('../models/ServicesDisponibles');

// Get all available services
router.get('/', async (req, res) => {
    try {
        const services = await ServiceDisponible.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new service
router.post('/', async (req, res) => {
    const service = new ServiceDisponible(req.body);

    try {
        const newService = await service.save();
        res.status(201).json(newService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a specific service by ID
router.get('/:id', async (req, res) => {
    try {
        const service = await ServiceDisponible.findOne( req.params.id );
        if (service) {
            res.json(service);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a service
router.put('/:id', async (req, res) => {
    try {
        const service = await ServiceDisponible.findByIdAndUpdate(req.params.id ,req.body,{ new:true,
            runValidators:true});
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Update fields
     
        res.json(service);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a service
router.delete('/:id', async (req, res) => {
    try {
        const service = await ServiceDisponible.findByIdAndDelete(req.params.id );
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json({ message: 'Service deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;