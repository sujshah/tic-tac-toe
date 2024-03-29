const X = "X";
const O = "O";



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
            if (gameArray[i].getContent() === X) {
                if (!(element.hasChildNodes())) {
                    const node = document.createElement("div");
                    node.classList.add("x")
                    element.appendChild(node);
                }
            } else if (gameArray[i].getContent() === O) {
                if (!(element.hasChildNodes())) {
                    const node = document.createElement("div");
                    node.classList.add("o")
                    element.appendChild(node);
                }
            } else {
                element.innerHTML = "";
            }
        }
    };
    const checkAllEqual = (array) => {
        const contents = array.map(x => x.getContent());
        return contents.every(x => (x === contents[0]) && (contents[0] !== null))
    }
    const isWinner = () => {
        for (let i = 0; i < 3; i++) {
            const row = [gameArray[i * 3], gameArray[i * 3 + 1], gameArray[i * 3 + 2]];
            const column = [gameArray[i], gameArray[i + 3], gameArray[i + 6]]
            if (checkAllEqual(row) || checkAllEqual(column)) return true;
        }
        const diagonal_1 = [gameArray[0], gameArray[4], gameArray[8]];
        const diagonal_2 = [gameArray[2], gameArray[4], gameArray[6]];
        return !!(checkAllEqual(diagonal_1) || checkAllEqual(diagonal_2));
    }
    const resetBoard = () => {
        gameArray = Array.from({length: 9}, cell);
        renderGameBoard();
    }

    return {
        printBoard,
        assignMarker,
        emptyCell,
        renderGameBoard,
        isWinner,
        resetBoard,
    }
})();

const gameController = (() => {
    const player1 = Player(X);
    const player2 = Player(O);
    let currentPlayer = player1;
    const markPlayer = () => {
        const id = currentPlayer.getMarker() === X ? "playerOne" : "playerTwo";
        const other = currentPlayer.getMarker() === X ? "playerTwo" : "playerOne";
        const element = document.getElementById(id);
        const otherElement = document.getElementById(other);
        element.disabled = false;
        element.focus();
        otherElement.disabled = true;
    }

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1
    }
    const playRound = (event) => {
        if (gameBoard.isWinner()) return;
        const position = identifyClickLocation(event.target);
        if (gameBoard.emptyCell(position)) {
            gameBoard.assignMarker(position, currentPlayer);
            gameBoard.renderGameBoard();
            if (gameBoard.isWinner()) {
                const winnerElement = document.createElement('div');
                winnerElement.classList.add("winner")
                winnerElement.textContent = `${currentPlayer.getMarker()} Wins!`;
                document.body.appendChild(winnerElement);
                currentPlayer = player1;
                return;
            }
            switchPlayer();
            markPlayer();
        }
    }
    const removeWinnerStatement = () => {
        const winnerElement = document.getElementsByClassName('winner');
        while (winnerElement[0]) {
            winnerElement[0].parentNode.removeChild(winnerElement[0]);
        }
    }
    const identifyClickLocation = (child) => {
        return [].indexOf.call(child.parentNode.children, child);
    }


    return {playRound, removeWinnerStatement, markPlayer}
})();

const displayController = (() => {
    const watchResetButton = () => {
        const startButton = document.querySelector(".reset");
        startButton.addEventListener("click", resetGame);
    }
    const resetGame = () => {
        gameBoard.resetBoard();
        gameController.removeWinnerStatement();
        gameController.markPlayer();
    }
    const startGame = () => {
        resetGame();
        const grid = document.querySelector(".board");
        grid.addEventListener("click", gameController.playRound);
    }

    return {startGame, watchResetButton}
})();

displayController.startGame();
displayController.watchResetButton();

