import { render } from '@testing-library/react'
import "setimmediate";
import IncreaseDecrease from './in_de_component';

it('chat_box component test', () => {
    const page = render(<IncreaseDecrease/>);
    expect(page).toMatchSnapshot();
});