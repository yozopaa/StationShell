const mongoose = require('mongoose');

const venteSchema = new mongoose.Schema({
    EmployeeVente: { type: String, required: true },  
    PrixVente: { type: Number, required: true },  
    TypeVente: { type: String, required: true },  
    ProduitNom: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Produit', 
        required: true 
    }  ,
    QuantiteVente: { type: Number, required: true },  
    DateVente: { type: Date, required: true },       
    ModePaiement: { type: String, required: true },    
    station: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Station', 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Vente', venteSchema);