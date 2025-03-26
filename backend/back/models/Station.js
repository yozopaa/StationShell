const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
    NomStation: { type: String, required: true },       
    AdresseStation: { type: String, required: true },   
    VilleStation: { type: String, required: true },     
    TelephoneStation: { type: String, required: true }, 
    EmailStation: { type: String },    
    StatusStation : {type:String}                  
}, { timestamps: true });

module.exports = mongoose.model('Station', stationSchema);