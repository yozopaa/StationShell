const express = require('express');
const router = express.Router();
const Employe = require('../models/Employe');

// Get all employees


// Get all employees with populated station field
router.get('/', async (req, res) => {
    try {
        const { stationId } = req.query;
        const query = stationId ? { station: stationId } : {};
        const employes = await Employe.find(query).populate('station');
        res.json(employes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific employee by ID with populated station field
router.get('/:id', async (req, res) => {
    try {
        const employe = await Employe.findById(req.params.id).populate('station');
        if (employe) {
            res.json(employe);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new employee
router.post('/', async (req, res) => {
    const employe = new Employe(req.body);

    try {
        const newEmploye = await employe.save();
        res.status(201).json(newEmploye);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a specific employee by ID


// Update an employee
router.put('/:id', async (req, res) => {
    try {
        const employe = await Employe.findByIdAndUpdate(req.params.id, req.body, {
            new:true,
            runValidators:true
        });
        if (!employe) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json(employe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an employee
router.delete('/:id', async (req, res) => {
    try {
        const employe = await Employe.findByIdAndDelete(req.params.id);
        if (!employe) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Example of a bulk insert endpoint

router.post('/bulk', async (req, res) => {
  try {
    const employees = req.body; // expecting an array of employee objects
    const result = await Employe.insertMany(employees);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;