import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { ActionLog } from '../types';
import { ECO_ACTIONS } from '../constants/actions';

export const useActionLogs = () => {
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error: dbError } = await supabase
        .from('action_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;
      setLogs(data || []);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch logs');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const addLog = async (actionId: string) => {
    const actionDef = ECO_ACTIONS.find(a => a.id === actionId);
    if (!actionDef) return;

    try {
      setError(null);
      const { data, error: dbError } = await supabase
        .from('action_logs')
        .insert([{
          action_title: actionDef.title,
          category: actionDef.category,
          carbon_saved_kg: actionDef.carbon_saved_kg
        }])
        .select()
        .single();

      if (dbError) throw dbError;
      
      // Update local state directly instead of re-fetching (Efficiency)
      if (data) {
        setLogs(prev => [data, ...prev]);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error saving action');
      }
      throw err;
    }
  };

  const deleteLog = async (id: string) => {
    try {
      setError(null);
      const { error: dbError } = await supabase
        .from('action_logs')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;
      
      setLogs(prevLogs => prevLogs.filter(log => log.id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error deleting action');
      }
      throw err;
    }
  };

  return { logs, isLoading, error, setError, addLog, deleteLog };
};
