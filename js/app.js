"use strict";

var tiles = [];

for (var i = 1; i <= 32; ++i) {
    tiles.push(i);
}

$(document).ready(function() {
    var selectedTiles;
    var gameTiles;
    var ul = $('#tiles');
    var firstTile;
    var secondTile;
    var userCanClick = true;
    var matches = 0;
    var mistakes = 0;
    var timer;
    var gametime;

    function startGame () {
        //randomize the tiles then pick out of those
        selectedTiles = _.shuffle(tiles).slice(0, 8);
        gameTiles = [];
       //clone to make matching pairs
        _.forEach(selectedTiles, function(tile) {
            gameTiles.push(_.clone(tile));
            gameTiles.push(_.clone(tile));
        });
        //shuffle them for the game
        gameTiles = _.shuffle(gameTiles);

        var img;
        var ul = $("#tiles");

        //make the gameboard
        for(var i = 0; i < 16; i++) {
            var newLI = $(document.createElement("li"));
            var newImg = $(document.createElement("img"));
            newImg.attr("src", "img/tile-back.png")
            newImg.data("number", gameTiles[i]);
            newImg.data("position", i);
            newImg.data("flipped", false);
            newImg.click(tileClick);

            newLI.append(newImg);
            ul.append(newLI);
        }

        //need to set these values to start the game properly
        firstTile = null;
        secondTile = null;
        userCanClick = true;

        matches = 0;
        mistakes = 0;
        $('#matches').text("Matches: " + matches);
        $('#remaining').text("Remaining Pairs: " + (8-matches));
        $('#mistakes').text("Mistakes: " + mistakes);
    }

    function resetInfo () {
        matches = 0;
        mistakes = 0;
        var startTime = _.now();
        window.clearInterval(timer);
        $('#matches').text("Matches: " + matches);
        $('#remaining').text("Remaining Pairs: " + (8-matches));
        $('#mistakes').text("Mistakes: " + mistakes);
        $('#gametime').text("Duration: 0");
        timer = window.setInterval(function() {
            gametime = Math.floor((_.now() - startTime) / 1000);
            $('#gametime').text("Duration: " + gametime);
        }, 1000);
    }


    $('#startButton').click(function() {
        ul.empty();
        startGame();
        ul.fadeIn(1000);
        $('#info').fadeIn(1000);
        resetInfo();
    });

    $('#howButton').click(function () {
        $('#popover').fadeIn(500);
        $('#gamerules').fadeIn(500);
    });

    $('#reminder').click(function() {
        $('#popover').fadeOut(500);
        $('#gamerules').fadeOut(500);
    });

    function flipCards() {
        firstTile.attr("src", "img/tile-back.png");
        firstTile.data("flipped", false);
        firstTile.removeClass("mismatched");
        firstTile.removeClass("selected");
        secondTile.attr("src", "img/tile-back.png");
        secondTile.data("flipped", false);
        secondTile.removeClass("mismatched");
        secondTile.removeClass("selected");

        firstTile = null;
        secondTile = null;
        userCanClick = true;
    }

    $('#resetButton').click( function() {
        $('#popover').fadeOut(1000);
        $('#win-screen').fadeOut(1000);
        ul.empty();
        startGame();
        resetInfo();
    });

    function tileClick () {
        //make sure the tile clicked is not flipped already
        if (userCanClick && !$(this).data("flipped")) {
            $(this).attr("src", "img/tile" + $(this).data("number") + ".jpg");
            $(this).data("flipped", true);
            //feedback
            $(this).addClass("selected");

            //For the first flip
            if (firstTile == null) {
                firstTile = $(this);
            //For the second flip
            } else {
                userCanClick = false;
                //it matched
                if (firstTile.data("number") == $(this).data("number")) {
                    matches++;
                    $('#matches').text("Matches: " + matches);
                    $('#remaining').text("Remaining Pairs: " + (8 - matches));
                    firstTile.removeClass("selected");
                    $(this).removeClass("selected");
                    firstTile.addClass("matched");
                    $(this).addClass("matched");

                    //if matching the last pair
                    if (matches == 8) {
                        $('#win-screen').fadeIn(1000);
                        $('#popover').fadeIn(1000);
                        window.clearInterval(timer);
                        $('#timeMsg').text("You won in " + gametime + " seconds.");

                        //victory
                        document.getElementById('audio').play();
                    //if you ain't done matching yet
                    } else {
                        firstTile = null;
                        userCanClick = true;
                    }
                //mismatch
                } else {
                    secondTile = $(this);

                    firstTile.addClass("mismatched");
                    secondTile.addClass("mismatched");

                    //Requirement of auto flip after 1 second
                    setTimeout(flipCards, 1000);
                    mistakes++;
                    $('#mistakes').text("Mistakes: " + mistakes);
                }

            }
        }
    }

}); // jQuery ready function