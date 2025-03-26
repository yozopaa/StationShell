const mongoose = require('mongoose');

const entreeStockSchema = new mongoose.Schema({
    DateEntree: { type: Date, required: true }, 
    Quantite: { type: Number, required: true }, 
    PrixAchat: { type: Number, required: true }, 
    IdProduit: {
        type: Number,
        ref: 'Produit',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('EntreeStock', entreeStockSchema);