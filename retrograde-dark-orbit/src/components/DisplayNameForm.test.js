import { render, screen, fireEvent } from '@testing-library/react';
import DisplayNameForm from './DisplayNameForm';

describe('DisplayNameForm', () => {
  it('handles non-unique usernames correctly', () => {
    const handleJoinMock = jest.fn();
    const existingUsernames = ['TestUser', 'User2']; // Mock existing usernames

    render(<DisplayNameForm onJoin={handleJoinMock} existingUsernames={existingUsernames} />);
    
    
    const usernameInput = screen.getByLabelText('Username');
    const joinButton = screen.getByRole('button', { name: 'Join' });

    fireEvent.change(usernameInput, { target: { value: 'TestUser' } });

    // Here i need to use the join button to see if username is taken.
    fireEvent.click(joinButton);

    expect(screen.queryByText('Username is already taken, please choose another.')).toBeTruthy();

    expect(handleJoinMock).not.toHaveBeenCalled();
  });
});
