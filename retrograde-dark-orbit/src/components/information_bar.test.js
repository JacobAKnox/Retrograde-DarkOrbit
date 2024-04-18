
jest.mock('../server/socket', () => ({
  listen_status_bar_update: jest.fn().mockImplementation((callback) => {
    callback({ crew: 80, health: 90, fuel: 70, lifeSupport: 60, power: 50 });
  })
}));

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import InformationBar from './information_bar';
import {listen_status_bar_update} from '../server/socket';

describe('<InformationBar />', () => {

  beforeEach(() => {
    listen_status_bar_update.mockClear();
  });

  it('renders correctly', () => {

    const { getByText } = render(<InformationBar />);

    expect(getByText(/crew/i)).toBeInTheDocument();
    expect(getByText(/ship health/i)).toBeInTheDocument();
    expect(getByText(/fuel/i)).toBeInTheDocument();
    expect(getByText(/life support/i)).toBeInTheDocument();
    expect(getByText(/power/i)).toBeInTheDocument();

  });


  it('updates progress bars when socket emits new game status', async () => {

    render(<InformationBar />);

    await waitFor(() => {

      const progressBarCrew = document.querySelector('progress[aria-label="Crew"]');
      expect(progressBarCrew).toHaveAttribute('value', '80');

      const progressBarHealth = document.querySelector('progress[aria-label="Ship Health"]');
      expect(progressBarHealth).toHaveAttribute('value', '90');

      const progressBarFuel = document.querySelector('progress[aria-label="Fuel"]');
      expect(progressBarFuel).toHaveAttribute('value', '70');

      const progressBarLifeSupport = document.querySelector('progress[aria-label="Life Support"]');
      expect(progressBarLifeSupport).toHaveAttribute('value', '60');

      const progressBarPower = document.querySelector('progress[aria-label="Power"]');
      expect(progressBarPower).toHaveAttribute('value', '50');

    });
  });
});
