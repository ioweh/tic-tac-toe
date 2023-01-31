import React, { useEffect, useRef, useState } from 'react';
import Statistics from '../Statistics';
import Cell from '../Cell';
import './index.css';
var TicTacToe = require('tictactoe-ai');

const width: number = 3;
const height: number = 3;

// to represent the grid
let checkboxes:HTMLInputElement[][] = [[]];

interface Location {
    x: number;
    y: number;
}

interface Winner {
    cell: string;
    indexes: number[];
}

interface Board {
    makeMove: (team: string, move: Location) => void;
    winner: () => Winner | null;
}

interface AIPlayer {
    makeMove: () => Location | null;
}

interface GameState {
    board: Board;
    AITeam: string;
    AIPlayer: AIPlayer;
}

const Game = (): JSX.Element => {
    const [winnerMessage, setWinnerMessage] = useState<string>("");
    const [humanVictoriesCount, setHumanVictoriesCount] = useState<number>(0);
    const [AIVictoriesCount, setAIVictoriesCount] = useState<number>(0);
    const [tiesCount, setTiesCount] = useState<number>(0);
    let board: Board, AITeam: string, AIPlayer: AIPlayer;

    let cellRefArray: any = [];
    const cellCount = 9;

    for(let i = 0; i < cellCount; i++) {
        const celRef = useRef(null);
        cellRefArray.push(celRef);
    }

    // takes the number of milliseconds to await
    function awaitSomeTime(time: number): Promise<void> {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }
    
    const initBoardAndAI = (): GameState => {
        var board = new TicTacToe.TicTacToeBoard(['', '', '', '', '', '', '', '', '']);
        var AITeam = board.oppositePlayer("X");
        var AIPlayer = new TicTacToe.TicTacToeAIPlayer();
        AIPlayer.initialize(AITeam, board);
        return { board, AITeam, AIPlayer };
    }

    const startNewGame = (): void => {
        const state = initBoardAndAI();
        board = state.board;
        AITeam = state.AITeam;
        AIPlayer = state.AIPlayer;
        resetCells();
        setWinnerMessage("");
    }

    const highlightWinningRow = (indexes: number[]): void => {
        indexes.forEach(index => {
            cellRefArray[index].current.highlight();
        });
    }

    const highlightAllCells = (): void => {
        cellRefArray.forEach(cell => {
            cell.current.highlight();
        });
    }

    const resetCells = () => {
        cellRefArray.forEach(cell => {
            cell.current.reset();
        });
    }

    const checkWinner = (board: Board): void => {
        const winner = board.winner();
        if(winner) {
            cellRefArray.forEach(cell => {
                cell.current.setCellToggled();
            });
            if(winner.cell === 'O') {
                setWinnerMessage("AI won!");
                setAIVictoriesCount(AIVictoriesCount + 1);
                highlightWinningRow(winner.indexes);
            } else if (winner.cell === 'X') {
                setWinnerMessage("Congratulations! You won!")
                setHumanVictoriesCount(humanVictoriesCount + 1);
                highlightWinningRow(winner.indexes);
            } else {
                setWinnerMessage("Tie!")
                setTiesCount(tiesCount + 1);
                highlightAllCells();
            }
        }
    }

    const AIMakeMove = async (): Promise<Location|null> => {
        const timeToAwait: number = 150;
        await awaitSomeTime(timeToAwait);
        // AI player just returns the coords
        var move = AIPlayer.makeMove();
        if(move != null){
            // then the board uses those coords
            board.makeMove(AITeam, move);
        }
        return move;
    }
    
    const humanMakeMove = async (x, y) => {
        if (!board) {
            const state = initBoardAndAI();
            board = state.board;
            AITeam = state.AITeam;
            AIPlayer = state.AIPlayer;
        }
        let location: Location = { x, y };

        // first the human moves
        board.makeMove('X', location);
        checkWinner(board);

        // next make AI move
        let move = await AIMakeMove();

        // set the checkbox to the clicked state
        if (move) {
            const position = move.y * width + move.x;
            cellRefArray[position].current.AIToggle();
            checkWinner(board);
        }
    }

    useEffect(() => {
        startNewGame();
    }, []);

    return (
    <>
      <table id="grid">
        <tr>
            <td>
                <Cell x={0}
                  y={0}
                  ref={cellRefArray[0]}
                  humanToggle={humanMakeMove} />
            </td>
            <td>
                <Cell x={1}
                  y={0}
                  ref={cellRefArray[1]}
                  humanToggle={humanMakeMove} />
            </td>
            <td>
                <Cell x={2}
                  y={0}
                  ref={cellRefArray[2]}
                  humanToggle={humanMakeMove} />
            </td>
        </tr>
        <tr>
            <td>
                <Cell x={0}
                  y={1}
                  ref={cellRefArray[3]}
                  humanToggle={humanMakeMove} />
            </td>
            <td>
                <Cell x={1}
                  y={1}
                  ref={cellRefArray[4]}
                  humanToggle={humanMakeMove} />
            </td>
            <td>
                <Cell x={2}
                  y={1}
                  ref={cellRefArray[5]}
                  humanToggle={humanMakeMove} />
            </td>
        </tr>
        <tr>
            <td>
                <Cell x={0}
                  y={2}
                  ref={cellRefArray[6]}
                  humanToggle={humanMakeMove} />
            </td>
            <td>
                <Cell x={1}
                  y={2}
                  ref={cellRefArray[7]}
                  humanToggle={humanMakeMove} />
            </td>
            <td>
                <Cell x={2}
                  y={2}
                  ref={cellRefArray[8]}
                  humanToggle={humanMakeMove} />
            </td>
        </tr>
      </table>
      <button onClick={startNewGame}>Restart</button>
      <Statistics
        humanVictoriesCount={humanVictoriesCount}
        tiesCount={tiesCount}
        AIVictoriesCount={AIVictoriesCount}
      />
      {winnerMessage && <h1>{winnerMessage}</h1>}
      <img className='x-img'/>
      <img className='o-img'/>
    </>
    );
}

export default Game
