import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import './index.css';

export type CellHandle = {
  AIToggle: () => void;
  setCellToggled: () => void;
  highlight: () => void;
  reset: () => void;
};

const Cell = ({ x, y, humanToggle }:
    { x: number, y: number, humanToggle: (x: number, y: number) => Promise<void>}, ref):
    JSX.Element => {
    const [toggled, setToggled] = useState<boolean>(false);
    
    // here, we need to call the methods of this component from the parent
    // that is why we use a ref
    const cellRef: React.RefObject<HTMLInputElement> = useRef(null);
    
    useImperativeHandle(ref, () => ({
        AIToggle(): void {
            if (cellRef && cellRef.current) {
                cellRef.current.className = "tic-tac-toe-cell o-cell";
                setToggled(true);
            }
        },
        setCellToggled(): void {
            setToggled(true);
        },
        highlight(): void {
            if (cellRef && cellRef.current) {
                cellRef.current.className += " winning-cell";
            }
        },
        reset(): void {
            if (cellRef && cellRef.current) {
                cellRef.current.className = "tic-tac-toe-cell";
                setToggled(false);
            }
        }
    }));

    // we also need to use a ref to update DOM inside the component
    const handleClick = (): void => {
        if (!toggled) {
            if (cellRef && cellRef.current) {
                cellRef.current.className = "tic-tac-toe-cell x-cell";
            }
            humanToggle(x, y);
            setToggled(true);
        }
    }

    return (
    <>
      <div
        className='tic-tac-toe-cell'
        onClick={handleClick}
        ref={cellRef} />
    </>
    );
};

export default forwardRef(Cell);
