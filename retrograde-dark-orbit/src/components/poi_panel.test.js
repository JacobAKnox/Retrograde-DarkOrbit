import { render } from '@testing-library/react'
import "setimmediate";
import POIPanel from './poi_panel';

it('chat_box component test', () => {
    const page = render(<POIPanel/>);
    expect(page).toMatchSnapshot();
});