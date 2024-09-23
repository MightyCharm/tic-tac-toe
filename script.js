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
const gameRenderText = document.querySelector("#box-game-info-text");
gameRenderText.innerHTML = "Player 1 it's your turn";
// get all buttons that represent the gameboard
const buttons = document.querySelectorAll("#btn");


player1Button.addEventListener("click", () => {
    // Only change the name if user has actual entered something new into input field
    if (player1Input.value === player1.getName()) return;
    // set name in player object to input value
    player1.setName(player1Input.value);
    // disable OK button so that player can only enter 1 times during the game a name
    player1Button.disabled = true;
    player1Input.disabled = true;
    // if name was entered during the game, directly render it on the screen
    game.renderText("player1Button");
})

player2Button.addEventListener("click", () => {
    // Only change the name if user has actual entered something new into input field
    if (player2Input.value === player2.getName()) return;
    // set name in player object to input value
    player2.setName(player2Input.value);
    // disable OK button so that player can only enter 1 times during the game a name
    player2Button.disabled = true;
    player2Input.disabled = true;
    // if name was entered during the game, directly render it on the screen
    game.renderText("player2Button");
})

restartButton.addEventListener("click", () => {
    game.restartGame();
})

newGameButton.addEventListener("click", () => {
    game.newGame();
})

/* this button represent the game loop */
buttons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
        const btn = event.target;
        connectGUI.playGame(btn);
    })
})

// feature: show preview
buttons.forEach((btn) => {
    btn.addEventListener("mouseover", (event) => {
        const btn = event.target;
        connectGUI.showPreview(btn);
    })
})
// feature: show preview 
buttons.forEach((btn) => {
    btn.addEventListener("mouseout", (event) => {
        const btn = event.target;
        connectGUI.removePreview(btn);
    })
})

// Object for displaying the game on the page
connectGUI = (function () {

    //  main loop of the game, do something if button was pressed
    const playGame = (btn) => {
        // check if button that was pressed is empty
        let empty = game.checkForEmptyButton(btn);

        console.log(`empty button: ${empty}`);
        // if button was not empty, check if there is at least on button empty on the gameboard
        if (empty === false) {
            return
        };
        // if button was empty get Player Sign and Insert it into Button
        game.setTurn(btn);
        // Check if a player has won the game
        let winnerFound = game.checkForWinner();
        if (winnerFound == true) {
            game.setStatus(false);
            game.setWinner();
            game.renderText("winner");
            game.renderStatistics();
            game.disableBoardButtons();
            return;
        }
        // check for empty spot on board
        // check if it's a draw because the board is full
        let spaceOnBoard = game.checkForEmptySpot();
        if (spaceOnBoard === false) {
            game.setStatus(false);
            game.setDraw();
            game.renderText("boardFull");
            game.renderStatistics();
            game.disableBoardButtons();
            return;
        }
        // render game info text
        game.renderText();
    }

    // work in progress
    // both methods should go into game factory function
    const showPreview = (btn) => {
        // show preview only if the game is running
        let status = game.getStatus();
        if(status === false) return;
        console.log(`status: ${status}`);
        let opacity = 0.9;
        // check if board array is empty at that space
        let data_id = btn.getAttribute("data-id").split(" "); // get data-id from button(=equal to index in board array)
        let index_1 = data_id[0];
        let index_2 = data_id[1];
        const board = gameBoard.getBoardArray();
        //console.log(`in: index_1: ${index_1}  index_2: ${index_2}`);
        // if empty show preview
        if (board[index_1][index_2] === "") {
            //console.log("show preview");
            // get last sign to know which players turn is now
            // set sign in inner html  
            let lastSign = gameBoard.getLastSignSet();
            // if lastSign is empty, preview "X" because it is the first turn in the game
            // if lastSign is "X", preview "O"
            // if lastSign is "O" preview "X" 
            switch (lastSign) {     
                case "":
                    btn.innerHTML = "X";
                    btn.style.opacity = opacity;
                    break;
                case "O":
                    btn.innerHTML = "X";
                    btn.style.opacity = opacity;
                    break;
                case "X":
                    btn.innerHTML = "O";
                    btn.style.opacity = opacity;
                    break;
                default:
                    console.log("Shouldn't see me.");
                    break;
              
            }
            // if lastSign is "X", preview "O"
            // if lastSign is "O" preview "X"    
        }
    }

    const removePreview = (btn) => {
        btn.style.opacity = 1;
        // check if board array is empty at that space
        // check if board array is empty at that space
        let data_id = btn.getAttribute("data-id").split(" "); // get data-id from button(=equal to index in board array)
        let index_1 = data_id[0];
        let index_2 = data_id[1];
        //console.log(`out: index_1: ${index_1}  index_2: ${index_2}`);
        const board = gameBoard.getBoardArray();
        //console.log(`index_1: ${index_1}  index_2: ${index_2}  board: ${board[index_1][index_2]}`);
        if (board[index_1][index_2] === "") {
            btn.innerHTML = "";
        }

        //console.log(board[index_1][index_2]);
        // show preview
        // if empty remove preview (innerHTML = "")
    }
    // ================
    return { playGame, showPreview, removePreview };
})();

// Game factory function (for the flow of the game)
// connectGUI should tell game what the user interact with,
// game should do everything that needs to be done, all calls if possible from here
const game = (function () {

    // status is used to show the correct text, especial if some player wants to enter name and
    // the game is in that moment in the end screen and not running,
    // true = game is running, false = winner was found or draw,
    // changed from "connectGUI"(set to "false") and "newGame/restartGame"(set to "true")
    let status = true;

    const renderText = (optional = "") => {


        // I need one more condition for the case that the game is over,
        // - winner or board full
        // in that case name change should not be rendered
        if (optional === "player1Button" || optional === "player2Button") {
            console.log("player1 want to change name, render text...");

            // need to know which turn it is
            let playerSign = gameBoard.getLastSignSet();
            let player1Name = player1.getName();
            let player2Name = player2.getName();
            // check which turn it is to choose what to render
            if (getStatus() === true) {
                let textOutput = "";
                if (playerSign === "O") { // Player 1 turn
                    textOutput = `${player1Name} it's your turn`;
                }
                else if (playerSign === "X") { // Player 2 turn
                    textOutput = `${player2Name} it's your turn`;
                } // first turn of the game, Player 1 turn
                else {
                    if (player1Name === "") {
                        textOutput = "Player 1 it's your turn 2";

                    } else {
                        textOutput = `${player1Name} it's your turn 1`;
                    }
                }
                gameRenderText.innerHTML = textOutput;
            }
        }
        else if (optional === "winner") {
            console.log("winner was found");
            let textOutput = "";
            // get player name who won the game
            // insert player name into text string
            let signWinner;
            let nameWinner
            textOutput = "Congratulation! ";
            signWinner = gameBoard.getLastSignSet();
            switch (signWinner) {
                case "X":
                    nameWinner = player1.getName();
                    if (nameWinner === "") {
                        textOutput += "Player 1";
                    }
                    else {
                        textOutput += nameWinner;
                    }
                    break;
                case "O":
                    nameWinner = player2.getName();

                    if (nameWinner === "") {
                        textOutput += "Player 2";
                    }
                    else {
                        textOutput += nameWinner;
                    }
                    break;
                default:
                    console.log("Something went wrong, you shouldn't see me!");
                    break;
            }
            textOutput += " has won the game!"
            gameRenderText.innerHTML = textOutput;

        }
        else if (optional === "boardFull") {
            let textOutput = "";
            console.log("no space on gameboard!");
            // gameboard is full, insert DRAW into text string
            textOutput = "Board is full. Draw!";
            gameRenderText.innerHTML = textOutput;
        }
        else if (optional === "restart") {
            let textOutput = "";
            let name = player1.getName();
            if (name === "") {
                textOutput = "Player 1 it's your turn";
            }
            else {
                textOutput = `${name} it's your turn`;
            }
            gameRenderText.innerHTML = textOutput;

        }
        else if (optional === "new-game") {
            let textOutput = "";
            textOutput = "Player 1 it's your turn";
            gameRenderText.innerHTML = textOutput;
        }
        // normal call if game is running
        else if (optional === "") {
            // get player name
            // insert player name into string
            let textOutput = "";
            let name = "";
            let playerSign = gameBoard.getLastSignSet();
            if (playerSign === "O") {
                name = player1.getName();
                if (name === "") {
                    textOutput += "Player 1";
                } else {
                    textOutput += name;
                }
            }
            else {
                name = player2.getName();
                if (name === "") {
                    textOutput += "Player 2";
                } else {
                    textOutput += name;
                }
            }
            textOutput += " it's your turn";
            gameRenderText.innerHTML = textOutput;
        }




    }

    const restartGame = () => {
        gameBoard.clearBoardArray();
        gameBoard.clearLastSignSet();
        // clear text inside buttons to display empty board
        gameBoard.clearSignsFromButtons();
        game.setStatus(true);
        // reset text
        game.renderText("restart");
        // enable buttons that represent the board
        enableBoardButtons();
    }

    const newGame = () => {
        // clear board array
        gameBoard.clearBoardArray();
        // clear lastSignSet
        gameBoard.clearLastSignSet();
        // clear text inside buttons to display empty board
        gameBoard.clearSignsFromButtons();
        // enable input and ok button for new game
        player1Input.disabled = false;
        player2Input.disabled = false;
        player1Button.disabled = false;
        player2Button.disabled = false;
        // clear names
        player1.setName("");
        player2.setName("");
        // clear input field
        player1Input.value = "";
        player2Input.value = "";
        // reset games statistics
        player1.resetStatistic();
        player2.resetStatistic();
        // show update statistics
        renderStatistics();
        enableBoardButtons();
        game.setStatus(true);
        game.renderText("new-game");

    }

    const setStatus = (gameStatus) => {
        status = gameStatus;
    }

    const getStatus = () => {
        return status;
    }

    const setWinner = () => {
        signWinner = gameBoard.getLastSignSet();
        switch (signWinner) {
            case "X":
                player1.setWins();
                player2.setLost();
                break;
            case "O":
                player1.setLost();
                player2.setWins();
                break;
            default:
                console.log("Something went wrong, you shouldn't see me!");
                break;
        }
    }

    const setDraw = () => {

        player1.setDraws();
        player2.setDraws();
    }

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
        if (result === true) return result;

        result = gameBoard.checkColumns(player);
        if (result === true) return result;

        result = gameBoard.checkCrossLeftToRight(player);
        if (result === true) return result;

        result = gameBoard.checkCrossRightToLeft(player);
        return result;
    }

    // check if button that was pressed is empty or not
    const checkForEmptyButton = (btn) => {
        /*
        Old version checked if button is empty using innerHTML,
        but to implement a preview for the user, new check uses
        the actual board array to find out if button is empty.
        If there are problems implement old version again
        // old version
        let content = btn.innerHTML;
        if (content === "") return true
        return false;
        */
        // new version
        let data_id = btn.getAttribute("data-id").split(" "); // get data-id from button(=equal to index in board array)
        let index_1 = data_id[0];
        let index_2 = data_id[1];
        const board = gameBoard.getBoardArray();
        //console.log(`index_1: ${index_1}  index_2: ${index_2}  board: ${board[index_1][index_2]}`);
        if (board[index_1][index_2] === "") {
            return true
        }
        return false;
    }

    // check if board has at least one empty spot
    const checkForEmptySpot = () => {
        let result;
        result = gameBoard.checkForEmptySpot();
        return result;
    }

    const enableBoardButtons = () => {
        // enable all buttons that represent the board
        buttons.forEach((btn) => {
            btn.disabled = false;
        })
    }

    const disableBoardButtons = () => {
        // disable all buttons that represent the board
        buttons.forEach((btn) => {
            btn.disabled = true;
        })
    }

    return { setStatus, getStatus, renderText, renderStatistics, setTurn, setWinner, setDraw, getBoardArray, outputBoardArray, checkForWinner, checkForEmptyButton, checkForEmptySpot, restartGame, newGame, enableBoardButtons, disableBoardButtons };
})();

// Gameboard factory function
// should set or return
const gameBoard = (function () {
    let lastSignSet = "";
    let board =
        [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];

    // works with lastSignSet variables
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

    const clearSignsFromButtons = () => {
        buttons.forEach((btn) => {
            btn.innerHTML = "";
        })
    }

    return { setBoardButtons, getBoardArray, clearBoardArray, clearLastSignSet, outputBoardArray, checkRows, checkColumns, checkCrossLeftToRight, checkCrossRightToLeft, checkForEmptySpot, getLastSignSet, clearSignsFromButtons };
})();

// Player factory function
// should only set or return
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
