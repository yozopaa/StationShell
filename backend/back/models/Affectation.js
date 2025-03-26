const mongoose = require('mongoose');

const affectationSchema = new mongoose.Schema({
    DateDebut: { type: Date, required: true },
    DateFin: { type: Date }, 
    IdEmploye: {
        type: Number,
        ref: 'Employe', 
        required: true
    },
    IdStation: {
        type: Number,
        ref: 'Station', 
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Affectation', affectationSchema);