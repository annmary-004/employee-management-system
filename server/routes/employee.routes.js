const express = require('express');
const router = express.Router();
const Employee = require('../mockDb');

// Add Employee
router.post('/', async (req, res) => {
    try {
        const { employeeId, name, email, department, salary, status } = req.body;
        
        // Check if email already exists
        const existingEmail = await Employee.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Check if employeeId already exists
        const existingId = await Employee.findOne({ employeeId });
        if (existingId) {
            return res.status(400).json({ message: 'Employee ID already exists' });
        }

        const newEmployee = await Employee.create({
            employeeId,
            name,
            email,
            department,
            salary,
            status: status || 'ACTIVE'
        });

        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch All Active Employees
router.get('/', async (req, res) => {
    try {
        const activeEmployees = await Employee.find({ status: 'ACTIVE' });
        res.json(activeEmployees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Fetch Employee by ID (using custom employeeId)
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findOne({ employeeId: req.params.id });
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Employee
router.put('/:id', async (req, res) => {
    try {
        const { name, email, department, salary, status } = req.body;
        
        // Check email uniqueness if email is being updated
        if (email) {
            const existing = await Employee.findOne({ email });
            if (existing && existing.employeeId !== req.params.id) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }

        const updatedEmployee = await Employee.findOneAndUpdate(
            { employeeId: req.params.id },
            { name, email, department, salary, status },
            { new: true, runValidators: true }
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Employee (Soft Delete)
router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employee.findOneAndUpdate(
            { employeeId: req.params.id },
            { status: 'INACTIVE' },
            { new: true }
        );
        
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        
        res.json({ message: 'Employee marked as INACTIVE', employee });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
