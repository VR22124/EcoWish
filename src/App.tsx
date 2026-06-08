import { useCallback } from 'react';
import { useActionLogs } from './hooks/useActionLogs';
import { Dashboard } from './components/Dashboard';
import { LogActionForm } from './components/LogActionForm';
import { ActionList } from './components/ActionList';
import { Leaf, AlertCircle } from 'lucide-react';

function App() {
  const { logs, isLoading, error, addLog, deleteLog, setError } = useActionLogs();

  const handleAddLog = useCallback(async (actionId: string) => {
    try {
      await addLog(actionId);
    } catch {
      // Error is already set in hook state
    }
  }, [addLog]);

  const handleDeleteLog = useCallback(async (id: string) => {
    try {
      await deleteLog(id);
    } catch {
      // Error is already set in hook state
    }
  }, [deleteLog]);

  return (
    <main>
      <header className="app-header">
        <Leaf color="var(--primary)" size={40} aria-hidden="true" />
        <div className="app-header-content">
          <h1 className="header-title">EcoWish</h1>
          <p className="header-subtitle">Track &amp; Reduce Your Carbon Footprint</p>
        </div>
      </header>

      {error && (
        <div
          className="glass-card error-banner"
          role="alert"
          aria-live="assertive"
        >
          <div className="error-banner-body">
            <AlertCircle color="var(--danger)" aria-hidden="true" />
            <div>
              <p className="error-title">Error</p>
              <p>{error}</p>
            </div>
          </div>
          <button
            onClick={() => setError(null)}
            className="btn btn-danger btn-icon"
            aria-label="Dismiss error"
          >
            Dismiss
          </button>
        </div>
      )}

      <div aria-live="polite" aria-busy={isLoading}>
        {isLoading && logs.length === 0 ? (
          <div className="loading-state" role="status">
            <p>Loading your impact data...</p>
          </div>
        ) : (
          <div className="content-column">
            <Dashboard logs={logs} />

            <div className="grid-layout">
              <LogActionForm onAddLog={handleAddLog} />
              <ActionList logs={logs} onDeleteLog={handleDeleteLog} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
