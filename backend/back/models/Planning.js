// models/Planning.js
const mongoose = require('mongoose');

const planningSchema = new mongoose.Schema({
  Date: { type: String, required: true },
  Hdebut: { type: String, required: true },
  HFin: { type: String, required: true },
  Employee: { type: String, required: true },
  Presence: { type: Boolean, required: true }, // Boolean type
  station: { type: mongoose.Schema.Types.ObjectId, ref: 'Station', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Planning', planningSchema);