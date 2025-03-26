require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const app = express();

// Connect to Database
mongoose.connect('mongodb+srv://oussamamouatamid1:yozopaaa@cluster0.m1awf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',{
    useNewUrlParser:true, 
    useUnifiedTopology :true
})
// Middleware
app.use(cors({
    origin: '*',  // Allow only this port
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/employes', require('./routes/employeRoutes'));
app.use('/api/stations', require('./routes/stationRoutes')); // Already included
app.use('/api/plannings', require('./routes/planningRoutes'));
app.use('/api/presences', require('./routes/presenceRoutes'));
app.use('/api/affectations', require('./routes/affectationRoutes'));
app.use('/api/pompes', require('./routes/pompeRoutes'));
app.use('/api/produits', require('./routes/produitsRoutes'));
app.use('/api/entreeStocks', require('./routes/entreeStockRoutes'));
app.use('/api/fournisseurs', require('./routes/fournisseurRoutes'));
app.use('/api/services', require('./routes/servicesRoutes'));
app.use('/api/ventes', require('./routes/venteRoutes'));
app.use('/api/venteCarburants', require('./routes/venteCarburantRoutes'));
app.use('/api/citernes', require('./routes/citerneRoutes'));
app.use('/api/indexations', require('./routes/indexationRoutes'));
app.use('/api/auth', require('./routes/authRoutes')); // Ensure this is correct
app.use('/api/admin', require('./routes/adminRoutes'))
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});