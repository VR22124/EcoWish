import React, { useState } from 'react';
import { ECO_ACTIONS } from '../constants/actions';
import { PlusCircle } from 'lucide-react';

interface LogActionFormProps {
  onAddLog: (actionId: string) => Promise<void>;
}

export const LogActionForm: React.FC<LogActionFormProps> = React.memo(({ onAddLog }) => {
  const [selectedActionId, setSelectedActionId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActionId) return;

    const action = ECO_ACTIONS.find(a => a.id === selectedActionId);
    if (!action || action.carbon_saved_kg <= 0) return;

    setIsSubmitting(true);
    try {
      await onAddLog(selectedActionId);
      setSelectedActionId('');
    } catch (error) {
      console.error('Error adding log:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card">
      <h3 className="form-card-heading">Log a New Action</h3>
      <form onSubmit={handleSubmit} className="form-stack">
        <div>
          <label htmlFor="action-select" className="input-label">
            Select Eco-friendly Action
          </label>
          <select
            id="action-select"
            value={selectedActionId}
            onChange={(e) => setSelectedActionId(e.target.value)}
            className="input-field"
            required
          >
            <option value="" disabled>Select an action...</option>
            {ECO_ACTIONS.map(action => (
              <option key={action.id} value={action.id}>
                {action.title} (~{action.carbon_saved_kg} kg CO₂ saved)
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="btn"
          disabled={!selectedActionId || isSubmitting}
          aria-busy={isSubmitting}
        >
          <PlusCircle size={20} aria-hidden="true" />
          {isSubmitting ? 'Logging...' : 'Log Action'}
        </button>
      </form>
    </div>
  );
});
