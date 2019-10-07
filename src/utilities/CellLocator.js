export const CellLocator = {
    getCellAroundCellNo: (cellNo, xLength) => {
        const top = cellNo - xLength;
        const bottom = cellNo + xLength;
        const cellPos = cellNo % xLength;
        let numberAround = [
            top, // north
            bottom, // south
        ];

        if (cellPos !== 0) { // left edge
            numberAround = numberAround.concat([
                cellNo - 1, //west
                bottom - 1, //south west
                top - 1, // north west
            ]);
        }

        if (cellPos !== (xLength - 1)) { // right edge
            numberAround = numberAround.concat([
                cellNo + 1, // east
                top + 1, // north east
                bottom + 1, // south east,
            ])
        }

        return numberAround;
    },
    getAllZeroAroundByIndex(rows, rowIndex, cellIndex) {
        let doneIndices = [];
        doneIndices[rowIndex] = [];
        doneIndices[rowIndex][cellIndex] = true;

        const checkAroundRecursive = (ri, ci) => {
            CellLocator.getAroundByIndex(rows, ri, ci).map((data) => {
                if (!data || (doneIndices[data.position.y] && doneIndices[data.position.y][data.position.x])) {
                    return false;
                }

                doneIndices[data.position.y] = doneIndices[data.position.y]  || [];
                doneIndices[data.position.y][data.position.x] = true;

                if (data.minesAround === 0 && data.state !== 'open') {
                    checkAroundRecursive(data.position.y, data.position.x);
                }

                rows[data.position.y][data.position.x].state = 'open';
            });
        };

        checkAroundRecursive(rowIndex, cellIndex);

        return rows;
    },
    getAroundByIndex: (rows, rowIndex, cellIndex) => {
        const northIndex = rowIndex - 1;
        const southIndex = rowIndex + 1;
        const northRow = rows[northIndex] || [];
        const southRow = rows[southIndex] || [];
        const middleRow = rows[rowIndex];

        return [
            northRow[cellIndex] || false, // n
            southRow[cellIndex] || false, // s
            northRow[cellIndex + 1] || false, // ne
            southRow[cellIndex + 1] || false, // se
            middleRow[cellIndex + 1] || false, // e
            northRow[cellIndex - 1] || false, // nw
            southRow[cellIndex - 1] || false, // sw
            middleRow[cellIndex - 1] || false // w
        ]
    }
};
