import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmDialog } from './ConfirmDialog';
import { vi } from 'vitest';

describe('ConfirmDialog', () => {
  const mockOnConfirm = vi.fn();

  afterEach(() => {
    mockOnConfirm.mockClear(); // Clear the mock function between tests
  });

  it('should render the dialog when isOpen is true', () => {
    render(<ConfirmDialog message="Are you sure?" isOpen={true} onConfirm={mockOnConfirm} />);
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('Confirmation')).toBeInTheDocument(); // Ensure the title is rendered
  });

  it('should not render the dialog when isOpen is false', () => {
    render(<ConfirmDialog message="Are you sure?" isOpen={false} onConfirm={mockOnConfirm} />);
    expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
  });

  it('should call onConfirm with true when confirm button is clicked', () => {
    render(<ConfirmDialog message="Are you sure?" isOpen={true} onConfirm={mockOnConfirm} />);
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);
    expect(mockOnConfirm).toHaveBeenCalledWith(true);
  });

  it('should call onConfirm with false when cancel button is clicked or the dialog is closed', () => {
    render(<ConfirmDialog message="Are you sure?" isOpen={true} onConfirm={mockOnConfirm} />);
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(mockOnConfirm).toHaveBeenCalledWith(false);
  });

  it('should display the correct message', () => {
    const message = 'Do you want to delete this item?';
    render(<ConfirmDialog message={message} isOpen={true} onConfirm={mockOnConfirm} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });
});
