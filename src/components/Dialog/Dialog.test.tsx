import { render, screen, fireEvent } from '@testing-library/react';
import { Dialog } from './Dialog';
import { vi } from 'vitest';

describe('Dialog Component', () => {
  const mockOnClose = vi.fn();

  afterEach(() => {
    mockOnClose.mockClear(); // Clear the mock function between tests
  });

  it('should render the dialog when isOpen is true', () => {
    render(<Dialog title="Test Dialog" isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('should not render the dialog when isOpen is false', () => {
    render(<Dialog title="Test Dialog" isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
  });

  it('should call onClose with false when the cancel button is clicked', () => {
    render(<Dialog title="Test Dialog" isOpen={true} onClose={mockOnClose} />);
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalledWith(false);
  });

  it('should call onClose with true when the confirm button is clicked', () => {
    render(<Dialog title="Test Dialog" isOpen={true} onClose={mockOnClose} />);
    const confirmButton = screen.getByText('Confirm');
    fireEvent.click(confirmButton);
    expect(mockOnClose).toHaveBeenCalledWith(true);
  });

  it('should call onClose with true when the confirm button is clicked and the confirm button is enabled', () => {
    render(<Dialog title="Test Dialog" isOpen={true} onClose={mockOnClose} />);
    const confirmButton = screen.getByText('Confirm');
    expect(confirmButton).not.toBeDisabled();
    fireEvent.click(confirmButton);
    expect(mockOnClose).toHaveBeenCalledWith(true);
  });

  it('should disable the confirm button when disableConfirm is true', () => {
    render(<Dialog title="Test Dialog" isOpen={true} onClose={mockOnClose} disableConfirm={true} />);
    const confirmButton = screen.getByText('Confirm');
    expect(confirmButton).toBeDisabled();
  });

  it('should show an action button if actionButton is provided', () => {
    const actionButton = {
      text: 'Custom Action',
      color: 'bg-green-500',
      action: vi.fn(),
    };
    render(
      <Dialog title="Test Dialog" isOpen={true} onClose={mockOnClose} actionButton={actionButton} />
    );
    const actionButtonElement = screen.getByText('Custom Action');
    expect(actionButtonElement).toBeInTheDocument();
    fireEvent.click(actionButtonElement);
    expect(actionButton.action).toHaveBeenCalled();
  });

  it('should not show an action button if actionButton is not provided', () => {
    render(<Dialog title="Test Dialog" isOpen={true} onClose={mockOnClose} />);
    const actionButtonElement = screen.queryByText('Custom Action');
    expect(actionButtonElement).not.toBeInTheDocument();
  });

  it('should close the dialog when the close button (X) is clicked', () => {
    render(<Dialog title="Test Dialog" isOpen={true} onClose={mockOnClose} />);
    const closeButton = screen.getByLabelText('Close dialog');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledWith(false);
  });
});
