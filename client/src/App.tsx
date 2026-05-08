import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Edit2, 
  Trash2, 
  RefreshCw,
  Plus,
  Cpu
} from 'lucide-react';
import * as api from './api';
import TrafficLightController from './components/TrafficLightController';
import EmployeeForm from './components/EmployeeForm';

interface Employee {
  employeeId: string;
  name: string;
  email: string;
  department: string;
  salary: number;
  status: string;
}

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [searchId, setSearchId] = useState('');
  const [activeTab, setActiveTab] = useState<'employees' | 'traffic'>('employees');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.getEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchId) {
      fetchEmployees();
      return;
    }
    try {
      const response = await api.getEmployeeById(searchId);
      setEmployees([response.data]);
    } catch (error) {
      alert('Employee not found');
      setEmployees([]);
    }
  };

  const handleAddOrUpdate = async (formData: any) => {
    try {
      if (editingEmployee) {
        await api.updateEmployee(editingEmployee.employeeId, formData);
      } else {
        await api.addEmployee(formData);
      }
      fetchEmployees();
      setIsFormOpen(false);
      setEditingEmployee(null);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Mark this employee as INACTIVE (Soft Delete)?')) {
      try {
        await api.deleteEmployee(id);
        fetchEmployees();
      } catch (error) {
        alert('Error updating status');
      }
    }
  };

  return (
    <div className="app-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4rem' }}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h1>Employee Management System</h1>
          </div>
        </motion.div>

        <nav style={{ display: 'flex', background: 'var(--glass)', padding: '0.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <button 
            className={`btn ${activeTab === 'employees' ? 'btn-primary' : 'btn-outline'}`}
            style={{ border: activeTab === 'employees' ? 'none' : '1px solid transparent' }}
            onClick={() => setActiveTab('employees')}
          >
            <Users size={18} /> Employees
          </button>
          <button 
            className={`btn ${activeTab === 'traffic' ? 'btn-primary' : 'btn-outline'}`}
            style={{ border: activeTab === 'traffic' ? 'none' : '1px solid transparent' }}
            onClick={() => setActiveTab('traffic')}
          >
            <Cpu size={18} /> Traffic Light System
          </button>
        </nav>
      </header>

      <main>
        {activeTab === 'employees' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <div>
                <h2>Active Employee Registry</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Showing all staff with status: ACTIVE</p>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="text" 
                    placeholder="Search by ID..." 
                    style={{ width: '240px', paddingRight: '3rem' }}
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Search 
                    size={18} 
                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', cursor: 'pointer' }}
                    onClick={handleSearch}
                  />
                </div>
                <button className="btn btn-outline" onClick={fetchEmployees} title="Refresh Data">
                  <RefreshCw size={18} />
                </button>
                <button className="btn btn-primary" onClick={() => { setEditingEmployee(null); setIsFormOpen(true); }}>
                  <Plus size={20} /> Add Employee
                </button>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID Reference</th>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Department</th>
                    <th>Salary</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Management</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {employees.map((emp) => (
                      <motion.tr 
                        key={emp.employeeId}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>{emp.employeeId}</td>
                        <td style={{ fontWeight: 600 }}>{emp.name}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{emp.email}</td>
                        <td>{emp.department}</td>
                        <td style={{ fontVariantNumeric: 'tabular-nums' }}>${emp.salary.toLocaleString()}</td>
                        <td>
                          <span className={`status-badge status-${emp.status.toLowerCase()}`}>
                            {emp.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
                            <button className="btn btn-outline" style={{ padding: '0.6rem' }} onClick={() => { setEditingEmployee(emp); setIsFormOpen(true); }}>
                              <Edit2 size={14} />
                            </button>
                            <button className="btn btn-outline" style={{ padding: '0.6rem', color: 'var(--danger)' }} onClick={() => handleDelete(emp.employeeId)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              {employees.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
                  <Users size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <p>No active records found in the database.</p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <TrafficLightController />
        )}
      </main>

      <AnimatePresence>
        {isFormOpen && (
          <EmployeeForm 
            onClose={() => setIsFormOpen(false)} 
            onSubmit={handleAddOrUpdate}
            initialData={editingEmployee}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
