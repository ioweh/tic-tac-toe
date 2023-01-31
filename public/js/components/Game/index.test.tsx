import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import Game from './index';

test('renders restart button', () => {
  render(<Game />);

  const restartButton = screen.getByText(/restart/i);

  expect(restartButton).toBeInTheDocument();
});

test('renders nine tic-tac-toe cells', () => {
    const {container} = render(<Game />);

    const cells = container.getElementsByClassName('tic-tac-toe-cell');

    expect(cells).toHaveLength(9);
});

test('renders an empty board on game start', () => {
    const {container} = render(<Game />);

    const cells = container.getElementsByClassName('tic-tac-toe-cell');

    for (let i = 0; i < cells.length; i++) {
        expect(cells[i]).not.toHaveClass("x-cell");
        expect(cells[i]).not.toHaveClass("o-cell");
    }
});

test('makes possible for the user to make a move', () => {
    const {container} = render(<Game />);

    const cells = container.getElementsByClassName('tic-tac-toe-cell');
    const firstCell = cells[0];
    fireEvent.click(firstCell);

    expect(firstCell).toHaveClass("x-cell");
});

test('renders an empty board on restarting the game', () => {
    const {container} = render(<Game />);

    const cells = container.getElementsByClassName('tic-tac-toe-cell');
    const firstCell = cells[0];
    fireEvent.click(firstCell);
    const restartButton = screen.getByText(/restart/i);
    fireEvent.click(restartButton);

    for (let i = 0; i < cells.length; i++) {
        expect(cells[i]).not.toHaveClass("x-cell");
    }
});
