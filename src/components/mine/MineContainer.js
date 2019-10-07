import React, {Component} from 'react';
import Mine from "./Mine";
import {RandomNumber} from "../../utilities/RandomNumber";
import {CellLocator} from "../../utilities/CellLocator";

class MineContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            x: 16,
            y: 16,
            rows: [],
            mines: 40
        };
        this.generateMines = this.generateMines.bind(this);
        this.handleRightClick = this.handleRightClick.bind(this);
        this.handleLeftClick = this.handleLeftClick.bind(this);
    }

    componentDidMount() {
        this.generateMines();
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
        this.setState({rows: rows});
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
        this.setState({rows: rows});

    }

    handleLeftClick(cell, rowIndex, cellIndex) {
        let rows = this.state.rows;

        if (cell.state === 'flag') {
            return false;
        }

        if (cell.state === 'open') {
            const cellAround = CellLocator.getAroundByIndex(rows, rowIndex, cellIndex);
            const flagCount = cellAround.filter(data => data && data.state === 'flag');

            if (cell.minesAround === flagCount.length) {
                cellAround.map((data) => {
                    if (!data || data.state === 'flag' || data.state === 'open') {
                        return false;
                    }
                    console.log(data);

                    data.state = 'open';
                    rows[data.position.y][data.position.x].state = 'open';

                    if (data.minesAround === 0) {
                        console.log(document.querySelector(`.js-${cell.cellNo}`));
                        document.querySelector(`.js-${data.cellNo}`).click();
                    }
                });
            }
            this.setState({rows: rows});
            return;
        }

        cell.state = 'open';
        rows[rowIndex][cellIndex] = cell;

        if (cell.minesAround === 0) {
            rows = CellLocator.getAllZeroAroundByIndex(rows, rowIndex, cellIndex);
        }

        this.setState({rows: rows});
    }

    render() {
        return (
            <div>
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
