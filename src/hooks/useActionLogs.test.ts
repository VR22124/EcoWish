import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useActionLogs } from './useActionLogs';
import { supabase } from '../supabaseClient';

vi.mock('../supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

/** Typed helper to avoid `as any` casts throughout tests */
const mockFrom = () => (supabase.from as ReturnType<typeof vi.fn>);

/**
 * Builds the full fetch mock chain:
 * from() -> select() -> order() -> abortSignal() -> resolvedValue
 */
const makeFetchMock = (resolvedValue: { data: unknown; error: unknown }) => {
  const mockAbortSignal = vi.fn().mockResolvedValue(resolvedValue);
  const mockLimit = vi.fn().mockReturnValue({ abortSignal: mockAbortSignal });
  const mockOrder = vi.fn().mockReturnValue({ limit: mockLimit });
  const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
  return { mockSelect, mockOrder, mockLimit, mockAbortSignal };
};

/** Resolves all pending microtasks */
const flushPromises = () => act(async () => {
  await new Promise(resolve => setTimeout(resolve, 0));
});

describe('useActionLogs', () => {
  const mockAction = {
    id: '1',
    action_title: 'Test Action',
    carbon_saved_kg: 1,
    category: 'Test',
    created_at: '2026-06-08T10:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes and fetches logs', async () => {
    const { mockSelect } = makeFetchMock({ data: [mockAction], error: null });
    mockFrom().mockReturnValue({ select: mockSelect });

    const { result } = renderHook(() => useActionLogs());
    expect(result.current.isLoading).toBe(true);

    await flushPromises();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.logs).toEqual([mockAction]);
  });

  it('handles add log', async () => {
    const { mockSelect: mockSelectFetch } = makeFetchMock({ data: [], error: null });

    const mockSingle = vi.fn().mockResolvedValue({ data: mockAction, error: null });
    const mockSelectInsert = vi.fn().mockReturnValue({ single: mockSingle });
    const mockInsert = vi.fn().mockReturnValue({ select: mockSelectInsert });

    mockFrom().mockImplementation(() => ({
      select: mockSelectFetch,
      insert: mockInsert,
    }));

    const { result } = renderHook(() => useActionLogs());
    await flushPromises();

    await act(async () => {
      await result.current.addLog('1');
    });

    expect(mockInsert).toHaveBeenCalled();
    expect(result.current.logs).toEqual([mockAction]);
  });

  it('handles delete log', async () => {
    const { mockSelect: mockSelectFetch } = makeFetchMock({ data: [mockAction], error: null });

    const mockEq = vi.fn().mockResolvedValue({ error: null });
    const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });

    mockFrom().mockImplementation(() => ({
      select: mockSelectFetch,
      delete: mockDelete,
    }));

    const { result } = renderHook(() => useActionLogs());
    await flushPromises();

    expect(result.current.logs).toHaveLength(1);

    await act(async () => {
      await result.current.deleteLog('1');
    });

    expect(mockEq).toHaveBeenCalledWith('id', '1');
    expect(result.current.logs).toEqual([]);
  });

  it('handles fetch error (Error instance)', async () => {
    const { mockSelect } = makeFetchMock({ data: null, error: new Error('Network error') });
    mockFrom().mockReturnValue({ select: mockSelect });

    const { result } = renderHook(() => useActionLogs());
    await flushPromises();

    expect(result.current.error).toBe('Failed to load your action logs. Please try again.');
  });

  it('handles unknown fetch error (non-Error)', async () => {
    const mockAbortSignal = vi.fn().mockRejectedValue('String error');
    const mockLimit = vi.fn().mockReturnValue({ abortSignal: mockAbortSignal });
    const mockOrder = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
    mockFrom().mockReturnValue({ select: mockSelect });

    const { result } = renderHook(() => useActionLogs());
    await flushPromises();

    expect(result.current.error).toBe('Failed to load your action logs. Please try again.');
  });

  it('handles fetch with null data (defaults to empty array)', async () => {
    const { mockSelect } = makeFetchMock({ data: null, error: null });
    mockFrom().mockReturnValue({ select: mockSelect });

    const { result } = renderHook(() => useActionLogs());
    await flushPromises();

    expect(result.current.logs).toEqual([]);
  });

  it('handles addLog error (Error instance)', async () => {
    const { mockSelect: mockSelectFetch } = makeFetchMock({ data: [], error: null });

    const mockSingle = vi.fn().mockResolvedValue({ data: null, error: new Error('Insert failed') });
    const mockSelectInsert = vi.fn().mockReturnValue({ single: mockSingle });
    const mockInsert = vi.fn().mockReturnValue({ select: mockSelectInsert });

    mockFrom().mockImplementation(() => ({
      select: mockSelectFetch,
      insert: mockInsert,
    }));

    const { result } = renderHook(() => useActionLogs());
    await flushPromises();

    await act(async () => {
      await result.current.addLog('1');
    });

    expect(result.current.error).toBe('Failed to save your action. Please try again.');
  });

  it('handles unknown addLog error (non-Error)', async () => {
    const { mockSelect: mockSelectFetch } = makeFetchMock({ data: [], error: null });

    const mockInsert = vi.fn().mockImplementation(() => { throw 'String insert error'; });

    mockFrom().mockImplementation(() => ({
      select: mockSelectFetch,
      insert: mockInsert,
    }));

    const { result } = renderHook(() => useActionLogs());
    await flushPromises();

    await act(async () => {
      await result.current.addLog('1');
    });

    expect(result.current.error).toBe('Failed to save your action. Please try again.');
  });

  it('handles deleteLog error (Error instance)', async () => {
    const { mockSelect: mockSelectFetch } = makeFetchMock({ data: [mockAction], error: null });

    const mockEq = vi.fn().mockResolvedValue({ error: new Error('Delete failed') });
    const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });

    mockFrom().mockImplementation(() => ({
      select: mockSelectFetch,
      delete: mockDelete,
    }));

    const { result } = renderHook(() => useActionLogs());
    await flushPromises();

    await act(async () => {
      await result.current.deleteLog('1');
    });

    expect(result.current.error).toBe('Failed to delete action. Please try again.');
  });

  it('handles unknown deleteLog error (non-Error)', async () => {
    const { mockSelect: mockSelectFetch } = makeFetchMock({ data: [mockAction], error: null });

    const mockDelete = vi.fn().mockImplementation(() => { throw 'String delete error'; });

    mockFrom().mockImplementation(() => ({
      select: mockSelectFetch,
      delete: mockDelete,
    }));

    const { result } = renderHook(() => useActionLogs());
    await flushPromises();

    await act(async () => {
      await result.current.deleteLog('1');
    });

    expect(result.current.error).toBe('Failed to delete action. Please try again.');
  });

  it('bails out when adding invalid action id', async () => {
    const { mockSelect } = makeFetchMock({ data: [], error: null });
    mockFrom().mockReturnValue({ select: mockSelect });

    const { result } = renderHook(() => useActionLogs());
    await flushPromises();

    await act(async () => { await result.current.addLog('invalid-id'); });

    expect(result.current.logs).toEqual([]);
  });

  it('handles addLog with null data returned (no state update)', async () => {
    const { mockSelect: mockSelectFetch } = makeFetchMock({ data: [], error: null });

    const mockSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    const mockSelectInsert = vi.fn().mockReturnValue({ single: mockSingle });
    const mockInsert = vi.fn().mockReturnValue({ select: mockSelectInsert });

    mockFrom().mockImplementation(() => ({
      select: mockSelectFetch,
      insert: mockInsert,
    }));

    const { result } = renderHook(() => useActionLogs());
    await flushPromises();

    await act(async () => { await result.current.addLog('1'); });

    expect(result.current.logs).toEqual([]);
  });

  it('ignores AbortError on fetch (component unmounted mid-request)', async () => {
    const abortError = new DOMException('Aborted', 'AbortError');
    const mockAbortSignal = vi.fn().mockRejectedValue(abortError);
    const mockLimit = vi.fn().mockReturnValue({ abortSignal: mockAbortSignal });
    const mockOrder = vi.fn().mockReturnValue({ limit: mockLimit });
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
    mockFrom().mockReturnValue({ select: mockSelect });

    const { result, unmount } = renderHook(() => useActionLogs());
    unmount();

    await flushPromises();

    // No error should be set — AbortError is silently ignored
    expect(result.current.error).toBeNull();
  });
});
