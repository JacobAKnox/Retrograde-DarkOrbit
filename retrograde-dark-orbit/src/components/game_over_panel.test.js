import { render } from '@testing-library/react'
import GamePanel from './game_panel';
import "setimmediate";

test('renders on-screen', () => {
  const page = render(<GamePanel/>);
  expect(page).toMatchSnapshot();
});
