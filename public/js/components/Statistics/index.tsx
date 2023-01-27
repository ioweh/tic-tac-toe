import React from "react";
import './index.css';

interface StatisticsProps {
  humanVictoriesCount: number;
  tiesCount: number;
  AIVictoriesCount: number;
}

const Statistics = (props: StatisticsProps): JSX.Element => {
    return (
    <>
      <div className="statistics">
        <div className="statistics-item">
            <div className="statistics-item-title">Human (X)</div>
            <div className="statistics-item-value">{props.humanVictoriesCount}</div>
        </div>
        <div className="statistics-item">
            <div className="statistics-item-title">Tie</div>
            <div className="statistics-item-value">{props.tiesCount}</div>
        </div>
        <div className="statistics-item">
            <div className="statistics-item-title">AI (O)</div>
            <div className="statistics-item-value">{props.AIVictoriesCount}</div>
        </div>
      </div>
    </>
    );
}

export default Statistics
