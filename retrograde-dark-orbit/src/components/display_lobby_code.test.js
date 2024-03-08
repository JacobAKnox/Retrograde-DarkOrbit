import { render } from '@testing-library/react'
import DisplayLobbyCode from './display_lobby_code';

test('renders on-screen', () => {
    const page = render(<DisplayLobbyCode/>);
    expect(page).toMatchSnapshot();
  });