import { render, screen } from '@testing-library/react';
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

  it('renders list items', () => {
    render(<ActionList logs={mockLogs} onDeleteLog={vi.fn()} />);
    expect(screen.getByText('Test Action')).toBeInTheDocument();
    expect(screen.getByLabelText(/Delete log for Test Action/i)).toBeInTheDocument();
  });
});
