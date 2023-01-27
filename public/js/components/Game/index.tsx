import React, { SyntheticEvent, useEffect, useState } from 'react';
import Statistics from 'components/Statistics';
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

    // takes the number of milliseconds to await
    function awaitSomeTime(time: number): Promise<void> {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }

    const startNewGame = (): void => {
        const state = initBoardAndAI();
        const { board, AITeam, AIPlayer } = state;
        renderBoard(board, AIPlayer, AITeam);
        setWinnerMessage("");
    }

    const highlightWinningRow = (indexes: number[]): void => {
        indexes.forEach(index => {
            const x = Math.floor(index / width);
            const y = index % height;
            checkboxes[x][y].className = "winning-cell";
        });
    }

    const highlightAllCells = (): void => {
        for(let y = 0; y < height; y++) {
            for(let x = 0; x < width; x++) {
                checkboxes[x][y].className = "winning-cell";
            }
        }
    }

    // in case we already clicked a cell
    const preventClicking = (event: MouseEvent): void => {
        event.preventDefault();
        event.stopPropagation();
    }

    // in the case of a winning
    const preventClickingAllCells = (): void => {
        for (let y = 0; y < height; y++) {
            for(let x = 0; x < width; x++) {
                checkboxes[y][x].onclick = preventClicking;
            }
        }
    }

    const checkWinner = async (board: Board): Promise<void> => {
        const winner = board.winner();
        if(winner) {
            preventClickingAllCells();
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

    const AIMakeMove = async (AIPlayer: AIPlayer, AITeam: string, board: Board): Promise<Location|null> => {
        const timeToAwait: number = 300;
        await awaitSomeTime(timeToAwait);
        var move = AIPlayer.makeMove();
        if(move != null){
            board.makeMove(AITeam, move);
        }
        return move;
    }
    
    const humanMakeMove = async (checkbox: HTMLInputElement, board: Board, AIPlayer: AIPlayer, AITeam: string) => {
        checkbox.onclick = preventClicking;
        let location: Location = {
            x: checkbox["data-x"],
            y: checkbox["data-y"],
        };

        // first the human moves
        board.makeMove('X', location);
        await checkWinner(board);

        // next make AI move
        let move = await AIMakeMove(AIPlayer, AITeam, board);

        // set the checkbox to the clicked state
        if (move) {
            let AISelectedCheckbox = checkboxes[move.y][move.x];
            AISelectedCheckbox.checked = false;
            AISelectedCheckbox.indeterminate = false;
            AISelectedCheckbox.onclick = preventClicking;
            checkWinner(board);
        } else {
            throw new Error('AI cannot make a move!');
        }
    }
    
    const initBoardAndAI = (): GameState => {
        var board = new TicTacToe.TicTacToeBoard(['', '', '', '', '', '', '', '', '']);
        var AITeam = board.oppositePlayer("X");
        var AIPlayer = new TicTacToe.TicTacToeAIPlayer();
        AIPlayer.initialize(AITeam, board);
        return { board, AITeam, AIPlayer };
    }
    
    const renderBoard = (board: Board, AIPlayer: AIPlayer, AITeam: string): void => {
        let grid = document.getElementById('grid');
        grid!.innerHTML = '';
        let fragment = document.createDocumentFragment();
        
        for (let y = 0; y < height; y++) {
            let row = document.createElement('tr');
            checkboxes[y] = [];
            
            for(let x = 0; x < width; x++) {
                let cell = document.createElement('td');
                let checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox["data-x"] = x;
                checkbox["data-y"] = y;
                checkbox.indeterminate = true;
                checkbox.onclick = () => humanMakeMove(checkbox, board, AIPlayer, AITeam);
                checkboxes[y][x] = checkbox;
                
                cell.appendChild(checkbox);
                row.appendChild(cell);
            }
            
            fragment.appendChild(row);
        }

        grid!.appendChild(fragment);
    }

    useEffect(() => {
        startNewGame();
    }, []);

    return (
    <>
      <button onClick={startNewGame}>Restart</button>
      <Statistics
        humanVictoriesCount={humanVictoriesCount}
        tiesCount={tiesCount}
        AIVictoriesCount={AIVictoriesCount}
      />
      {winnerMessage && <h1>{winnerMessage}</h1>}
    </>
    );
}

export default Game
