const mongoose = require('mongoose');

const employeSchema = new mongoose.Schema({
    CINEmploye: { 
        type: String, 
        required: true,
        trim: true
    },       
    NomEmploye: { 
        type: String, 
        required: true,
        trim: true
    },       
    PrenomEmploye: { 
        type: String, 
        required: true,
        trim: true
    },    
    AdresseEmploye: { 
        type: String, 
        required: true,
        trim: true
    },   
    TelephoneEmploye: { 
        type: String, 
        required: true,
        trim: true
    }, 
    DateNaissance: { 
        type: Date, 
        required: true
    },      
    DateEmbauche: { 
        type: Date, 
        required: true
    },       
    Poste: { 
        type: String, 
        required: true,
        trim: true
    },           
    Status: { 
        type: String, 
        required: true,
        enum: ['Active', 'Inactive', 'Quitter'],
        default: 'Active'
    },
    station: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Station', 
        required: true 
    }
}, { 
    timestamps: true,
    versionKey: false 
});

module.exports = mongoose.model('Employe', employeSchema);