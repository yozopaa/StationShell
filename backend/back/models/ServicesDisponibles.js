const mongoose = require('mongoose');

const servicesDisponiblesSchema = new mongoose.Schema({
    NomService: { type: String, required: true },      
    Description: { type: String, required: true },     
    Horaires: { type: String, required: true }         
}, { timestamps: true });

module.exports = mongoose.model('ServiceDisponible', servicesDisponiblesSchema);