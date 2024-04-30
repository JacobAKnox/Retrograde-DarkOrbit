import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, act } from '@testing-library/react';
import Display_user_list from './display_user_list'; 
import * as socket from '../server/socket'; 

jest.mock('../server/socket', () => ({
  request_current_player_list: jest.fn(),
  listen_update_player_list: jest.fn(),
}));

describe('<Display_user_list />', () => {

  const TestPlayerList = [
    { id: '1', name: 'Player1', ready: true },
    { id: '2', name: 'Player2', ready: false },
  ];

  beforeEach(() => {
    socket.request_current_player_list.mockReset();
    socket.listen_update_player_list.mockReset();

    socket.listen_update_player_list.mockImplementation((callback) => {
      callback(TestPlayerList);
    });
  });

  it('should request and display player list on mount', () => {
    render(<Display_user_list />);

    expect(socket.request_current_player_list).toHaveBeenCalledTimes(1);

    act(() => {
      socket.listen_update_player_list.mock.calls[0][0](TestPlayerList);
    });

    expect(screen.getByText('Player1')).toBeInTheDocument();
    expect(screen.getByText('✅')).toBeInTheDocument();
    expect(screen.getByText('Player2')).toBeInTheDocument();
    expect(screen.getByText('❌')).toBeInTheDocument();
  });
});