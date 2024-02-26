import { render } from '@testing-library/react'
import ChatBox from './chat_box';
import "setimmediate";

it('chat_box component test', () => {
    const page = render(<ChatBox/>);
    expect(page).toMatchSnapshot();
});