import { render } from '@testing-library/react'
import Header from './header';

it('renders header unchanged', () => {
    const page = render(<Header/>);
    expect(page).toMatchSnapshot();
});