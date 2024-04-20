import { render } from '@testing-library/react'
import "setimmediate";
import WideChatBox from './wide_chat_box';

it('chat_box component test', () => {
    const page = render(<WideChatBox/>);
    expect(page).toMatchSnapshot();
});