const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  NomAdmin: { type: String }, // Last name
  PrenomAdmin: { type: String }, // First name
  Email: { type: String, required: true, unique: true },
  Address: { type: String },
  Telephone: { type: String },
  Role: { type: String },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Admin", adminSchema);