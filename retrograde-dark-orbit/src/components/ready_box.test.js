import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import '@testing-library/jest-dom'
import ReadyBox from './ready_box'

test('renders on-screen', () => {
  const page = render(<ReadyBox/>);
  expect(page).toMatchSnapshot();
});
