import { render } from '@testing-library/react'
import PlayerList from './user_list'

test('renders on-screen', () => {
  const page = render(<PlayerList/>);
  expect(page).toMatchSnapshot();
});
