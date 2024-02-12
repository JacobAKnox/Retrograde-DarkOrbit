import { render } from '@testing-library/react'
import JoinPanel from './join_panel'
 
it('renders join panel unchanged', () => {
  const { container } = render(<JoinPanel/>)
  expect(container).toMatchSnapshot()
})