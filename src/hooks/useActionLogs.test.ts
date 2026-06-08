import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useActionLogs } from './useActionLogs';
import { supabase } from '../supabaseClient';

vi.mock('../supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('useActionLogs', () => {
  const mockAction = { id: '1', action_title: 'Test Action', carbon_saved_kg: 1, category: 'Test', created_at: '2026-06-08T10:00:00Z' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes and fetches logs', async () => {
    const mockOrder = vi.fn().mockResolvedValue({ data: [mockAction], error: null });
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
    (supabase.from as any).mockReturnValue({ select: mockSelect });

    const { result } = renderHook(() => useActionLogs());

    expect(result.current.isLoading).toBe(true);
    
    // Wait for the async fetch to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.logs).toEqual([mockAction]);
  });

  it('handles add log', async () => {
    // Setup initial fetch
    const mockOrder = vi.fn().mockResolvedValue({ data: [], error: null });
    const mockSelectFetch = vi.fn().mockReturnValue({ order: mockOrder });
    
    // Setup insert
    const mockSingle = vi.fn().mockResolvedValue({ data: mockAction, error: null });
    const mockSelectInsert = vi.fn().mockReturnValue({ single: mockSingle });
    const mockInsert = vi.fn().mockReturnValue({ select: mockSelectInsert });
    
    (supabase.from as any).mockImplementation(() => ({
      select: mockSelectFetch,
      insert: mockInsert
    }));

    const { result } = renderHook(() => useActionLogs());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.addLog('1');
    });

    expect(mockInsert).toHaveBeenCalled();
    expect(result.current.logs).toEqual([mockAction]);
  });

  it('handles delete log', async () => {
    const mockOrder = vi.fn().mockResolvedValue({ data: [mockAction], error: null });
    const mockSelectFetch = vi.fn().mockReturnValue({ order: mockOrder });
    
    const mockEq = vi.fn().mockResolvedValue({ error: null });
    const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });

    (supabase.from as any).mockImplementation(() => ({
      select: mockSelectFetch,
      delete: mockDelete
    }));

    const { result } = renderHook(() => useActionLogs());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.logs).toHaveLength(1);

    await act(async () => {
      await result.current.deleteLog('1');
    });

    expect(mockEq).toHaveBeenCalledWith('id', '1');
    expect(result.current.logs).toEqual([]);
  });

  it('handles fetch error', async () => {
    const mockOrder = vi.fn().mockResolvedValue({ data: null, error: new Error('Network error') });
    const mockSelectFetch = vi.fn().mockReturnValue({ order: mockOrder });
    (supabase.from as any).mockReturnValue({ select: mockSelectFetch });

    const { result } = renderHook(() => useActionLogs());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBe('Network error');
  });

  it('handles addLog error', async () => {
    const mockOrder = vi.fn().mockResolvedValue({ data: [], error: null });
    const mockSelectFetch = vi.fn().mockReturnValue({ order: mockOrder });
    
    const mockSingle = vi.fn().mockResolvedValue({ data: null, error: new Error('Insert failed') });
    const mockSelectInsert = vi.fn().mockReturnValue({ single: mockSingle });
    const mockInsert = vi.fn().mockReturnValue({ select: mockSelectInsert });
    
    (supabase.from as any).mockImplementation(() => ({
      select: mockSelectFetch,
      insert: mockInsert
    }));

    const { result } = renderHook(() => useActionLogs());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      try {
        await result.current.addLog('1');
      } catch (e) {}
    });

    expect(result.current.error).toBe('Insert failed');
  });

  it('handles deleteLog error', async () => {
    const mockOrder = vi.fn().mockResolvedValue({ data: [mockAction], error: null });
    const mockSelectFetch = vi.fn().mockReturnValue({ order: mockOrder });
    
    const mockEq = vi.fn().mockResolvedValue({ error: new Error('Delete failed') });
    const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });

    (supabase.from as any).mockImplementation(() => ({
      select: mockSelectFetch,
      delete: mockDelete
    }));

    const { result } = renderHook(() => useActionLogs());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      try {
        await result.current.deleteLog('1');
      } catch (e) {}
    });

    expect(result.current.error).toBe('Delete failed');
  });

  it('handles unknown fetch error', async () => {
    const mockOrder = vi.fn().mockRejectedValue('String error');
    const mockSelectFetch = vi.fn().mockReturnValue({ order: mockOrder });
    (supabase.from as any).mockReturnValue({ select: mockSelectFetch });

    const { result } = renderHook(() => useActionLogs());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBe('Failed to fetch logs');
  });

  it('handles unknown addLog error', async () => {
    const mockOrder = vi.fn().mockResolvedValue({ data: [], error: null });
    const mockSelectFetch = vi.fn().mockReturnValue({ order: mockOrder });
    
    const mockInsert = vi.fn().mockImplementation(() => {
      throw 'String insert error';
    });
    
    (supabase.from as any).mockImplementation(() => ({
      select: mockSelectFetch,
      insert: mockInsert
    }));

    const { result } = renderHook(() => useActionLogs());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      try {
        await result.current.addLog('1');
      } catch (e) {}
    });

    expect(result.current.error).toBe('Error saving action');
  });

  it('handles unknown deleteLog error', async () => {
    const mockOrder = vi.fn().mockResolvedValue({ data: [mockAction], error: null });
    const mockSelectFetch = vi.fn().mockReturnValue({ order: mockOrder });
    
    const mockDelete = vi.fn().mockImplementation(() => {
      throw 'String delete error';
    });

    (supabase.from as any).mockImplementation(() => ({
      select: mockSelectFetch,
      delete: mockDelete
    }));

    const { result } = renderHook(() => useActionLogs());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      try {
        await result.current.deleteLog('1');
      } catch (e) {}
    });

    expect(result.current.error).toBe('Error deleting action');
  });

  it('handles fetch logs with null data', async () => {
    const mockOrder = vi.fn().mockResolvedValue({ data: null, error: null });
    const mockSelectFetch = vi.fn().mockReturnValue({ order: mockOrder });
    (supabase.from as any).mockReturnValue({ select: mockSelectFetch });

    const { result } = renderHook(() => useActionLogs());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.logs).toEqual([]);
  });

  it('bails out when adding invalid action id', async () => {
    const mockOrder = vi.fn().mockResolvedValue({ data: [], error: null });
    const mockSelectFetch = vi.fn().mockReturnValue({ order: mockOrder });
    (supabase.from as any).mockReturnValue({ select: mockSelectFetch });

    const { result } = renderHook(() => useActionLogs());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.addLog('invalid-id');
    });

    expect(result.current.logs).toEqual([]);
  });

  it('handles addLog with null data returned', async () => {
    const mockOrder = vi.fn().mockResolvedValue({ data: [], error: null });
    const mockSelectFetch = vi.fn().mockReturnValue({ order: mockOrder });
    
    const mockSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    const mockSelectInsert = vi.fn().mockReturnValue({ single: mockSingle });
    const mockInsert = vi.fn().mockReturnValue({ select: mockSelectInsert });
    
    (supabase.from as any).mockImplementation(() => ({
      select: mockSelectFetch,
      insert: mockInsert
    }));

    const { result } = renderHook(() => useActionLogs());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.addLog('1');
    });

    expect(result.current.logs).toEqual([]);
  });
});
