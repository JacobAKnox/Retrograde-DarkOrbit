import { render } from '@testing-library/react'
import ExitLobbyButton from './exit_lobby_button';

it('renders exit lobby button unchanged', () => {
    const page = render(<ExitLobbyButton/>);
    expect(page).toMatchSnapshot();
});