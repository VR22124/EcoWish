import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LogActionForm } from './LogActionForm';

describe('LogActionForm', () => {
  it('renders select and button', () => {
    render(<LogActionForm onAddLog={vi.fn()} />);
    expect(screen.getByLabelText(/Select Eco-friendly Action/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log Action/i })).toBeDisabled();
  });

  it('enables button and submits', async () => {
    const mockOnAddLog = vi.fn().mockResolvedValue(undefined);
    render(<LogActionForm onAddLog={mockOnAddLog} />);
    
    const select = screen.getByLabelText(/Select Eco-friendly Action/i);
    fireEvent.change(select, { target: { value: '1' } });
    
    const button = screen.getByRole('button', { name: /Log Action/i });
    expect(button).toBeEnabled();
    
    await act(async () => {
      fireEvent.click(button);
    });
    
    expect(mockOnAddLog).toHaveBeenCalledWith('1');
  });

  it('handles submission error gracefully', async () => {
    const mockOnAddLog = vi.fn().mockRejectedValue(new Error('Submit failed'));
    render(<LogActionForm onAddLog={mockOnAddLog} />);
    
    const select = screen.getByLabelText(/Select Eco-friendly Action/i);
    fireEvent.change(select, { target: { value: '1' } });
    
    const button = screen.getByRole('button', { name: /Log Action/i });
    
    await act(async () => {
      fireEvent.click(button);
    });
    
    expect(mockOnAddLog).toHaveBeenCalledWith('1');
    expect(button).toBeEnabled(); // Should re-enable after finally block
  });

  it('bails out if no action is selected', () => {
    const mockOnAddLog = vi.fn();
    render(<LogActionForm onAddLog={mockOnAddLog} />);
    
    // Attempt to submit the form directly bypassing the disabled button
    fireEvent.submit(screen.getByRole('button', { name: /Log Action/i }).closest('form')!);
    
    expect(mockOnAddLog).not.toHaveBeenCalled();
  });

  it('bails out if selected action has invalid carbon value', async () => {
    // Temporarily patch ECO_ACTIONS to include a zero-value action
    const { ECO_ACTIONS } = await import('../constants/actions');
    const original = [...ECO_ACTIONS];
    ECO_ACTIONS.push({ id: 'bad', title: 'Bad Action', category: 'Test', carbon_saved_kg: 0 });

    const mockOnAddLog = vi.fn();
    render(<LogActionForm onAddLog={mockOnAddLog} />);

    const select = screen.getByLabelText(/Select Eco-friendly Action/i);
    fireEvent.change(select, { target: { value: 'bad' } });
    fireEvent.submit(screen.getByRole('button').closest('form')!);

    expect(mockOnAddLog).not.toHaveBeenCalled();

    // Restore
    ECO_ACTIONS.splice(0, ECO_ACTIONS.length, ...original);
  });
});
