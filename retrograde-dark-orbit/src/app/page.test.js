import { render } from '@testing-library/react'
const { default: Home } = require("./page");
import "setimmediate";

it('renders main page unchanged', () => {
    const page = render(<Home/>);
    expect(page).toMatchSnapshot();
});