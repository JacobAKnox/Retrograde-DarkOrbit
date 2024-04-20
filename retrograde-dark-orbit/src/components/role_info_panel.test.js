import { render } from '@testing-library/react'
import "setimmediate";
import RoleInfo from './role_info_panel';

it('renders on-screen', () => {
    const page = render(<RoleInfo/>);
    expect(page).toMatchSnapshot();
});