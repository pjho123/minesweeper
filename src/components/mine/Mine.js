import React from 'react';

const Mine = ({cell, onLeftClick, onRightClick}) => {
    const classList = `mine js-${cell.cellNo} ${cell.mine && cell.state === 'open' ? 'red' : ''} ${cell.state}`;
    return (
        <span className={classList}
              onContextMenu={onRightClick}
              onClick={onLeftClick}
              data-mine={cell.minesAround || ''}
              title={cell.cellNo}>
            {/*{cell.state === 'open' ? cell.minesAround : ' '}*/}
        </span>
    );
};

export default Mine;
