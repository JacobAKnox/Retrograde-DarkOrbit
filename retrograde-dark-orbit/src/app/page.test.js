import { render } from '@testing-library/react'
const { default: Home } = require("./page");

it('renders join panel unchanged', () => {
    const page = render(<Home/>);
    expect(page).toMatchSnapshot();
});