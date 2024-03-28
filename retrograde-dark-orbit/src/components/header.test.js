import { render } from '@testing-library/react'
import Header from './header';
import "setimmediate";

jest.mock('next/image');

it('renders header unchanged', () => {
    const page = render(<Header/>);
    expect(page).toMatchSnapshot();
});
