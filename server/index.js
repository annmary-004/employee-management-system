const express = require('express');
const cors = require('cors');
require('dotenv').config();

const employeeRoutes = require('./routes/employee.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body);
    next();
});

// Routes
app.use('/api/employees', employeeRoutes);

// Server Start (Using local JSON storage as primary for reliability in this environment)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Data is being stored locally in server/data.json`);
});
