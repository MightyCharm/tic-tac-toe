// get input elements for names
const player1Input = document.querySelector("#player1-input");
const player2Input = document.querySelector("#player2-input");
// get button elements to confirm player name and restart
const player1Button = document.querySelector("#player1-button");
const player2Button = document.querySelector("#player2-button");
const restartButton = document.querySelector("#restart-button");
const newGameButton = document.querySelector("#new-game-button");
// get elements for the statistic, win, draws and lost
const player1Wins = document.querySelector("#player1-wins-value");
const player1Draws = document.querySelector("#player1-draws-value");
const player1Lost = document.querySelector("#player1-lost-value");
const player2Wins = document.querySelector("#player2-wins-value");
const player2Draws = document.querySelector("#player2-draws-value");
const player2Lost = document.querySelector("#player2-lost-value");


// get textbox in GUI
const gameInfoText = document.querySelector("#box-game-info-text");
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
    // Only change the name if user has actual entered something new into input field
    if (player1Input.value === player1.getName()) return;
    // set name in player object to input value
    player1.setName(player1Input.value);
    // disable OK button so that player can only enter 1 times during the game a name
    player1Button.disabled = true;
    player1Input.disabled = true;
    // render name inside gameInfoText
    gameInfoText.innerHTML = game.renderTextNextTurn();
})

player2Button.addEventListener("click", () => {
    // Only change the name if user has actual entered something new into input field
    if (player2Input.value === player2.getName()) return;
    // set name in player object to input value
    player2.setName(player2Input.value);
    // disable OK button so that player can only enter 1 times during the game a name
    player2Button.disabled = true;
    player2Input.disabled = true;
    // render name inside gameInfoText
    gameInfoText.innerHTML = game.renderTextNextTurn();
    
})

restartButton.addEventListener("click", () => {
    game.restartGame();
})

newGameButton.addEventListener("click", () => {
    game.newGame();
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
            game.renderStatistics();
            game.disableButtons();

            return;
        }
        // 5. check for empty spot on board
        //    if no empty spot..game over and no winner
        let spaceOnBoard = game.checkForEmptySpot();
        if (spaceOnBoard === false) {
            gameInfoText.innerHTML = game.getNoWinner();
            game.renderStatistics();
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
   
    const renderStatistics = () => {
        player1Wins.innerHTML = player1.getWins();
        player1Draws.innerHTML = player1.getDraws();
        player1Lost.innerHTML = player1.getLost();
        player2Wins.innerHTML = player2.getWins();
        player2Draws.innerHTML = player2.getDraws();
        player2Lost.innerHTML = player2.getLost();
    }
    // get output for terminal
    const outputBoardArray = () => {
        return gameBoard.outputBoardArray();
    }

    const renderTextNextTurn = () => {
        console.log("renderText")
        let player1Name;
        let player2Name;
        let lastTurn = gameBoard.getLastSignSet();
        let textOutput;
        // check if player has entered a name
        player1Name = player1.getName();
        if (player1Name === "") {
            player1Name = "Player 1";
        }
        player2Name = player2.getName();
        if (player2Name === "") {
            player2Name = "Player 2";
        } 
        switch (lastTurn) {
            case "":
                textOutput = player1Name;
                break;
            case "X":
                textOutput = player2Name;
                break;
            case "O":
                textOutput = player1Name;
                break;
            default:
                console.log("something went wrong, you shouldn't see me!");
                break;
        }
        textOutput += " it's your turn!";
        console.log(textOutput);
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

        let signWinner;
        let nameWinner
        let textWinner = "Congratulation! ";
        signWinner = gameBoard.getLastSignSet();
        switch (signWinner) {
            case "X":
                nameWinner = player1.getName();
                player1.setWins();
                player2.setLost();
                if (nameWinner === "") {
                    textWinner += "Player 1";
                }
                else {
                    textWinner += nameWinner;
                }
                
                break;
            case "O":
                nameWinner = player2.getName();
                player1.setLost();
                player2.setWins();
                if (nameWinner === "") {
                    textWinner += "Player 2";
                }
                else {
                    textWinner += nameWinner;
                }
                break;
            default:
                console.log("Something went wrong, you shouldn't see me!");
                break;
        }
        textWinner += " has won the game!"
        return textWinner;

    }

    const getNoWinner = () => {
        player1.setDraws();
        player2.setDraws();
        return "Board is full. Game Over!";
    }

    const restartGame = () => {
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

    const newGame = () => {
        // clear board array
        gameBoard.clearBoardArray();
        // clear lastSignSet
        gameBoard.clearLastSignSet();
        // clear text inside buttons to display empty board
        buttons.forEach((btn) => {
            btn.innerHTML = "";
        })
        // enable input and ok button for new game
        player1Input.disabled = false;
        player2Input.disabled = false;
        player1Button.disabled = false;
        player2Button.disabled = false;
        // clear input field
        player1Input.value = "";
        player2Input.value = "";
        // reset games statistics
        player1.resetStatistic();
        player2.resetStatistic();
        // show update statistics
        renderStatistics();
    }

    const enableButtons = () => {
        // enable all buttons that represent the board
        buttons.forEach((btn) => {
            btn.disabled = false;
        })      
    }

    const disableButtons = () => {
        // disable all buttons that represent the board
        buttons.forEach((btn) => {
            btn.disabled = true;
        })
    }

    return { renderStatistics, setTurn, getWinner, getNoWinner, getBoardArray, outputBoardArray, renderTextNextTurn, checkForWinner, checkForEmptyButton, checkForEmptySpot, restartGame , newGame, enableButtons, disableButtons };
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
    let name = "";
    let wins = 0;
    let draws = 0;
    let lost = 0;
    const sign = playerSign;

    const setName = (value) => {
        name = value;        
    }

    const setWins = () => {
        wins += 1;
    }

    const setDraws = () => {
        draws += 1;
    }

    const setLost = () => {
        lost += 1;
    }
    const resetStatistic = () => {
        wins = 0;
        draws = 0;
        lost = 0;
    }
    const getName = () => name;
    const getSign = () => sign;

    const getWins = () => wins;
    const getDraws = () => draws;
    const getLost = () => lost;

    return { setName, setWins, setDraws, setLost, resetStatistic, getName, getSign, getWins, getDraws, getLost };
}

// Create two player objects
// connectGUI.renderBoard();
const player1 = player("X");
const player2 = player("O");
game.renderStatistics();
