import { render } from '@testing-library/react'
import "setimmediate";
import ExitToLobbyButton from './exit_to_lobby_button';

it('renders exit lobby button unchanged', () => {
    const page = render(<ExitToLobbyButton/>);
    expect(page).toMatchSnapshot();
});