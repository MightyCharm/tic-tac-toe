// Each little piece of functionality should be able to fit in the game,
// player or gameboard objects

// Dom elements should not do logical stuff
// everything clickable should be a button, for accessibility reasons

// using factory functions

// Game Object
// Object to control the flow of the game
const game = (function () {
    // check board if a player has won the game
    let playerTurn;
    
    const turn = (name) => {
        console.log(` get input from ${name}`);
        playerTurn = prompt("Enter your turn");
        return playerTurn;
    }

    return { turn };
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
const player = function (playerName) {
    const name = playerName;

    return { name };
}



// get player names
const userName1 = "Sebastian";
const userName2 = "Peter";

// randomly decide which player starts
let tempArr = [userName1, userName2];
let shuffledArray = tempArr
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
//console.log(shuffledArray);
// create two players
let player1 = player(shuffledArray[0]);
let player2 = player(shuffledArray[1]);
// create game


// create board

console.log(player1.name);

let turnPlayer1;
while (true) {
    // player1 makes turn
    turnPlayer1 = game.turn(player1.name);
    console.log(turnPlayer1);
    // check for win

    // player2 makes turn
    game.turn(player2.name);
    // check for win


    break
}

// Game is over, output result