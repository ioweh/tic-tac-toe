import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import Cell from './index';

test('renders initially untoggled', () => {
    const x=2;
    const y=2;
    const humanToggle = jest.fn().mockResolvedValue(null);
    
    const {container} = render(<Cell
        x={2}
        y={2}
        humanToggle={humanToggle}
    />);
    const cell = container.getElementsByClassName("tic-tac-toe-cell")[0];

    expect(cell).not.toHaveClass("x-cell");
    expect(cell).not.toHaveClass("o-cell");
});

test('toggles cell on click', () => {
    const x=2;
    const y=2;
    const humanToggle = jest.fn().mockResolvedValue(null);
    
    const {container} = render(<Cell
        x={2}
        y={2}
        humanToggle={humanToggle}
    />);
    const cell = container.getElementsByClassName("tic-tac-toe-cell")[0];
    fireEvent.click(cell);

    expect(cell).toHaveClass("x-cell");
});
