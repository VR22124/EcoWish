import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { ActionLog } from '../types';
import { ECO_ACTIONS } from '../constants/actions';
import { getAnonymousUserId } from '../utils/auth';

const SELECTED_COLUMNS = 'id, action_title, carbon_saved_kg, category, created_at';

export const useActionLogs = () => {
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      const { data, error: dbError } = await supabase
        .from('action_logs')
        .select(SELECTED_COLUMNS)
        .order('created_at', { ascending: false })
        .limit(100)
        .abortSignal(signal as AbortSignal);

      if (dbError) throw dbError;
      setLogs(data || []);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError('Failed to load your action logs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchLogs(controller.signal);
    return () => controller.abort();
  }, [fetchLogs]);


  const addLog = useCallback(async (actionId: string) => {
    const actionDef = ECO_ACTIONS.find(a => a.id === actionId);
    if (!actionDef) return;

    try {
      setError(null);
      const { data, error: dbError } = await supabase
        .from('action_logs')
        .insert([{
          action_title: actionDef.title,
          category: actionDef.category,
          carbon_saved_kg: actionDef.carbon_saved_kg,
          user_id: getAnonymousUserId()
        }])
        .select(SELECTED_COLUMNS)
        .single();

      if (dbError) throw dbError;

      if (data) {
        setLogs(prev => [data, ...prev]);
      }
    } catch {
      setError('Failed to save your action. Please try again.');
    }
  }, []);

  const deleteLog = useCallback(async (id: string) => {
    try {
      setError(null);
      const { error: dbError } = await supabase
        .from('action_logs')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      setLogs(prevLogs => prevLogs.filter(log => log.id !== id));
    } catch {
      setError('Failed to delete action. Please try again.');
    }
  }, []);

  return { logs, isLoading, error, setError, addLog, deleteLog };
};
