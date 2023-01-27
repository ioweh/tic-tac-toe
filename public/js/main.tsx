import React from 'react';
import ReactDOM from 'react-dom';
import Game from 'components/Game'

const MainComponent = (): JSX.Element => {
    return (
    <Game />
    );
}

ReactDOM.render(<MainComponent />, document.getElementById('container'));
