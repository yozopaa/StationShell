const express = require('express');
const router = express.Router();
const Admin = require('../models/adminD');

// Get admin by ID (no authentication needed)
router.get('/:id', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update admin by ID (no authentication needed)
router.put('/:id', async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.password; // No password changes here
    const admin = await Admin.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;