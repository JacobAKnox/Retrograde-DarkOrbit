import { render } from '@testing-library/react'
import "setimmediate";
import GameOverPanel from './game_over_panel';

test('renders on-screen', () => {
  const page = render(<GameOverPanel/>);
  expect(page).toMatchSnapshot();
});
