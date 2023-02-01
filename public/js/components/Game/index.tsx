import React, { RefObject, useEffect, useRef, useState } from 'react';
import Statistics from '../Statistics';
import Cell, { CellHandle } from '../Cell';
import './index.css';
var TicTacToe = require('tictactoe-ai');

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
    oppositePlayer: (s: string) => string;
}

interface AIPlayer {
    makeMove: () => Location | null;
    initialize: (team: string, board: Board) => void;
}

const Game = (): JSX.Element => {
    const [winnerMessage, setWinnerMessage] = useState<string>("");
    const [humanVictoriesCount, setHumanVictoriesCount] = useState<number>(0);
    const [AIVictoriesCount, setAIVictoriesCount] = useState<number>(0);
    const [tiesCount, setTiesCount] = useState<number>(0);

    const boardSize: number = 3;
    const cellCount: number = 9;

    let board: Board, AITeam: string, AIPlayer: AIPlayer;
    let cellRefArray: RefObject<CellHandle>[] = [];

    for(let i = 0; i < cellCount; i++) {
        const celRef = useRef<CellHandle>(null);
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
    
    const initBoardAndAI = (): void  => {
        board = new TicTacToe.TicTacToeBoard(['', '', '', '', '', '', '', '', '']);
        AITeam = board.oppositePlayer("X");
        AIPlayer = new TicTacToe.TicTacToeAIPlayer();
        AIPlayer.initialize(AITeam, board);
    }

    const resetBoard = (): void => {
        resetCells();
        setWinnerMessage("");
        initBoardAndAI();
    }

    const highlightWinningRow = (indexes: number[]): void => {
        indexes.forEach(index => {
            cellRefArray[index].current?.highlight();
        });
    }

    const highlightAllCells = (): void => {
        cellRefArray.forEach(cell => {
            cell.current?.highlight();
        });
    }

    const resetCells = (): void => {
        cellRefArray.forEach(cell => {
            cell.current?.reset();
        });
    }

    const checkWinner = (board: Board): void => {
        const winner = board.winner();
        if(winner) {
            cellRefArray.forEach(cell => {
                cell.current?.setCellToggled();
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
    
    const humanMakeMove = async (x: number, y: number) => {
        let location: Location = { x, y };

        // first the human moves
        board.makeMove('X', location);
        checkWinner(board);

        // next make AI move
        let move = await AIMakeMove();

        // set the cell to the clicked state
        if (move) {
            const position = move.y * boardSize + move.x;
            cellRefArray[position].current?.AIToggle();
            checkWinner(board);
        }
    }

    // we need the board initialized on rerender
    useEffect(() => {
        initBoardAndAI();
    });

    return (
    <>
      <table id="grid">
       <tbody>
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
       </tbody>
      </table>
      <button onClick={resetBoard}>Restart</button>
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
