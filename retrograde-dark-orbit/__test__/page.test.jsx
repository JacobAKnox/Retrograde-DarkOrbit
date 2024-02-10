import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Page from '../src/app/page';

it('renders homepage unchanged', () => {
  const { container } = render(<Page />)
  expect(container).toMatchSnapshot()
})

it('renders homepage unchanged', () => {
    const { container } = render(<Page />)
    expect(container).toMatchSnapshot()
  })