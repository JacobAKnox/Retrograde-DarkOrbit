import { render } from '@testing-library/react';
import UserList from './user_list'; 

describe('UserList Component', () => {
  it('renders correctly and matches snapshot', () => {
    const { asFragment } = render(<UserList />);
    expect(asFragment()).toMatchSnapshot();
  });
});
