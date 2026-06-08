import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ActionList } from './ActionList';
import type { ActionLog } from '../types';

const mockLogs: ActionLog[] = [
  { id: '1', action_title: 'Test Action', carbon_saved_kg: 1, category: 'Test', created_at: '2026-06-08T10:00:00Z' }
];

describe('ActionList', () => {
  it('renders empty state', () => {
    render(<ActionList logs={[]} onDeleteLog={vi.fn()} />);
    expect(screen.getByText(/No actions logged yet/i)).toBeInTheDocument();
  });

  it('renders list items with accessible markup', () => {
    render(<ActionList logs={mockLogs} onDeleteLog={vi.fn()} />);
    expect(screen.getByText('Test Action')).toBeInTheDocument();
    expect(screen.getByLabelText(/Delete log for Test Action/i)).toBeInTheDocument();
    expect(screen.getByRole('list', { name: /logged eco-friendly actions/i })).toBeInTheDocument();
  });

  it('calls onDeleteLog when delete button is clicked', async () => {
    const mockDelete = vi.fn().mockResolvedValue(undefined);
    render(<ActionList logs={mockLogs} onDeleteLog={mockDelete} />);
    fireEvent.click(screen.getByLabelText(/Delete log for Test Action/i));
    await waitFor(() => expect(mockDelete).toHaveBeenCalledWith('1'));
  });
});

