const mongoose = require('mongoose');

const presenceSchema = new mongoose.Schema({
    Semaine: { type: Number, required: true },       
    Jour: { type: Number, required: true },           
    Hdebut: { type: String, required: true },         
    HFin: { type: String, required: true },           
    Annee: { type: Number, required: true },          
    IdEmploye: {                                      
        type: Number,
        ref: 'Employe',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Presence', presenceSchema);