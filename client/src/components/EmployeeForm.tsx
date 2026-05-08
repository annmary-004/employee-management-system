import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, UserCheck } from 'lucide-react';

interface EmployeeFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData: any;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    department: '',
    salary: '',
    status: 'ACTIVE'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(2, 6, 23, 0.9)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(8px)'
    }}>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="glass-card"
        style={{ width: '100%', maxWidth: '550px', position: 'relative', background: '#111a27' }}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ background: 'var(--accent-primary)', padding: '0.6rem', borderRadius: '10px' }}>
            <UserCheck size={24} color="#052e16" />
          </div>
          <h2>{initialData ? 'Update Record' : 'Create Staff Record'}</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label>Employee ID</label>
              <input 
                type="text" 
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
                disabled={!!initialData}
                placeholder="EMP-XXX"
              />
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter name"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="name@organization.com"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label>Department</label>
              <select name="department" value={formData.department} onChange={handleChange} required>
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Operations">Operations</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Product Design">Product Design</option>
                <option value="Sales & Marketing">Sales & Marketing</option>
              </select>
            </div>
            <div className="form-group">
              <label>Base Salary (USD)</label>
              <input 
                type="number" 
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Employment Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="ACTIVE">ACTIVE (Full Permission)</option>
              <option value="INACTIVE">INACTIVE (Restricted)</option>
            </select>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
              <Save size={18} /> {initialData ? 'Commit Changes' : 'Register Employee'}
            </button>
            <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EmployeeForm;
