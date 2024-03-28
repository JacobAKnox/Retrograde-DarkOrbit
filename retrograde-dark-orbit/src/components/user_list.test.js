import { render } from '@testing-library/react'
import UserList from './user_list'

test('renders on-screen', () => {
  const page = render(<UserList/>);
  expect(page).toMatchSnapshot();
});
