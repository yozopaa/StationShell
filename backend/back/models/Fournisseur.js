const mongoose = require('mongoose');

const fournisseurSchema = new mongoose.Schema({
    NomFournisseur: { type: String, required: true },       
    AdresseFournisseur: { type: String, required: true },  
    TelephoneFournisseur: { type: String, required: true },
    EmailFournisseur: { type: String },                    
    VilleFournisseur: { type: String, required: true },    
    ContactFournisseur: { type: String }                   
}, { timestamps: true });

module.exports = mongoose.model('Fournisseur', fournisseurSchema);