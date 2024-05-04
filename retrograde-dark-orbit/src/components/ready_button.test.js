import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import '@testing-library/jest-dom'
import ReadyButton from './ready_button'
import { update_player_ready } from '../server/socket'; 
import "setimmediate";

jest.mock('../server/socket', () => ({
  update_player_ready: jest.fn()
}));

test('renders on-screen', () => {
  const page = render(<ReadyButton/>);
  expect(page).toMatchSnapshot();
});

test('renders on-screen with initial state', () => {
  render(<ReadyButton />);
  const button = screen.getByRole('button');
  expect(button).toHaveTextContent('Ready');
});

test('calls update_player_ready on click', async () => {
  render(<ReadyButton />);

  const button = screen.getByRole('button');
  await userEvent.click(button);

  // Verify the update_player_ready function was called
  expect(update_player_ready).toHaveBeenCalled();
});