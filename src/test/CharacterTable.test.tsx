import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { CharacterTable } from '@/components/CharacterTable';
import { Character } from '@/types/character';

const mockData: Character[] = [
  {
    id: 'test1',
    name: 'Naruto Uzumaki',
    location: 'Konoha',
    health: 'Healthy',
    power: 9000,
  },
  {
    id: 'test2',
    name: 'Sasuke Uchiha',
    location: 'Konoha',
    health: 'Injured',
    power: 8500,
  },
  {
    id: 'test3',
    name: 'Gaara Sabaku',
    location: 'Suna',
    health: 'Critical',
    power: 7000,
  },
  {
    id: 'test4',
    name: 'Kakashi Hatake',
    location: 'Konoha',
    health: 'Healthy',
    power: 8000,
  },
];

describe('CharacterTable', () => {
  beforeEach(() => {
    // Mock console.log to spy on it
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('renders the table with character data', () => {
    render(<CharacterTable data={mockData} />);
    
    expect(screen.getByText('Naruto Uzumaki')).toBeInTheDocument();
    expect(screen.getByText('Sasuke Uchiha')).toBeInTheDocument();
    expect(screen.getByText('Gaara Sabaku')).toBeInTheDocument();
  });

  it('filters characters by name when searching', async () => {
    const user = userEvent.setup();
    render(<CharacterTable data={mockData} />);
    
    const searchInput = screen.getByPlaceholderText(/search by name or location/i);
    await user.type(searchInput, 'Naruto');
    
    await waitFor(() => {
      expect(screen.getByText('Naruto Uzumaki')).toBeInTheDocument();
      expect(screen.queryByText('Sasuke Uchiha')).not.toBeInTheDocument();
      expect(screen.queryByText('Gaara Sabaku')).not.toBeInTheDocument();
    });
  });

  it('filters characters by location when searching', async () => {
    const user = userEvent.setup();
    render(<CharacterTable data={mockData} />);
    
    const searchInput = screen.getByPlaceholderText(/search by name or location/i);
    await user.type(searchInput, 'Suna');
    
    await waitFor(() => {
      expect(screen.getByText('Gaara Sabaku')).toBeInTheDocument();
      expect(screen.queryByText('Naruto Uzumaki')).not.toBeInTheDocument();
      expect(screen.queryByText('Sasuke Uchiha')).not.toBeInTheDocument();
    });
  });

  it('displays correct character count', () => {
    render(<CharacterTable data={mockData} />);
    
    expect(screen.getByText(/showing 4 of 4 characters/i)).toBeInTheDocument();
  });

  it('updates character count when filtering', async () => {
    const user = userEvent.setup();
    render(<CharacterTable data={mockData} />);
    
    const searchInput = screen.getByPlaceholderText(/search by name or location/i);
    await user.type(searchInput, 'Konoha');
    
    await waitFor(() => {
      expect(screen.getByText(/showing 3 of 4 characters/i)).toBeInTheDocument();
    });
  });

  it('allows row selection and logs selected IDs when marking as viewed', async () => {
    const user = userEvent.setup();
    render(<CharacterTable data={mockData} />);
    
    // Get all checkboxes (excluding the header checkbox)
    const checkboxes = screen.getAllByRole('checkbox');
    
    // Click the first data row checkbox (index 1, since index 0 is the header)
    await user.click(checkboxes[1]);
    
    // Click the "Mark as Viewed" button
    const viewedButton = screen.getByRole('button', { name: /mark.*as viewed/i });
    await user.click(viewedButton);
    
    // Verify console.log was called with the correct ID
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('Marking as viewed:', ['test1']);
    });
  });

  it('handles multiple row selection', async () => {
    const user = userEvent.setup();
    render(<CharacterTable data={mockData} />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    
    // Select first two data rows
    await user.click(checkboxes[1]); // First character
    await user.click(checkboxes[2]); // Second character
    
    const viewedButton = screen.getByRole('button', { name: /mark.*as viewed/i });
    await user.click(viewedButton);
    
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('Marking as viewed:', expect.arrayContaining(['test1', 'test2']));
    });
  });

  it('disables mark buttons when no rows are selected', () => {
    render(<CharacterTable data={mockData} />);
    
    const viewedButton = screen.getByRole('button', { name: /mark.*as viewed.*\(0\)/i });
    const unviewedButton = screen.getByRole('button', { name: /mark.*as unviewed.*\(0\)/i });
    
    expect(viewedButton).toBeDisabled();
    expect(unviewedButton).toBeDisabled();
  });

  it('enables mark buttons when rows are selected', async () => {
    const user = userEvent.setup();
    render(<CharacterTable data={mockData} />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]);
    
    const viewedButton = screen.getByRole('button', { name: /mark.*as viewed.*\(1\)/i });
    const unviewedButton = screen.getByRole('button', { name: /mark.*as unviewed.*\(1\)/i });
    
    expect(viewedButton).not.toBeDisabled();
    expect(unviewedButton).not.toBeDisabled();
  });

  it('selects all rows when header checkbox is clicked', async () => {
    const user = userEvent.setup();
    render(<CharacterTable data={mockData} />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    const headerCheckbox = checkboxes[0];
    
    await user.click(headerCheckbox);
    
    const viewedButton = screen.getByRole('button', { name: /mark.*as viewed.*\(4\)/i });
    expect(viewedButton).not.toBeDisabled();
  });

  it('maintains selection state when filtering', async () => {
    const user = userEvent.setup();
    render(<CharacterTable data={mockData} />);
    
    // Select a row
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]); // Select Naruto
    
    // Apply filter that includes the selected row
    const searchInput = screen.getByPlaceholderText(/search by name or location/i);
    await user.type(searchInput, 'Naruto');
    
    await waitFor(() => {
      const viewedButton = screen.getByRole('button', { name: /mark.*as viewed.*\(1\)/i });
      expect(viewedButton).not.toBeDisabled();
    });
  });
});
