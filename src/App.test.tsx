import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import * as useActionLogsModule from './hooks/useActionLogs';

// Mock the hook
const mockAddLog = vi.fn();
const mockDeleteLog = vi.fn();
const mockSetError = vi.fn();

vi.mock('./hooks/useActionLogs');

describe('App', () => {
  beforeEach(() => {
    vi.mocked(useActionLogsModule.useActionLogs).mockReturnValue({
      logs: [
        { id: '1', action_title: 'Cycled to work', carbon_saved_kg: 2.5, category: 'Transport', created_at: '2026-06-08T10:00:00Z' }
      ],
      isLoading: false,
      error: null,
      addLog: mockAddLog,
      deleteLog: mockDeleteLog,
      setError: mockSetError,
    });
  });
  it('renders main shell', () => {
    render(<App />);
    expect(screen.getByText('EcoWish')).toBeInTheDocument();
  });

  it('handles add log', async () => {
    render(<App />);
    const select = screen.getByLabelText(/Select Eco-friendly Action/i);
    fireEvent.change(select, { target: { value: '1' } });
    
    const addButton = screen.getByRole('button', { name: /Log Action/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(mockAddLog).toHaveBeenCalledWith('1');
    });
  });

  it('handles delete log', async () => {
    render(<App />);
    const deleteButton = screen.getByLabelText(/Delete log for Cycled to work/i);
    fireEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(mockDeleteLog).toHaveBeenCalledWith('1');
    });
  });

  it('renders and dismisses error', () => {
    vi.mocked(useActionLogsModule.useActionLogs).mockReturnValue({
      logs: [],
      isLoading: false,
      error: 'Test error message',
      addLog: mockAddLog,
      deleteLog: mockDeleteLog,
      setError: mockSetError,
    });
    
    render(<App />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    
    const dismissButton = screen.getByRole('button', { name: /Dismiss error/i });
    fireEvent.click(dismissButton);
    expect(mockSetError).toHaveBeenCalledWith(null);
  });

  it('renders content when loading but logs exist', () => {
    vi.mocked(useActionLogsModule.useActionLogs).mockReturnValue({
      logs: [{ id: '1', action_title: 'Existing log', carbon_saved_kg: 1, category: 'Test', created_at: '2026-06-08T10:00:00Z' }],
      isLoading: true, // true, but logs exist
      error: null,
      addLog: mockAddLog,
      deleteLog: mockDeleteLog,
      setError: mockSetError,
    });
    
    render(<App />);
    expect(screen.getByText('Existing log')).toBeInTheDocument();
  });
});
