// Each little piece of functionality should be able to fit in the game,
// player or gameboard objects

// Dom elements should not do logical stuff
// everything clickable should be a button, for accessibility reasons

// using factory functions

// Game Object
// Object to control the flow of the game
const game = (function () {
    // check board if a player has won the game
    

    const shufflePlayerStartPosition = (arr) => {
        let shuffledArray = arr
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
        return shuffledArray;
    }

    const turn = () => {
       
    }

    return { shufflePlayerStartPosition };
})();

// Gameboard Object
// - storing an gameboard as array
// - X and O will put in the array
const gameboard = (function () {
    let board =
        [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];

    // update board

    return { board };
})();


// PLayer Object
// Player also be stored in an Object
const player = function (playerName, playerSign) {
    const name = playerName;
    const sign = playerSign;

    const getName = () => name;
    const getSign = () => sign;

    return { getName, getSign };
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
// create game


// create board
console.log(`${player1.getName()} ${player1.getSign()}`);
console.log(`${player2.getName()} ${player2.getSign()}`);
console.log(typeof player1);

let turnPlayer1;
while (true) {
    // player1 makes turn



    // player2 makes turn
    break
}

// Game is over, output result