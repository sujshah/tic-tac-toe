const Player = ((marker_type) => {
    const getMarker = () => {
        return marker_type;
    }
    return {getMarker}
});

const cell = (() => {
    let content = null;
    const assignPlayer = (player) => {
        content = player.getMarker();
    };
    const getContent = () => content;
    return {assignPlayer, getContent};
});

const gameBoard = (() => {
    let gameArray = Array.from({length: 9}, cell);
    const printBoard = () => gameArray.map((cell) => cell.getContent());
    const assignMarker = (position, currentPlayer) => gameArray[position].assignPlayer(currentPlayer);
    const emptyCell = (position) => gameArray[position].getContent() === null;
    const renderGameBoard = () => {
        const grid = document.querySelector(".board").children;
        for (let i = 0; i < grid.length; i++) {
            const element = grid[i];
            element.textContent = gameArray[i].getContent();
        }
    };
    return {gameArray, printBoard, assignMarker, emptyCell, renderGameBoard}
})();

const gameController = (() => {
    const player1 = Player("X");
    const player2 = Player("0");
    let currentPlayer = player1;
    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1
    }
    const playRound = (event) => {
        const position = identifyClickLocation(event.target);
        if (gameBoard.emptyCell(position)) {
            gameBoard.assignMarker(position, currentPlayer);
            gameBoard.renderGameBoard();
            switchPlayer();
        }
    }
    const identifyClickLocation = (child) => {
        return [].indexOf.call(child.parentNode.children, child);
    }

    const playGame = () => {
        const grid = document.querySelector(".board");
        grid.addEventListener("click", playRound);
    }

    return {playGame}
})();

gameController.playGame();