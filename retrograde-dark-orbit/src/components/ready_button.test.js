import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import '@testing-library/jest-dom'
import ReadyButton from './ready_button'

test('renders on-screen', () => {
  const page = render(<ReadyButton/>);
  expect(page).toMatchSnapshot();
});

test('UI toggles ready/unready', async () => {
  render(<ReadyButton/>);

  const button = screen.getByRole('button');
  expect(button).toHaveTextContent('Ready');

  await userEvent.click(button);
  expect(button).toHaveTextContent('Unready');

  await userEvent.click(button);
  expect(button).toHaveTextContent('Ready');
});
