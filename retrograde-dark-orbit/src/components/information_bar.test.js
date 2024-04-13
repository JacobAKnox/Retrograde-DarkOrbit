import { render, screen } from '@testing-library/react';
import InformationBar from './information_bar';

describe('GameInfoBar', () => {
  it('displays updated progress bars based on game state', () => {
    const initialState = { crew: 0, health: 100, fuel: 100, experience: 0, power: 1 };
    const { rerender } = render(<InformationBar gameState={initialState} />);

    expect(screen.getByLabelText('Crew').value).toBe(0);
    expect(screen.getByLabelText('Ship Health').value).toBe(100);  

    const updatedState = { crew: 4, health: 80, fuel: 100, experience: 2, power: 1 };
    rerender(<InformationBar gameState={updatedState} />);

    expect(screen.getByLabelText('Crew').value).toBe(4);
    expect(screen.getByLabelText('Ship Health').value).toBe(80);
  });
});

