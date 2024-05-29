import React from 'react';
import { render} from '@testing-library/react';
import '@testing-library/jest-dom'; 
import InformationBar from './information_bar';

describe('<InformationBar />', () => {

  it('renders correctly', () => {

    const page = render(<InformationBar/>);
    expect(page).toMatchSnapshot();
  });
});
