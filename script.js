
// everything clickable should be a button, for accessibility reasons
// using factory functions

// Game Object for the flow of the game
const game = (function () {

    const shufflePlayerStartPosition = (arr) => {
        let shuffledArray = arr
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
        return shuffledArray;
    }

    const getTurn = (player) => {
        player.getTurn();
    }

    const setTurn = (player) => {
        gameBoard.setBoard(player);
    }

    // get array board
    const getBoard = () => {
        //console.log(gameBoard.getBoard());
        return gameBoard.getBoard();
    }

    // get print output for terminal
    const outputBoard = () => {
        return gameBoard.outputBoard();
    }

    const checkForWinner = (player) => {
        // need logic
        let result;
        // if one check is true cancel rest return true (winner was found)
        // if all checks are false, return false (no winner was found)

        result = gameBoard.checkRows(player);
        //console.log(`1) check rows              => result: ${result}`);
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

    const checkForEmptySpot = () => {
        // check if board has at least on empty spot left
        let result;
        result = gameBoard.checkForEmptySpot();
        return result;
    }

    return { shufflePlayerStartPosition, getTurn, setTurn, getBoard, outputBoard, checkForWinner, checkForEmptySpot };
})();

// Gameboard Object
const gameBoard = (function () {
    let board =
        [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];

    const setBoard = (player) => {
        let turn = player.setTurn();
        let arrTurn = turn.split(" ");
        let firstTurn = arrTurn[0];
        let secondTurn = arrTurn[1];
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (i == firstTurn && j == secondTurn) {
                    board[i][j] = player.getSign();
                    return;
                }
            }
        }
    }

    // get array board
    const getBoard = () => {
        return board;
    }

    // get print output for terminal
    const outputBoard = () => {
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
        let playerSign = player.getSign();
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
        let playerSign = player.getSign();
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
        let playerSign = player.getSign();
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
        let playerSign = player.getSign();
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

    return { setBoard, getBoard, outputBoard, checkRows, checkColumns, checkCrossLeftToRight, checkCrossRightToLeft, checkForEmptySpot };
})();


// PLayer Object
const player = function (playerName, playerSign) {
    const name = playerName;
    const sign = playerSign;
    let input;

    const getName = () => name;
    const getSign = () => sign;

    const getTurn = () => {
        let board = gameBoard.getBoard();
        let correctInput = false;
        do {
            
            input = prompt("Enter your turn (pos1 pos2)");
            let arrTurn = input.split(" ");
            let firstTurn = arrTurn[0];
            let secondTurn = arrTurn[1];

            // check if user input is bigger than max length of array and array in array
            if (firstTurn > board.length-1 || secondTurn > board[0].length-1) {
                continue;
            }
            // check if user input is smaller than 0 index
            if (firstTurn < 0 || secondTurn < 0) {
                continue;
            } 
            // check if position is empty
            if (board[firstTurn][secondTurn] == "") {
                correctInput = true;
            }     
        }while (!correctInput);
    }

    const setTurn = () => {
        return input;
    }

    return { getName, getSign, setTurn, getTurn };
}

// get player names
const userName1 = "Sebastian";
const userName2 = "Peter";

// put both names in array to randomly generate starting position
let tempArr = [userName1, userName2];
let shuffledArray = game.shufflePlayerStartPosition(tempArr);

// create two player object
let player1 = player(shuffledArray[0], "X");
let player2 = player(shuffledArray[1], "O");

//console.log(`Player1: ${player1.getName()} ${player1.getSign()}`);
//console.log(`Player2: ${player2.getName()} ${player2.getSign()}`);


// objects: game, gameBoard, player
let winnerFound;
let count = 0;
console.log("TIC TAC TOE");
console.log(game.outputBoard());
while (count < 20) {
    // FIRST PLAYER
    // 1. check if board has at least on empty spot left
    if(game.checkForEmptySpot() === false) {
        console.log("Board is full. No Winner! Game Over");
        break;
    }
    // 2. player1 enters turn and turn is set into board array
    game.getTurn(player1);
    game.setTurn(player1);
    // 3. clear console and output board 
    console.clear();
    console.log(game.outputBoard());
    // 4. check for winner
    winnerFound = game.checkForWinner(player1); 
    if (winnerFound === true) {
        //game.gameOver(player1);
        console.log(`Player1 won! winnerFound: ${winnerFound}. GameOver!`);
        break;
    } else {
        console.log(`No winner! continue!`);
    }

    // SECOND PLAYER
    // 1. check if board has at least on empty spot left
    if(game.checkForEmptySpot() === false) {
        console.log("Board is full. No Winner! Game Over");
        break;
    }
    // 2. player2 enters turn and turn is set into board array
    game.getTurn(player2);
    game.setTurn(player2);
    
    // 3. clear console and output board 
    console.clear();
    console.log(game.outputBoard());

    // 4. check for winner
    winnerFound = game.checkForWinner(player2);
    if (winnerFound === true) {
        //game.gameOver(player1);
        console.log(`Player2 won! winnerFound: ${winnerFound}. GameOver!`);
        break;
    } else {
        console.log(`No winner! continue!`);
    }
    count++

}