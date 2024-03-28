import { render } from '@testing-library/react'
import DisplayTimer from './display_timer'
import "setimmediate";

test('renders on-screen', () => {
    const page = render(<DisplayTimer/>);
    expect(page).toMatchSnapshot();
  });