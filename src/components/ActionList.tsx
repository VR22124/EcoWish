import React from 'react';
import type { ActionLog } from '../types';
import { Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface ActionListProps {
  logs: ActionLog[];
  onDeleteLog: (id: string) => Promise<void>;
}

export const ActionList: React.FC<ActionListProps> = React.memo(({ logs, onDeleteLog }) => {
  if (logs.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>No actions logged yet. Start reducing your footprint today!</p>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>Recent Actions</h3>
      <div className="action-list">
        {logs.map((log) => (
          <div key={log.id} className="action-item">
            <div>
              <div className="action-item-title">{log.action_title}</div>
              <div className="action-item-meta">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={14} />
                  {format(new Date(log.created_at), 'MMM d, yyyy h:mm a')}
                </span>
                <span style={{ color: 'var(--primary)', fontWeight: 500 }}>
                  -{log.carbon_saved_kg} kg CO₂
                </span>
              </div>
            </div>
            <button 
              onClick={() => onDeleteLog(log.id)}
              className="btn btn-danger"
              style={{ padding: '0.5rem', borderRadius: '50%' }}
              aria-label={`Delete log for ${log.action_title}`}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});
