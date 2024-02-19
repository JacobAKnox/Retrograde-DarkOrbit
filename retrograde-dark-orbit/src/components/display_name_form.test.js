import { render, screen, fireEvent } from '@testing-library/react'
import DisplayNameForm from './display_name_form'
import * as socketModule from "./../server/socket"

describe('display_name_form', () => {
  it('handles non-unique usernames correctly', async () => {
    const joinLobbyMock = jest.spyOn(socketModule, 'join_lobby').mockResolvedValue({
      status: 'error',
      message: 'Username is already taken'
    });

    render(<DisplayNameForm />);
    
    const usernameInput = screen.getByLabelText('Username');
    const joinButton = screen.getByRole('button', { name: 'Join' });

    fireEvent.change(usernameInput, { target: { value: 'TestUser' } });
    fireEvent.click(joinButton);

    await screen.findByText('Username is already taken');

    expect(joinLobbyMock).toHaveBeenCalledWith('TestUser', expect.any(String));
    expect(screen.getByText('Username is already taken')).toBeTruthy();

    joinLobbyMock.mockRestore();
  });
});
