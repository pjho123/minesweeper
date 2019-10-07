import React from 'react';
import './App.css';
import MineContainer from "./components/mine/MineContainer";

function App() {
    document.addEventListener('contextmenu', event => {
        event.preventDefault();
    });

    return (
        <div className="App">
            <header className="App-header">
                <MineContainer/>
            </header>
        </div>
    );
}

export default App;
