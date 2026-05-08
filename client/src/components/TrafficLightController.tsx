import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info } from 'lucide-react';

const TrafficLightController: React.FC = () => {
  const [currentSignal, setCurrentSignal] = useState<'RED' | 'YELLOW' | 'GREEN'>('RED');
  const [isEmergency, setIsEmergency] = useState(false);
  const [output, setOutput] = useState('STOP');

  // Logic implementation as per Section B, Question 2
  const processSignal = (signal: string, emergency: boolean) => {
    if (emergency) {
      return 'IMMEDIATE GREEN';
    }

    switch (signal) {
      case 'RED': return 'STOP';
      case 'YELLOW': return 'PREPARE TO STOP';
      case 'GREEN': return 'GO';
      default: return 'INVALID SIGNAL';
    }
  };

  useEffect(() => {
    setOutput(processSignal(currentSignal, isEmergency));
  }, [currentSignal, isEmergency]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card"
      style={{ maxWidth: '800px', margin: '0 auto' }}
    >
      <div>
        <h2>Smart Signal Controller</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Automated Traffic Logic (Section B: Q2)</p>
      </div>
      
      <div className="traffic-light-container">
        <div className="light-housing">
          <div className={`light red ${currentSignal === 'RED' && !isEmergency ? 'active' : ''}`}></div>
          <div className={`light yellow ${currentSignal === 'YELLOW' && !isEmergency ? 'active' : ''}`}></div>
          <div className={`light green ${(currentSignal === 'GREEN' || isEmergency) ? 'active' : ''}`}></div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Manual Signal Selection
            </label>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              {(['RED', 'YELLOW', 'GREEN'] as const).map(s => (
                <button 
                  key={s}
                  className="btn btn-outline"
                  style={{ 
                    flex: 1, 
                    justifyContent: 'center',
                    borderColor: currentSignal === s ? (s === 'RED' ? '#ef4444' : s === 'YELLOW' ? '#f59e0b' : '#10b981') : 'var(--border-color)',
                    color: currentSignal === s ? (s === 'RED' ? '#ef4444' : s === 'YELLOW' ? '#f59e0b' : '#10b981') : 'white',
                    background: currentSignal === s ? 'rgba(255,255,255,0.05)' : 'transparent'
                  }}
                  onClick={() => setCurrentSignal(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem', background: 'rgba(255,255,255,0.02)', padding: '1.2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={isEmergency}
                onChange={(e) => setIsEmergency(e.target.checked)}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <span style={{ color: isEmergency ? 'var(--danger)' : 'var(--text-main)', fontWeight: 700, fontSize: '1rem' }}>
                Emergency Vehicle Override
              </span>
            </label>
          </div>

          <AnimatePresence>
            {isEmergency && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="emergency-alert"
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}
              >
                <AlertTriangle size={24} />
                <span>Override Active: Immediate Green</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ background: '#020617', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Logic Output</p>
            <h3 style={{ 
              margin: 0, 
              fontSize: '1.8rem', 
              fontWeight: 800,
              color: output.includes('GREEN') || output === 'GO' ? '#10b981' : output === 'STOP' ? '#ef4444' : '#f59e0b',
              background: 'none',
              WebkitTextFillColor: 'initial'
            }}>
              {output}
            </h3>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '3rem', padding: '1.2rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
        <div style={{ display: 'flex', gap: '0.8rem', color: 'var(--accent-primary)' }}>
          <Info size={18} />
          <p style={{ fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.4 }}>
            System logic ensures that emergency vehicles trigger an immediate state change, overriding the current manual signal.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TrafficLightController;
