import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DisplayNameForm from './display_name_form'
import * as socketModule from "./../server/socket"
import "setimmediate";

it('renders the display name form with input and join button', () => {
  render(<DisplayNameForm />);
  const usernameInput = screen.getByLabelText('Username');
  const joinButton = screen.getByRole('button', { name: 'Join' });

  expect(usernameInput).toBeTruthy();
  expect(joinButton).toBeTruthy();
});

it('updates the username input field when the user types', () => {
  render(<DisplayNameForm />);
  const usernameInput = screen.getByLabelText('Username');

  fireEvent.change(usernameInput, { target: { value: 'TestUser' } });

  expect(usernameInput.value).toBe('TestUser');
});

it('calls create_lobby with the username when join button is clicked', async () => {
  jest.spyOn(socketModule, 'create_lobby').mockResolvedValue({
    status: '400',
    message:'User named ${username} already in lobby ${lobby_code}'
  });

  render(<DisplayNameForm />);
  const usernameInput = screen.getByLabelText('Username');
  const joinButton = screen.getByRole('button', { name: 'Join' });

  fireEvent.change(usernameInput, { target: { value: 'TestUser' } });
  fireEvent.click(joinButton);
  
  await waitFor(() => {
    expect(socketModule.create_lobby).toHaveBeenCalledWith('TestUser');
  });
  socketModule.create_lobby.mockRestore();
});

it('displays an error message when a non-unique username is submitted', async () => {
  jest.spyOn(socketModule, 'create_lobby').mockResolvedValue({
    status: '400',
    message:'User named ${username} already in lobby ${lobby_code}'
  });

  render(<DisplayNameForm />);
  const usernameInput = screen.getByLabelText('Username');
  const joinButton = screen.getByRole('button', { name: 'Join' });

  fireEvent.change(usernameInput, { target: { value: 'TestUser' } });
  fireEvent.click(joinButton);

  await waitFor(async () => {
    const errorMessage = await screen.findByText('User named ${username} already in lobby ${lobby_code}');
    expect(errorMessage).toBeTruthy();
    socketModule.create_lobby.mockRestore();
  });
});


