import React, { useMemo } from 'react';
import type { ActionLog } from '../types';
import { Leaf, Award, TrendingDown } from 'lucide-react';

interface DashboardProps {
  logs: ActionLog[];
}

export const Dashboard: React.FC<DashboardProps> = React.memo(({ logs }) => {
  const totalCarbonSaved = useMemo(
    () => logs.reduce((acc, log) => acc + Number(log.carbon_saved_kg), 0),
    [logs]
  );

  const treeEquivalent = useMemo(
    () => (totalCarbonSaved / 21).toFixed(2),
    [totalCarbonSaved]
  );

  return (
    <div className="grid-layout">
      <div className="glass-card stat-card">
        <Leaf color="var(--primary)" size={48} className="stat-icon" aria-hidden="true" />
        <h2 className="stat-heading">Total CO₂ Saved</h2>
        <p
          className="stat-value"
          aria-label={`Total CO2 saved: ${totalCarbonSaved.toFixed(1)} kilograms`}
        >
          {totalCarbonSaved.toFixed(1)}{' '}
          <span className="stat-unit">kg</span>
        </p>
        <p className="stat-footnote">Equivalent to planting {treeEquivalent} trees!</p>
      </div>

      <div className="glass-card stat-card">
        <Award color="var(--primary)" size={48} className="stat-icon" aria-hidden="true" />
        <h2 className="stat-heading">Actions Taken</h2>
        <p
          className="stat-value"
          aria-label={`Total actions taken: ${logs.length}`}
        >
          {logs.length}
        </p>
        <div className="stat-trending">
          <TrendingDown size={20} aria-hidden="true" />
          <span>Keep it up!</span>
        </div>
      </div>
    </div>
  );
});
