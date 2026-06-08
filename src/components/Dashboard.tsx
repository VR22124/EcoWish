import React, { useMemo } from 'react';
import type { ActionLog } from '../types';
import { Leaf, Award, TrendingDown } from 'lucide-react';

interface DashboardProps {
  logs: ActionLog[];
}

export const Dashboard: React.FC<DashboardProps> = React.memo(({ logs }) => {
  const totalCarbonSaved = useMemo(() => {
    return logs.reduce((acc, log) => acc + Number(log.carbon_saved_kg), 0);
  }, [logs]);

  const treeEquivalent = useMemo(() => {
    // A mature tree absorbs about 21kg of CO2 per year.
    return (totalCarbonSaved / 21).toFixed(2);
  }, [totalCarbonSaved]);

  return (
    <div className="grid-layout">
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Leaf color="var(--primary)" size={48} style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.2rem', fontWeight: 500 }}>Total CO₂ Saved</h2>
        <p className="stat-value">{totalCarbonSaved.toFixed(1)} <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>kg</span></p>
        <p style={{ color: 'var(--text-muted)' }}>Equivalent to planting {treeEquivalent} trees!</p>
      </div>

      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Award color="var(--primary)" size={48} style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.2rem', fontWeight: 500 }}>Actions Taken</h2>
        <p className="stat-value">{logs.length}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
          <TrendingDown size={20} />
          <span>Keep it up!</span>
        </div>
      </div>
    </div>
  );
});
