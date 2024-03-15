import { render } from '@testing-library/react'
import Header from './header';
import "setimmediate";

it('renders header unchanged', () => {
    const page = render(<Header/>);
    expect(page).toMatchSnapshot();
});
