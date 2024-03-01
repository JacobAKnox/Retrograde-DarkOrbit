import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import '@testing-library/jest-dom'
import ReadyStatus from './ready_status'

test('renders on-screen', () => {
  const page = render(<ReadyStatus/>);
  expect(page).toMatchSnapshot();
});
