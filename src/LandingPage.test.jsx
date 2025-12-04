import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from './LandingPage';

describe('LandingPage', () => {

test('App renders without crashing', () => {
  render (
  <MemoryRouter initialEntries={['/']} >
     <LandingPage />
  </MemoryRouter>
);
  expect(screen.getByText(/start your fitness game/i)).toBeInTheDocument()
  });
});  

/*  



  it('shoud render SING UP and LOGIN buttons', () => {
    render(<LandingPage />);
    expect(screen.getByText('SING UP')).toBeInTheDocument();
    expect(screen.getByText('LOGIN')).toBeInTheDocument();
  });
});

describe('LandingPage navigation', () => {
  it('should navigate to /signup when SIGN UP button is clicked', () => {
    render(
      <MemoryRouter initialEntries={['']}>
        <LandingPage />
      </MemoryRouter>
      );
      fireEvebt.click(screen.getByText('SIGN UP'));
      expect(window.location.pathname).toBe('/signup');
    });

    it('should navigate to /login when LOGIN button is clicked', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <LandingPage />
        </MemoryRouter>
      );
      fireEvent.click(screen.getByText('LOGIN'));
      expect(window.location.pathname,).toBe('/login')
    });
  });
  
  describe('LandingPage', () => {
    it('shoud render the logo component', () => {
      render(<LandingPage />);
      expect (screen.getByTestId('logo')).toBeInTheDocument();
    });
  });
*/