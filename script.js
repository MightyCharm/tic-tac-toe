// get buttons for confirm player name and restart
const player1Button = document.querySelector("#player1-button");
const player2Button = document.querySelector("#player2-button");
const restartButton = document.querySelector("#restart-button");
// get textbox in GUI
const gameInfoText = document.querySelector("#item-game-info-text");
gameInfoText.innerHTML = "Player 1 it's your turn!";

// get all buttons that represent the gameboard
const buttons = document.querySelectorAll("#btn");
buttons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
        // console.log("button clicked");
        const btn = event.target;
        //console.log(btn.getAttribute("data-id"));
        connectGUI.playGame(btn);
    })
})

player1Button.addEventListener("click", () => {
    console.log("set name for player1");
})

player2Button.addEventListener("click", () => {
    console.log("set name for player2");
})

restartButton.addEventListener("click", () => {
    game.restart();
})

// Object for displaying the game on the page
connectGUI = (function () {

    //  main loop of the game, do something if button was pressed
    const playGame = (btn) => {
        //console.log(btn.getAttribute("data-id"));
        // 1. check if button that was pressed is empty
        let empty = game.checkForEmptyButton(btn);
        // console.log(`empty button: ${empty}`);
        // if button was not empty, check if there is at least on button empty on the gameboard
        if (empty === false) {
            return
        };
        // 2. if button was empty get Player Sign and Insert it into Button
        game.setTurn(btn);
        // 3. Check for winning condition
        let winnerFound = game.checkForWinner();
        // console.log(`winnerFound: ${winnerFound}`);
        if (winnerFound == true) {
            gameInfoText.innerHTML = game.getWinner();
            game.disableButtons();

            return;
        }
        // 5. check for empty spot on board
        //    if no empty spot..game over and no winner
        let spaceOnBoard = game.checkForEmptySpot();
        if (spaceOnBoard === false) {
            gameInfoText.innerHTML = game.getNoWinner();
            game.disableButtons();
            return;
        }
        // 6. render game info text
        gameInfoText.innerHTML = game.renderTextNextTurn();
    }
    return { playGame };
})();

// Game factory function (for the flow of the game)
const game = (function () {
    const renderTextNextTurn = () => {
        let lastTurn = gameBoard.getLastSignSet();
        let textOutput;
        // console.log(`last turn: ${lastTurn}`)
        switch (lastTurn) {
            case "":
                textOutput = "Player 1 ";
                break;
            case "X":
                textOutput = "Player  2 ";
                break;
            case "O":
                textOutput = "Player 1 ";
                break;
            default:
                console.log("something went wrong, you shouldn't see me!");
                break;
        }
        textOutput += "it's your turn!";
        return textOutput;
    }

    // set player sign
    const setTurn = (btn) => {
        gameBoard.setBoardButtons(btn);
    }

    // get variable board
    const getBoardArray = () => {
        //console.log(gameBoard.getBoard());
        return gameBoard.getBoardArray();
    }

    // i don't need that in UI
    // get output for terminal
    const outputBoardArray = () => {
        return gameBoard.outputBoardArray();
    }

    const checkForWinner = (player) => {
        // need logic
        let result;
        // if one check is true cancel rest return true (winner was found)
        // if all checks are false, return false (no winner was found)

        result = gameBoard.checkRows(player);
        // console.log(`1) check rows              => result: ${result}`);
        if (result === true) return result;

        result = gameBoard.checkColumns(player);
        // console.log(`2) check columns           => result: ${result}`);
        if (result === true) return result;

        result = gameBoard.checkCrossLeftToRight(player);
        // console.log(`3) check cross left/right  => result: ${result}`);
        if (result === true) return result;

        result = gameBoard.checkCrossRightToLeft(player);
        // console.log(`4) check cross right/left  => result: ${result}`);
        return result;

    }

    // check if button that was pressed is empty or not
    const checkForEmptyButton = (btn) => {
        let content = btn.innerHTML;
        if (content === "") return true
        return false;
    }

    // check if board has at least one empty spot
    const checkForEmptySpot = () => {
        let result;
        result = gameBoard.checkForEmptySpot();
        return result;
    }

    const getWinner = () => {

        let winnerSign;
        let winnerText = "Congratulation! ";
        winnerSign = gameBoard.getLastSignSet();
        switch (winnerSign) {
            case "X":
                winnerText += "Player 1 "
                break;
            case "O":
                winnerText += "Player 2 "
                break;
            default:
                console.log("Something went wrong, you shouldn't see me!");
                break;
        }
        winnerText += "has won the game!"
        // console.log(textWinner + " has won the game!");
        return winnerText;

    }

    const getNoWinner = () => {
        return "Board is full. Game Over!";
    }

    const restart = () => {
        // clear board array
        gameBoard.clearBoardArray();
        // clear lastSignSet
        gameBoard.clearLastSignSet();
        // clear text inside buttons to display empty board
        buttons.forEach((btn) => {
            btn.innerHTML = "";
        })
        // reset text
        gameInfoText.innerHTML = renderTextNextTurn();
        // enable buttons (if game over)
        enableButtons();
    }

    const enableButtons = () => {
        buttons.forEach((btn) => {
            btn.disabled = false;
        })
    }

    const disableButtons = () => {
        buttons.forEach((btn) => {
            btn.disabled = true;
        })
    }

    return { setTurn, getWinner, getNoWinner, getBoardArray, outputBoardArray, renderTextNextTurn, checkForWinner, checkForEmptyButton, checkForEmptySpot, restart, enableButtons, disableButtons };
})();

// Gameboard factory function
const gameBoard = (function () {
    let lastSignSet = "";
    let board =
        [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];

    const setBoardButtons = (btn) => {
        // 1. set player input in GUI
        // 2. set player input in board array
        let data_id = btn.getAttribute("data-id").split(" "); // get data-id from button(=equal to index in board array)
        let index_1 = data_id[0];
        let index_2 = data_id[1];
        //console.log(`index_1: ${index_1} index_2: ${index_2}`);
        // console.log(`btn: ${btn.getAttribute("data-id")}`);
        if (lastSignSet === "") {
            btn.innerHTML = player1.getSign();
            lastSignSet = player1.getSign();
            board[index_1][index_2] = player1.getSign();
        } else if (lastSignSet === "X") {
            btn.innerHTML = player2.getSign();
            lastSignSet = player2.getSign();
            board[index_1][index_2] = player2.getSign();
        } else {
            btn.innerHTML = player1.getSign();
            lastSignSet = player1.getSign();
            board[index_1][index_2] = player1.getSign();
        }
    }

    const clearBoardArray = () => {
        board =
            [
                ["", "", ""],
                ["", "", ""],
                ["", "", ""]
            ];
    }

    const getLastSignSet = () => {
        return lastSignSet;
    }

    const clearLastSignSet = () => {
        lastSignSet = "";
    }

    // get variable board
    const getBoardArray = () => {
        return board;
    }

    // get output for terminal
    const outputBoardArray = () => {
        let formattedBoard = "";
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === "") {
                    formattedBoard += "-";
                    continue;
                }
                formattedBoard += board[i][j];
            }
            formattedBoard += "\n";
        }
        return formattedBoard;
    };

    const checkRows = (player) => {
        //let playerSign = player.getSign();
        let playerSign = getLastSignSet();
        // console.log(`playerSign: ${playerSign}`)
        let previousIteration;
        let currentIteration;
        let winner = true;
        for (let i = 0; i < board.length; i++) {
            winner = true;
            for (let j = 0; j < board[i].length; j++) {
                // first iteration in row just get the value and continue with
                // second iteration
                if (j === 0) {
                    previousIteration = board[i][j];
                    continue;
                }
                currentIteration = board[i][j];

                // checks for not equality | for empty strings | for inequality with player sign
                if ((previousIteration != currentIteration) ||
                    (previousIteration === "" && currentIteration === "") ||
                    (previousIteration != playerSign) || (currentIteration != playerSign)) {
                    winner = false;
                    break;
                }
                previousIteration = currentIteration;
            }
            // check after one row if winner is true
            if (winner === true) {
                break;
            }
        }
        return winner;
    }

    const checkColumns = (player) => {
        let playerSign = getLastSignSet();
        // console.log(`playerSign: ${playerSign}`)
        let previousIteration;
        let currentIteration;
        let winner = true;
        // 2. check every column for winner
        for (let j = 0; j < board.length; j++) {
            winner = true;
            for (let i = 0; i < board.length; i++) {
                // check for winning condition
                if (i === 0) {
                    previousIteration = board[i][j];
                    continue;
                }
                currentIteration = board[i][j];

                // checks for not equality | for empty strings | for inequality with player sign
                if ((previousIteration != currentIteration) ||
                    (previousIteration === "" && currentIteration === "") ||
                    (previousIteration != playerSign) || currentIteration != playerSign) {
                    winner = false;
                    break;
                }
                previousIteration = currentIteration;
            }
            if (winner === true) {
                break;
            }
        }
        return winner;

    }

    const checkCrossLeftToRight = (player) => {
        // only two cases
        // case 1:
        // 0 0
        // 1 1
        // 2 2
        let playerSign = getLastSignSet();
        // console.log(`playerSign: ${playerSign}`)
        let previousIteration;
        let currentIteration;
        let winner = true;
        for (let i = 0; i < board.length; i++) {
            if (i === 0) {
                previousIteration = board[i][i];
                continue;
            }
            currentIteration = board[i][i];

            // checks for not equality | for empty strings | for inequality with player sign
            if ((previousIteration != currentIteration) ||
                (previousIteration === "" && currentIteration === "") ||
                (previousIteration != playerSign) || (currentIteration != playerSign)) {
                winner = false;
                break;
            }
            previousIteration = currentIteration;
        }
        return winner;
    }

    const checkCrossRightToLeft = (player) => {
        // case 2:
        // 0 2
        // 1 1
        // 2 0
        let playerSign = getLastSignSet();
        // console.log(`playerSign: ${playerSign}`)
        let previousIteration;
        let currentIteration;
        let winner = true;
        let index_2 = board[0].length - 1;
        for (let i = 0; i < board.length; i++) {
            if (i === 0) {
                previousIteration = board[i][index_2];
                index_2--;
                continue;
            }
            currentIteration = board[i][index_2];
            if ((currentIteration != previousIteration) ||
                (previousIteration === "" && currentIteration === "") ||
                (previousIteration != playerSign) || currentIteration != playerSign) {
                winner = false;
                break;
            }
            index_2--;
            previousIteration = currentIteration;
        }

        return winner;
    }

    const checkForEmptySpot = () => {
        // iterate over array to find at least one "" empty spot
        // if empty spot is found return true
        // if no empty spot is found return false
        let emptySpace = false;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === "") {
                    emptySpace = true;
                    return emptySpace;
                }
            }
        }

        return emptySpace;
    }

    return { setBoardButtons, getBoardArray, clearBoardArray, clearLastSignSet, outputBoardArray, checkRows, checkColumns, checkCrossLeftToRight, checkCrossRightToLeft, checkForEmptySpot, getLastSignSet };
})();

// Player factory function
const player = function (playerSign) {
    let name;
    const sign = playerSign;

    const getName = () => name;
    const getSign = () => sign;

    return { getName, getSign };
}

// Create two player objects
// connectGUI.renderBoard();
const player1 = player("X");
const player2 = player("O");