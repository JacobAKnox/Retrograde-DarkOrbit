import { render } from '@testing-library/react'
import LobbyPanel from './lobby_panel'
import "setimmediate";

jest.mock('./chat_box', () => () => <div>Mocked ChatBox</div>);
jest.mock('./user_list', () => () => <div>Mocked UserList</div>);
jest.mock('./ready_box', () => () => <div>Mocked ReadyBox</div>);

test('renders on-screen', () => {
  const page = render(<LobbyPanel/>);
  expect(page).toMatchSnapshot();
});
