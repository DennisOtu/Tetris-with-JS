const Canvas = document.getElementById('game');
const ctx = Canvas.getContext('2d');

const scoreElement = document.getElementById("score");

const ROW = 20;
const COLUMN = 10;
const VACANT = 'white';
const boxSize = 20;

let score = 0;
let gameOver = false;

let randomShape = Math.floor(Math.random() * 7);

function drawBox(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x*boxSize, y*boxSize, boxSize, boxSize);

    ctx.strokeStyle = 'black';
    ctx.strokeRect(x*boxSize, y*boxSize, boxSize, boxSize);   
}

// create game board
let board = [];

for (r = 0; r < ROW; r++) {
    board[r] = [];
    for (let c = 0; c < COLUMN; c++) {
        board[r][c] = VACANT;    
    }
}

function drawBoard() {
    board.forEach((row, y) => {
        row.forEach((col, x) => {
            drawBox(x, y, board[y][x]); 
        });    
    });
}

const sShape = [
    [[0, 1, 1],
     [1, 1, 0],
     [0, 0, 0]],

    [[0, 1, 0],
     [0, 1, 1],
     [0, 0, 1]],

    [[0, 0, 0],
     [0, 1, 1],
     [1, 1, 0]],

    [[1, 0, 0],
     [1, 1, 0],
     [0, 1, 0]]
];

const zShape =  [
    [[1, 1, 0],
     [0, 1, 1],
     [0, 0, 0]],

    [[0, 0, 1],
     [0, 1, 1],
     [0, 1, 0]],

    [[0, 0, 0],
     [1, 1, 0],
     [0, 1, 1]],

    [[0, 1, 0],
     [1, 1, 0],
     [1, 0, 0]]
];

const tShape =  [
    [[1, 1, 1],
     [0, 1, 0],
     [0, 0, 0]],

    [[0, 0, 1],
     [0, 1, 1],
     [0, 0, 1]],

    [[0, 0, 0],
     [0, 1, 0],
     [1, 1, 1]],

    [[1, 0, 0],
     [1, 1, 0],
     [1, 0, 0]]
];

const oShape =  [
    [[0, 0, 0, 0],
     [0, 1, 1, 0],
     [0, 1, 1, 0],
     [0, 0, 0, 0]],

    [[0, 0, 0, 0],
     [0, 1, 1, 0],
     [0, 1, 1, 0],
     [0, 0, 0, 0]],

    [[0, 0, 0, 0],
     [0, 1, 1, 0],
     [0, 1, 1, 0],
     [0, 0, 0, 0]],

    [[0, 0, 0, 0],
     [0, 1, 1, 0],
     [0, 1, 1, 0],
     [0, 0, 0, 0]]
];

const lShape =  [
   [[0, 1, 0],
    [0, 1, 0],
    [0, 1, 1]],

   [[0, 0, 0],
    [1, 1, 1],
    [1, 0, 0]],

   [[1, 1, 0],
    [0, 1, 0],
    [0, 1, 0]],

   [[0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]]
];

const jShape = [
    [[0, 1, 0],
     [0, 1, 0],
     [1, 1, 0]],

    [[1, 0, 0],
     [1, 1, 1],
     [0, 0, 0]],

    [[0, 1, 1],
     [0, 1, 0],
     [0, 1, 0]],

    [[0, 0, 0],
     [1, 1, 1],
     [0, 0, 1]]
];

const iShape = [
    [[0, 1, 0, 0],
     [0, 1, 0, 0],
     [0, 1, 0, 0],
     [0, 1, 0, 0]],

    [[0, 0, 0, 0],
     [1, 1, 1, 1],
     [0, 0, 0, 0],
     [0, 0, 0, 0]],

    [[0, 0, 1, 0],
     [0, 0, 1, 0],
     [0, 0, 1, 0],
     [0, 0, 1, 0]],

    [[0, 0, 0, 0],
     [0, 0, 0, 0],
     [1, 1, 1, 1],
     [0, 0, 0, 0]]
];

const SHAPES = [
    [sShape, 'teal'],
    [zShape, 'orange'],
    [tShape, 'cyan'],
    [oShape, 'blue'],
    [lShape, 'red'],
    [jShape, 'yellow'],
    [iShape, 'green']
]

class Tetro{
    constructor(shape, color) {
        this.shape = shape;
        this.color = color;

        this.orientation = 0;
        this.activeShape = this.shape[this.orientation];
        
        this.x = 3;
        this.y = -1;
    }
}

let player = p = new Tetro(SHAPES[randomShape][0], SHAPES[randomShape][1]);

Tetro.prototype.fill = function(color) {
    for (r = 0; r < this.activeShape.length; r++) {
        for (c = 0; c < this.activeShape.length; c++) {
            if (this.activeShape[r][c]) {
                drawBox(this.x + c, this.y + r, color)
            }            
        }        
    }
}

Tetro.prototype.lock = function() {
    for( r = 0; r < this.activeShape.length; r++){
        for(c = 0; c < this.activeShape.length; c++){
            // we skip the vacant squares
            if( !this.activeShape[r][c]){
                continue;
            }
            // pieces to lock on top = game over
            if(this.y + r < 0){
                alert("Game Over");
                // stop request animation frame
                gameOver = true;
                //return gameOver;
                break;
            }
            // we lock the piece
            board[this.y+r][this.x+c] = this.color;

            // new tetro
            randomShape = Math.floor(Math.random() * 7);
            p = new Tetro(SHAPES[randomShape][0], SHAPES[randomShape][1]);
        }
    }
    // remove full rows
    for(r = 0; r < ROW; r++){
        let isRowFull = true;
        for( c = 0; c < COLUMN; c++){
            isRowFull = isRowFull && (board[r][c] != VACANT);
        }
        if(isRowFull){
            // if the row is full
            // we move down all the rows above it
            for( y = r; y > 1; y--){
                for( c = 0; c < COLUMN; c++){
                    board[y][c] = board[y-1][c];
                }
            }
            // the top row board[0][..] has no row above it
            for( c = 0; c < COLUMN; c++){
                board[0][c] = VACANT;
            }
            // increment the score
            score += 10;
        }
    }
    // update the board
    drawBoard();
    
    // update the score
    scoreElement.innerHTML = score;
}

Tetro.prototype.collision = function (x, y, piece) {
    for (r = 0; r < piece.length; r++) {
        for (c = 0; c < piece.length; c++) {
            if (!piece[r][c]) {
                continue;
            }

            let newX = this.x + c + x;
            let newY = this.y + r + y;

            if (newX < 0 || newX >= COLUMN) {
                return true;
            } 
            
            if (newY >= ROW) {
                this.lock();
                return true;
            }

            if (board[newY][newX] != VACANT) {
                this.lock();
                return true;
            }
            if (newY < 0) {
                continue;                
            }
        }
    }
}

Tetro.prototype.draw = function() {
    this.fill(this.color);
}

Tetro.prototype.undraw = function() {
    this.fill(VACANT);
}

Tetro.prototype.moveDown = function () {
    if (this.collision(0, 1, this.activeShape)) {
        //this.lock();    
    }
    if (!this.collision(0, 1, this.activeShape)) {
        this.undraw();
        this.y++;
        this.draw();        
    }    
}

Tetro.prototype.moveLeft = function () {
    if (!this.collision(-1, 0, this.activeShape)) {
        this.undraw();
        this.x--;
        this.draw();
    }
}

Tetro.prototype.moveRight = function () {
    if (!this.collision(1, 0, this.activeShape)) {
        this.undraw();
        this.x++;
        this.draw();                  
    }
}

Tetro.prototype.kickRight = function () {
    this.undraw();
    this.x++;
    this.draw();                  
}

Tetro.prototype.kickLeft = function () {
    this.undraw();
    this.x--;
    this.draw();                  
}

Tetro.prototype.rotate = function () {
    // right wall collision check
    if (this.collision(1, 0, this.activeShape)) {
        this.kickLeft();   
    }
    // left wall collision check
    if (this.collision(-1, 0, this.activeShape)) {
        this.kickRight(); 
    }
    
    if (!this.collision(0, 0, this.activeShape)) {
        this.undraw();
        this.orientation = (this.orientation + 1) % this.shape.length;
        this.activeShape = this.shape[this.orientation];
        this.draw();             
    }    
}

//p.draw();
function drop() {
    if (!p.collision(0, 1, p.activeShape)) {
        p.undraw();
        p.y++;
        p.draw();
    }
    //setTimeout(drop, 1000);  
}

// keyboard control
document.addEventListener('keydown', keyPress);

function keyPress(event) {

    //left = 'J' key
    if(event.keyCode == 74){
        p.moveLeft();
    }
    
    //right = 'L' key
    if(event.keyCode == 76){
        p.moveRight();
    }

    //rotate = 'I' key
    if(event.keyCode == 73){
       p.rotate();
    }

    //down = 'K' key
    if(event.keyCode == 75){
        p.moveDown(); 
    }
}

// game loop
function drawGame() {
    drawBoard();
    if (!gameOver) {
        drop();
    }
    setTimeout(drawGame, 1000);  
}

drawGame();


