const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data.json');

const getDB = () => {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({ employees: [] }));
    }
    const data = fs.readFileSync(DB_FILE);
    return JSON.parse(data);
};

const saveDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

module.exports = {
    find: async (query = {}) => {
        const db = getDB();
        return db.employees.filter(emp => {
            return Object.keys(query).every(key => emp[key] === query[key]);
        });
    },
    findOne: async (query) => {
        const db = getDB();
        return db.employees.find(emp => {
            // Handle simple non-operator queries
            return Object.keys(query).every(key => {
                if (typeof query[key] === 'object' && query[key] !== null) {
                    // Skip complex operators for now
                    return true;
                }
                return emp[key] === query[key];
            });
        });
    },
    create: async (employeeData) => {
        const db = getDB();
        const newEmployee = { ...employeeData, _id: Date.now().toString() };
        db.employees.push(newEmployee);
        saveDB(db);
        return newEmployee;
    },
    findOneAndUpdate: async (query, updateData, options) => {
        const db = getDB();
        const index = db.employees.findIndex(emp => {
            return Object.keys(query).every(key => emp[key] === query[key]);
        });
        if (index === -1) return null;
        db.employees[index] = { ...db.employees[index], ...updateData };
        saveDB(db);
        return db.employees[index];
    }
};
