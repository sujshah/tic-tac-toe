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
    const checkAllEqual = (array) => {
        const contents = array.map(x => x.getContent());
        return contents.every(x => (x === contents[0]) && (contents[0] !== null))
    }
    const isWinner = () => {
        for (let i = 0; i < 3; i++) {
            const row = [gameArray[i * 3], gameArray[i * 3 + 1], gameArray[i + 3 + 2]];
            const column = [gameArray[i], gameArray[i + 3], gameArray[i + 6]]
            if (checkAllEqual(row) || checkAllEqual(column)) return true;
        }
        const diagonal_1 = [gameArray[0], gameArray[4], gameArray[8]];
        const diagonal_2 = [gameArray[2], gameArray[4], gameArray[6]];
        return !!(checkAllEqual(diagonal_1) || checkAllEqual(diagonal_2));
    }

    return {
        gameArray,
        printBoard,
        assignMarker,
        emptyCell,
        renderGameBoard,
        isWinner
    }
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
            if (gameBoard.isWinner()) {
                console.log(`${player1.getMarker()} Wins!`)
            }
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