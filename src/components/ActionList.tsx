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
      <div className="glass-card empty-state">
        <p className="empty-state-text">No actions logged yet. Start reducing your footprint today!</p>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <h3 className="section-heading">Recent Actions</h3>
      <ul className="action-list" aria-label="Logged eco-friendly actions">
        {logs.map((log) => (
          <li key={log.id} className="action-item">
            <div>
              <div className="action-item-title">{log.action_title}</div>
              <div className="action-item-meta">
                <span className="action-item-meta-date">
                  <Calendar size={14} aria-hidden="true" />
                  {format(new Date(log.created_at), 'MMM d, yyyy h:mm a')}
                </span>
                <span className="action-item-co2">
                  -{log.carbon_saved_kg} kg CO₂
                </span>
              </div>
            </div>
            <button
              onClick={() => onDeleteLog(log.id)}
              className="btn btn-danger btn-icon"
              aria-label={`Delete log for ${log.action_title}`}
            >
              <Trash2 size={18} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
});
