import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'
import Statistics from './index';

test('shows correct statistics', () => {
    const humanVictoriesCount=10;
    const tiesCount=22;
    const AIVictoriesCount=55;
    
    render(<Statistics
        humanVictoriesCount={humanVictoriesCount}
        tiesCount={tiesCount}
        AIVictoriesCount={AIVictoriesCount}
    />);
    const humanStats = screen.getByText(/Human/i);
    const tieStats = screen.getByText(/Tie/i);
    const AIStats = screen.getByText(/AI/i);
    const humanStatsValue = humanStats.parentElement?.
      getElementsByClassName("statistics-item-value")[0].textContent;
    const tieStatsValue = tieStats.parentElement?.
      getElementsByClassName("statistics-item-value")[0].textContent;
    const AIStatsValue = AIStats.parentElement?.
      getElementsByClassName("statistics-item-value")[0].textContent;

    expect(humanStats).toBeInTheDocument();
    expect(tieStats).toBeInTheDocument();
    expect(AIStats).toBeInTheDocument();
    expect(humanStatsValue).toBe(humanVictoriesCount.toString());
    expect(tieStatsValue).toBe(tiesCount.toString());
    expect(AIStatsValue).toBe(AIVictoriesCount.toString());
});
