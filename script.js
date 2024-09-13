
// everything clickable should be a button, for accessibility reasons
// using factory functions

// Game Object for the flow of the game
const game = (function () {
    // check board if a player has won the game


    const shufflePlayerStartPosition = (arr) => {
        let shuffledArray = arr
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
        return shuffledArray;
    }

    const getTurn = (player) => {
        player.setTurn();
    }

    const setTurn = (player) => {
        gameBoard.setBoard(player);
    }

    const getBoard = () => {
        //console.log(gameBoard.getBoard());
        return gameBoard.getBoard();
    }

    const checkForWinner = (player) => {
        // need logic
        let result;
        // if one check is true cancel rest return true (winner was found)
        // if all checks are false, return false (no winner was found)
        
        result = gameBoard.checkRows(player);
        console.log(`1) check rows              => result: ${result}`);
        if (result === true) return result;
        
        result = gameBoard.checkColumns(player);
        console.log(`2) check columns           => result: ${result}`);
        if (result === true) return result;
        
        result = gameBoard.checkCrossLeftToRight(player);
        console.log(`3) check cross left/right  => result: ${result}`);
        if (result === true) return result;

        result = gameBoard.checkCrossRightToLeft(player);
        console.log(`4) check cross right/left  => result: ${result}`);
        return result;
        
    }

    const gameOver = (player) => {
        console.log(`${player.getName()} ${player.getSign()} won the game! GAME OVER!`);
    }



    return { shufflePlayerStartPosition, getTurn, setTurn, getBoard, checkForWinner, gameOver };
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
        let turn = player.getTurn();
        let arrTurn = turn.split(" ");
        let firstTurn = arrTurn[0];
        let secondTurn = arrTurn[1];
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (i == firstTurn && j == secondTurn) {
                    board[i][j] = player.getSign();
                }
            }
        }
    }

    const getBoard = () => {
        let formattedBoard = "";
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === "") {
                    formattedBoard += " ";
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

    return { setBoard, getBoard, checkRows, checkColumns, checkCrossLeftToRight, checkCrossRightToLeft };
})();


// PLayer Object
const player = function (playerName, playerSign) {
    const name = playerName;
    const sign = playerSign;
    let input;

    const getName = () => name;
    const getSign = () => sign;

    const setTurn = () => {
        input = prompt("Enter your turn (pos1 pos2)");
        //input = "0 0";
        console.log("inside player.setTurn() set input to fixed value, rm later for prompt again")
    }

    const getTurn = () => {
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
while (count < 5) {
    // player1 makes turn
    //player1.setTurn();
    game.getTurn(player1);
    game.setTurn(player1);
    console.log(game.getBoard());
    // check for winner
    winnerFound = game.checkForWinner(player1);
    
    
    if (winnerFound === true) {
        //game.gameOver(player1);
        console.log(`Player1 won! winnerFound: ${winnerFound}. GameOver!`);
        break;
    } else {
        console.log(`No winner! continue!`);
    }
    // player2 makes turn
    
    count++   
}