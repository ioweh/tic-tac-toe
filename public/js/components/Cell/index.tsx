import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import './index.css';

const Cell = forwardRef(({ x, y, humanToggle }: any, ref): JSX.Element => {
    const [toggled, setToggled] = useState<boolean>(false);
    
    const cellRef: React.RefObject<HTMLInputElement> = useRef(null);
    
    useImperativeHandle(ref, () => ({
        AIToggle() {
            if (cellRef && cellRef.current) {
                cellRef.current.className = "tic-tac-toe-cell o-cell";
                setToggled(true);
            }
        },
        setCellToggled() {
            setToggled(true);
        },
        highlight() {
            if (cellRef && cellRef.current) {
                cellRef.current.className += " winning-cell";
            }
        },
        reset() {
            if (cellRef && cellRef.current) {
                cellRef.current.className = "tic-tac-toe-cell";
                setToggled(false);
            }
        }
    }));

    const handleClick = () => {
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
});

export default Cell
