const mongoose = require('mongoose');

const citerneSchema = new mongoose.Schema({
    Capacite: { type: Number, required: true },         
    DateInstallation: { type: Date, required: true },   
    TypeCarburant: { type: String, required: true },    
    Statut: { type: String, required: true },         
    station: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Station', 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Citerne', citerneSchema);