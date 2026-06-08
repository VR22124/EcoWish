import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Dashboard } from './Dashboard';
import type { ActionLog } from '../types';

const mockLogs: ActionLog[] = [
  {
    id: '1',
    action_title: 'Cycled to work',
    carbon_saved_kg: 2.5,
    category: 'Transport',
    created_at: '2026-06-08T10:00:00Z',
  },
  {
    id: '2',
    action_title: 'Used reusable coffee cup',
    carbon_saved_kg: 0.1,
    category: 'Waste',
    created_at: '2026-06-08T11:00:00Z',
  }
];

describe('Dashboard Component', () => {
  it('renders total carbon saved correctly', () => {
    render(<Dashboard logs={mockLogs} />);
    // 2.5 + 0.1 = 2.6
    expect(screen.getByText('2.6')).toBeInTheDocument();
  });

  it('renders correct number of actions taken', () => {
    render(<Dashboard logs={mockLogs} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
