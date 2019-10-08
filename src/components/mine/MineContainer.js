import React, {Component} from 'react';
import Mine from "./Mine";
import {RandomNumber} from "../../utilities/RandomNumber";
import {CellLocator} from "../../utilities/CellLocator";

class MineContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            x: 30,
            y: 16,
            rows: [],
            mines: 99,
            flagCount: 0,
            time: '00:00',
            timeCounter: 0,
            started: false
        };
        this.generateMines = this.generateMines.bind(this);
        this.handleRightClick = this.handleRightClick.bind(this);
        this.handleLeftClick = this.handleLeftClick.bind(this);
        this.timerAction = this.timerAction.bind(this);
        this.handleButtonAction = this.handleButtonAction.bind(this);
        this.updateRows = this.updateRows.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.generateMines();
    }

    updateRows(rows) {
        this.setState({rows: rows});

        setTimeout(() => {
            this.setState({flagCount: document.querySelectorAll('.flag').length});
        }, 100)
    }

    generateMines() {
        const maxNumber = (this.state.x * this.state.y);
        const minesPosition = RandomNumber.byCount(this.state.mines, maxNumber);
        let cellNo = -1;
        const rows = Array.from({length: this.state.y}).map((dRow, y) => {
            return Array.from({length: this.state.x}).map((dCell, x) => {
                cellNo++;
                const hasMine = minesPosition.includes(cellNo);
                const minesCountAround = hasMine
                    ? ''
                    : CellLocator.getCellAroundCellNo(cellNo, this.state.x)
                        .filter(d => minesPosition.includes(d)).length;

                return {
                    cellNo: cellNo,
                    mine: hasMine,
                    minesAround: minesCountAround,
                    state: 'close',
                    position: {
                        y: y,
                        x: x
                    }
                }
            });
        });
        this.updateRows(rows);
    }

    handleRightClick(cell, rowIndex, cellIndex) {
        const rows = this.state.rows;

        switch (cell.state) {
            case 'close':
                cell.state = 'flag';
                break;
            case 'flag':
                cell.state = 'guess';
                break;
            case 'guess':
                cell.state = 'close';
                break;
        }

        rows[rowIndex][cellIndex] = cell;
        this.updateRows(rows);
    }

    handleLeftClick(cell, rowIndex, cellIndex) {
        if (!this.state.started) {
            this.timerAction('start');
        }

        let rows = this.state.rows;

        if (cell.state === 'flag') {
            return false;
        }

        if (cell.state === 'open') {
            const cellAround = CellLocator.getAroundByIndex(rows, rowIndex, cellIndex);
            const flagCount = cellAround.filter(data => data && data.state === 'flag');

            if (cell.minesAround === flagCount.length) {
                cellAround.map(data => {
                    if (!data || data.state === 'flag' || data.state === 'open') {
                        return false;
                    }

                    data.state = 'open';
                    rows[data.position.y][data.position.x].state = 'open';

                    if (data.minesAround === 0) {
                        document.querySelector(`.js-${data.cellNo}`).click();
                    }

                    return true;
                });
            }

            return this.updateRows(rows);
        }

        cell.state = 'open';
        rows[rowIndex][cellIndex] = cell;

        if (cell.minesAround === 0) {
            rows = CellLocator.getAllZeroAroundByIndex(rows, rowIndex, cellIndex);
        }

        this.updateRows(rows);
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: parseInt(target.value)
        });
    }

    handleButtonAction(action) {
        switch (action) {
            case  'play':
                this.generateMines();
                break;
            case  'stop':
                this.timerAction('stop');
                break;
        }
    }

    timerAction(action) {
        switch (action) {
            case  'start':
                if (this.timer) {
                    clearInterval(this.timer);
                }

                this.setState({
                    time: `00:00`,
                    timeCounter: 0,
                    started: true
                });

                this.timer = setInterval(() => {
                    const timeCount = this.state.timeCounter + 1;
                    this.setState({
                        time: `${(Math.trunc(timeCount / 60)).toString().padStart(2, '0')}:${(timeCount % 60).toString().padStart(2, '0')}`,
                        timeCounter: timeCount,
                    });

                }, 1000);
                break;
            case 'pause':
            case 'stop':
                if (this.timer) {
                    clearInterval(this.timer);
                }

                this.setState({started: false});
                break;
        }
    }

    render() {
        return (
            <div>
                <p>
                    <span>Flag: {this.state.flagCount}/{this.state.mines}</span>
                    <span>Timer: {this.state.time}</span>
                </p>
                <p>
                    <span>
                        Width: <input type="number" onChange={this.handleChange} name="x" value={this.state.x}/>
                        Height: <input type="number" onChange={this.handleChange} name="y" value={this.state.y}/>
                        Mines: <input type="number" onChange={this.handleChange} name="mines" value={this.state.mines}/>
                    </span>
                    <button onClick={() => {
                        this.handleButtonAction('play')
                    }}>Play
                    </button>
                    <button onClick={() => {
                        this.handleButtonAction('stop')
                    }}>Stop
                    </button>
                </p>
                {this.state.rows.map((cells, rowIndex) =>
                    <p key={rowIndex}>
                        {cells.map((cell, cellIndex) => {
                            return <Mine onLeftClick={() => this.handleLeftClick(cell, rowIndex, cellIndex)}
                                         onRightClick={() => this.handleRightClick(cell, rowIndex, cellIndex)}
                                         cell={cell}
                                         key={cellIndex}/>
                        })}
                    </p>
                )}
            </div>
        );
    }
}

export default MineContainer;
