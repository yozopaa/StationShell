const mongoose = require('mongoose');

const venteCarburantSchema = new mongoose.Schema({
    CompteurDebut: { type: Number, required: true }, 
    CompteurFin: { type: Number, required: true }    
}, { timestamps: true });

module.exports = mongoose.model('VenteCarburant', venteCarburantSchema);