import { render } from '@testing-library/react'
import LobbyPanel from './lobby_panel'
import "setimmediate";

const ChatMock = () => <div>Mocked ChatBox</div>
const UserMock = () => <div>Mocked UserList</div>
const ReadyMock = () => <div>Mocked ReadyBox</div>

jest.mock('./chat_box', () => ChatMock);
jest.mock('./user_list', () => UserMock);
jest.mock('./ready_box', () => ReadyMock);

test('renders on-screen', () => {
  const page = render(<LobbyPanel/>);
  expect(page).toMatchSnapshot();
});
