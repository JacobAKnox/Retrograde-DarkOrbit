import { render } from '@testing-library/react'
import LobbyPanel from './lobby_panel'

test('renders on-screen', () => {
  const page = render(<LobbyPanel/>);
  expect(page).toMatchSnapshot();
});
