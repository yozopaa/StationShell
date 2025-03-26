const mongoose = require('mongoose');

const produitsSchema = new mongoose.Schema({
    NomProduit: { type: String, required: true }, 
    Type: { type: String, required: true },       
    Date_ajout: { type: Date, required: true },   
    Unite: { type: String, required: true },
      station: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Station', 
            required: true 
        }       
}, { timestamps: true });

module.exports = mongoose.model('Produit', produitsSchema);