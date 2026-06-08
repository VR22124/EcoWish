import { useActionLogs } from './hooks/useActionLogs';
import { Dashboard } from './components/Dashboard';
import { LogActionForm } from './components/LogActionForm';
import { ActionList } from './components/ActionList';
import { Leaf, AlertCircle } from 'lucide-react';

function App() {
  const { logs, isLoading, error, addLog, deleteLog, setError } = useActionLogs();

  const handleAddLog = async (actionId: string) => {
    try {
      await addLog(actionId);
    } catch {
      // Error is handled inside the hook and set in state
    }
  };

  const handleDeleteLog = async (id: string) => {
    try {
      await deleteLog(id);
    } catch {
      // Error is handled in hook
    }
  };

  return (
    <main>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Leaf color="var(--primary)" size={40} />
        <div>
          <h1 className="header-title" style={{ margin: 0 }}>EcoWish</h1>
          <p style={{ color: 'var(--text-muted)' }}>Track & Reduce Your Carbon Footprint</p>
        </div>
      </header>

      {error && (
        <div 
          className="glass-card" 
          style={{ borderLeft: '4px solid var(--danger)', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} 
          role="alert"
          aria-live="assertive"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle color="var(--danger)" />
            <div>
              <p style={{ color: 'var(--danger)', fontWeight: 600 }}>Error</p>
              <p>{error}</p>
            </div>
          </div>
          <button onClick={() => setError(null)} className="btn btn-danger" style={{ padding: '0.5rem' }} aria-label="Dismiss error">Dismiss</button>
        </div>
      )}

      <div aria-live="polite" aria-busy={isLoading}>
        {isLoading && logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }} role="status">
            <p>Loading your impact data...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
