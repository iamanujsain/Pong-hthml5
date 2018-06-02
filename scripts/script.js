var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var myGamePiece, humanPaddle, aiPaddle;
var dx = 1,
    dy = .5,
    pdy = 1.5;
var upPressed = false,
    downPressed = false;
var score = 0;
var gameActive = false;

// Event listeners.
function keyDownHandler(e) {
    if (e.keyCode == 38) {
        upPressed = true;
    } else if (e.keyCode == 40) {
        downPressed = true;
    }
}
function keyUpHandler(e) {
    if (e.keyCode == 38) {
        upPressed = false;
    } else if (e.keyCode == 40) {
        downPressed = false;
    }
}
function mouseMovehandler(e) {
    var relativeY = e.clientY;
    var humanPaddleY = humanPaddle.y + (humanPaddle.height/2);
    if (gameActive) {
        if (relativeY >= humanPaddle.height/2 || relativeY <= canvas.height - humanPaddle.height/2) {
            humanPaddle.y = relativeY - humanPaddle.height-19;
        }
    }
}

document.addEventListener("mousemove", mouseMovehandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("keydown", keyDownHandler, false);

var myGameArea = {
    canvas: document.getElementById("myCanvas"),
    start: function() {
        this.context = this.canvas.getContext("2d");
        this.interval = setInterval(updateGameArea, 7);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// Constructor for creating components.
function component(x, y, width, height, color) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Update the components.
function updateGameArea() {
    myGameArea.clear();

    if (gameActive) {
        myGamePiece.update();
        humanPaddle.update();
        aiPaddle.update();
        aiPaddle.y = myGamePiece.y - (aiPaddle.height/2);
        // humanPaddle.y = myGamePiece.y - (humanPaddle.height/2);

        if (upPressed) {
            pdy = -1.5;
            humanPaddle.y += pdy;
        }
        if (downPressed) {
            pdy = 1.5;
            humanPaddle.y += pdy;
        }

        if (myGamePiece.x < 0) {
            gameActive = false;
        }
        if (myGamePiece.y < 0 || myGamePiece.y > this.canvas.height - myGamePiece.height) {
            dy *= -1;
        }

        myGamePiece.x += dx;
        myGamePiece.y += dy;

        paddleCollision(humanPaddle, myGamePiece, 1);
        paddleCollision(aiPaddle, myGamePiece, 2);
        printScore();
    } else  {
        showModal();
    }
}

// Checks collision between a paddle and a target.
// For humanPaddle, type = 1 and for aiPaddle type = 2.
function paddleCollision(paddle, ball, type) {
    if (type == 1) {
        if (ball.y >= paddle.y+ball.height/2 && ball.y <= paddle.y+paddle.height-ball.height/2) {
            if (ball.x < paddle.x+paddle.width) {
                dx *= -1;
                score++;
            }
        }
        if (paddle.y < 0) {
            paddle.y = 0;
        }
        if (paddle.y + paddle.height > this.canvas.height) {
            paddle.y = this.canvas.height - paddle.height;
        }
    } else if (type == 2) {
        if (ball.y >= paddle.y+ball.height/2 && ball.y <= paddle.y+paddle.height-ball.height/2) {
            if (ball.x > paddle.x-ball.width) {
                dx *= -1;
            }
        }
        if (paddle.y < 0) {
            paddle.y = 0;
        }
        if (paddle.y + paddle.height > this.canvas.height) {
            paddle.y = this.canvas.height - paddle.height;
        }
    }
}

// Initialize the comonents and start the game.
function startGame() {
    myGamePiece = new component(this.canvas.width/2, this.canvas.height/2, 10, 10, "pink");
    humanPaddle = new component(1, this.canvas.height/2, 15, 70, "white");
    aiPaddle = new component(this.canvas.width-16, this.canvas.height/2, 15, 70, "white");
    myGameArea.start();
}

// Prints the score on the canvas.
function printScore() {
    ctx.font = "19px Consolas";
    ctx.fillText("Score: "+score, canvas.width - 113, 20);
}

startGame();


// Modal
var modal = document.getElementById('myModal');
var writeScore = document.getElementById("score");
var playAgain = document.getElementById("playAgain");

playAgain.onclick = function() {
    myGamePiece.x = canvas.width/2;
    myGamePiece.y = canvas.height/2;
    score = 0;
    gameActive = true;
    modal.style.display = "none";
}

function showModal() {
    modal.style.display= "block";
    writeScore.innerHTML = score;
}

// window.onclick = function(event) {
//     if (event.target == modal) {
//         gameActive = true;
//         modal.style.display = "none";
//     }
// }