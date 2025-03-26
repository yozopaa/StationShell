const mongoose = require('mongoose');

const indexationSchema = new mongoose.Schema({
    DateDebut: { type: Date, required: true },     
    DateFin: { type: Date },                       
    PrixVentePrev: { type: Number, required: true } 
}, { timestamps: true });

module.exports = mongoose.model('Indexation', indexationSchema);