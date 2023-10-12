import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import App from '../App';
import { Paths } from './paths';

const ROUTES = [[Paths.default]];

describe('Routes', () => {
  test.each(ROUTES)('test %s', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
  });
});
