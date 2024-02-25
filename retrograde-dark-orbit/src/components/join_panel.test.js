import { screen, render, fireEvent } from '@testing-library/react'
import JoinPanel from './join_panel'
 
describe("join lobby form", () => {
  const mockcb = jest.fn((username, code) => {return Promise.resolve({status: 200, uuid: 123})});

  it('renders join panel unchanged', () => {
    const form = render(<JoinPanel try_join_lobby={mockcb}/>);
    expect(form).toMatchSnapshot();
  });

  it('does not call join function when form is not filled', () => {
    render(<JoinPanel try_join_lobby={mockcb}/>);
    const join_button = screen.getByRole('button', { name: 'Join' });

    fireEvent.click(join_button);
    expect(mockcb).not.toHaveBeenCalled();
  });

  it('calls join function when the button is pressed', () => {
    const mocknav = jest.fn((loc) => {return Promise.resolve();}); 
    render(<JoinPanel try_join_lobby={mockcb} navigation={mocknav}/>);

    const username = screen.getByLabelText("Username");
    const code = screen.getByLabelText("Code");
    const join_button = screen.getByRole('button', { name: 'Join' });

    fireEvent.change(username, { target: { value: 'test' } });
    fireEvent.change(code, { target: { value: 'ABCD' } });
    fireEvent.click(join_button);

    expect(mockcb.mock.calls).toHaveLength(1);

    expect(mockcb.mock.calls[0][0]).toBe("test");
    expect(mockcb.mock.calls[0][1]).toBe("ABCD");
  });

  it("fails", () => {
    expect(false).toBe(true);
  });
});