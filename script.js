const gameBoard = (() => {
    // const gameArray = new Array(9).fill(null);
    const gameArray = new Array(9).fill("X");
    return {gameArray}
})();


const displayController = (() => {
    const renderGameBoard = () => {
        const gameArray = gameBoard.gameArray;
        const grid = document.querySelector(".board").children;
        for (let i = 0; i < grid.length; i++) {
            const element = grid[i];
            element.textContent = gameArray[i];
        }
    };
    return {renderGameBoard}
})();

displayController.renderGameBoard();