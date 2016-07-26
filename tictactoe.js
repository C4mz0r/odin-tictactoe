/**
 * Created by c4mz0r on 25/07/16.
 */
/*globals $:false */
"use strict";

function Board() {
    this.grid = [];
    this.initialize = function() {
        this.grid = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
        $("body").empty().append("<div id='board'></div>");
        for (var i = 0; i < this.grid.length; i++ ) {
            $("#board").append("<span id='cell_" + i + "'>" + this.grid[i] + "</span>");
        }
    };

    this.render = function() {
        for (var i = 0; i < this.grid.length; i++ ) {
            $("span#cell_"+i).text(this.grid[i]);
        }
    };

    this.isValidMove = function(index) {
        return (this.grid[index] === ' ');
    };

    this.isBoardFull = function() {
        return (this.grid.indexOf(' ') === -1);
    };

    this.setCell = function(index, symbol) {
        this.grid[index] = symbol;
    };

    this.showGameOver = function(winner) {
        $("body").append("<div class='gameover'><p>Game Over - "+ winner +" wins!</p>" +
            "<p>Click here to play again</p></div>");
    };

    this.initialize();
    this.render();
}

function Player(symbol) {
    this.symbol = symbol;
    this.move = function(board, clickedElement) {
        console.log("Player " + symbol + " is making a move.");
        var clickedIndex = $("span").index(clickedElement);
        if (board.isValidMove(clickedIndex)) {
            board.setCell(clickedIndex, this.symbol);
            return true;
        }
        return false;
    };
}

function GameController() {
    this.winningCombinations =
        [
            [0,1,2], [3,4,5], [6,7,8],
            [0,3,6], [1,4,7], [2,5,8],
            [0,4,8], [2,4,6]
        ];
    this.players = { first: new Player('X'), second: new Player('O')};
    this.currentPlayer = this.players.first;
    this.board = new Board();
    this.board.render();
    this.winner = undefined;

    this.setNextPlayer = function() {
        this.currentPlayer = (this.currentPlayer === this.players.first) ?
            this.players.second : this.players.first;
    };

    this.isGameOver = function() {
        self = this;
        var result = this.winningCombinations.filter(function(entry){
            return (self.board.grid[entry[0]] === self.board.grid[entry[1]] &&
            self.board.grid[entry[1]] === self.board.grid[entry[2]] &&
            self.board.grid[entry[0]] !== ' ');

        });

        // If there is a winner, the result will be a non-empty array which contains the winning combination
        // (e.g. [[0,1,2]] if the winner took the top row)
        // Therefore the winner's symbol is in location result[0][0] (or result[0][1] or result[0][2]).
        if (result.length) {
            this.winner = this.board.grid[result[0][0]];
            return true;
        }

        // At this stage, neither player won, so if the board is full the game is over and cats won.
        if (this.board.isBoardFull()) {
            this.winner = 'Cats';
            return true;
        }

        // Nobody won yet and board is not full
        return false;
    };

    var self = this;
    // Process current player's move, then alternate turns
    $("span").click(function(){
        if ( self.currentPlayer.move(self.board, $(this)) ) {
            self.setNextPlayer();
            self.board.render();
            if (self.isGameOver() ) {
                self.endGame();
            }
        }
    });

    this.endGame = function () {
        $("span").off(); // prevent players from continuing to play
        self.board.showGameOver(self.winner);
        self.playAgain();
    };

    this.playAgain = function() {
        $(".gameover").click(function () {
            self = new GameController();
        });
    };
}

$(function(){
    var g = new GameController();
});

