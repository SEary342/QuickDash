import { render, screen } from '@testing-library/react';
import QuickDashWelcome from './QuickDashWelcome';

describe('QuickDashWelcome', () => {
  it('should render the title correctly', () => {
    render(<QuickDashWelcome />);
    const titleElement = screen.getByText('Welcome to QuickDash!');
    expect(titleElement).toBeInTheDocument();
  });

  it('should render the description text correctly', () => {
    render(<QuickDashWelcome />);
    const descriptionElement = screen.getByText(/There are currently no dashboards to display/i);
    expect(descriptionElement).toBeInTheDocument();
  });

  it('should render the plus icon correctly', () => {
    render(<QuickDashWelcome />);
    const plusIcon = screen.getByTestId('plus-icon'); // Assuming data-testid added to the icon for easier querying
    expect(plusIcon).toBeInTheDocument();
  });

  it('should render the settings (cog) icon correctly', () => {
    render(<QuickDashWelcome />);
    const cogIcon = screen.getByTestId('cog-icon'); // Assuming data-testid added to the icon for easier querying
    expect(cogIcon).toBeInTheDocument();
  });

  it('should render both the plus and cog icons inside the paragraph', () => {
    render(<QuickDashWelcome />);
    const plusIcon = screen.getByTestId('plus-icon');
    const cogIcon = screen.getByTestId('cog-icon');
    
    expect(plusIcon).toBeInTheDocument();
    expect(cogIcon).toBeInTheDocument();
  });

  it('should have the correct class names applied', () => {
    render(<QuickDashWelcome />);
    const container = screen.getByText('Welcome to QuickDash!').closest('div');
    expect(container).toHaveClass('border border-gray-300 rounded-lg p-4 mx-[25%] mt-10');
  });
});
