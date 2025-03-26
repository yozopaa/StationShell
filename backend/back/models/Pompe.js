const mongoose = require('mongoose');

const pompeSchema = new mongoose.Schema({
    Numero: { type: String, required: true }, 
    Statut: { type: String, required: true }, 
    Debit: { type: Number, required: true },
    Employee: { type: String, required: true },
    NombrePistole: { type: Number, required: true },   
    station: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Station', 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Pompe', pompeSchema);