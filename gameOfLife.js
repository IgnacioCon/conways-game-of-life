
//size of the matrix
var size = 500;


var currentGeneration = []; //matrix for current generation
var newGeneration = [];     //matrix for new generation
var temporaryMatrix = [];   
var isPaused = false;       //used to pause the animation


initMatrix(size, currentGeneration);
initMatrix(size, newGeneration);
temporaryMatrix = tempMatrix(size);

fillWithRandomNumber(currentGeneration);


//set the frames per second
var fps=10;

//draw matrix once
drawMatrix();

//main loop
function generatePopulation(){

    if(!isPaused){
        //draws initial state
        drawMatrix();

        //evalautes the cells, and generates the population
        evaluateNeighbors(currentGeneration, newGeneration, temporaryMatrix);
    }

    //set a timeout to slow down the animation
    //request a new frame, to redraw the new populatuon
    setTimeout(function(){
        requestAnimationFrame(generatePopulation);
    }, 1000/fps);
    
}

var buttonStart = document.getElementById("buttonStart"); //Start the main loop
var buttonPause = document.getElementById("buttonPause"); //pause the animation
var buttonReset = document.getElementById("buttonReset"); //reset the population

buttonStart.addEventListener("click", function(e){

    if(isPaused){
        isPaused = false;
        buttonPause.innerText = "Pause";
    }
    //call main loop
    generatePopulation();
});

buttonPause.addEventListener("click", function(e){
    if(!isPaused){
        isPaused = true;
        buttonPause.innerText = "Resume";
    }else {
        isPaused = false;
        buttonPause.innerText = "Pause";
    }
});

buttonReset.addEventListener("click", function(e){
    fillWithRandomNumber(currentGeneration);
});





//Initializes a matrix with the desired size
function initMatrix(size, matrix){

    for(var i = 0; i<size; i++){
        matrix[i] =[];
        for(var j = 0; j < size; j++){
            matrix[i][j] = 0;
        }
    }
}

//create a temporary matrix that is bigger than the matrix used to store the cells
//to avoid errors when checking edges and corner cells during neighbor evaluation
function tempMatrix(size){
    var matrix =[];
    for(var i = 0; i<size+2;i++){
        matrix[i] = [];
        for(var j=0; j<size+2; j++){
            matrix[i][j] =0;
        }
    }

    return matrix;
}


//for the sake of simplicity and time
//fill the matrix with random 1 and 0s
function fillWithRandomNumber(currentGeneration){
    var randomNumber = 0;
    for(var i = 0; i<size; i++){
        for(var j = 0; j < size; j++){
            randomNumber =  Math.floor(Math.random() * Math.floor(2));
            if(randomNumber === 1){
                currentGeneration[i][j] = 1;
            } else {
                currentGeneration[i][j] = 0;
            }
        }
    }   
    
}


//make a copy of the currentGeneration to the bigger matrix
//that will be used to evaluate the neighbors of each cell
function copyGenToMatrix(currentGeneration, matrix){
    for(var i = 0; i<size;i++){
        for(var j=0; j<size; j++){
            matrix[i+1][j+1] = currentGeneration[i][j];
        }
    }
}

//copy the new generation of cells created to the current generation
//and continue the next generation of cells
function copyNewGenToCurrentGen(currentGeneration, newGeneration){
    for(var i = 0; i<size;i++){
        for(var j=0; j<size; j++){
            currentGeneration[i][j] = newGeneration[i][j];
        }
    }
}


//evalaute the neighbors of each cell
function evaluateNeighbors(currentGeneration, newGeneration, temporaryMatrix){
    //set number of cells alive to 0
    var cellsAlive = 0;
    //make a copy of the current generation to the temporaryMatrix
    copyGenToMatrix(currentGeneration,temporaryMatrix);

    for(var i = 1; i<=size; i++){
        for(var j = 1; j <= size; j++){
            
            cellsAlive += temporaryMatrix[i-1][j-1]; //top left corner
            cellsAlive += temporaryMatrix[i][j-1];   //top
            cellsAlive += temporaryMatrix[i+1][j-1]; //top right corner
            cellsAlive += temporaryMatrix[i-1][j];   //left
            cellsAlive += temporaryMatrix[i+1][j];   //right
            cellsAlive += temporaryMatrix[i-1][j+1]; //bottom left corner
            cellsAlive += temporaryMatrix[i][j+1];   //down
            cellsAlive += temporaryMatrix[i+1][j+1]; //bottom right corner


            //rules of the game

            //check to see if the cell is dead
            //if the cell is dead and there three live neighbors
            //then the cell lives in the next generation
            if((temporaryMatrix[i][j] == 0) && (cellsAlive == 3)){
                newGeneration[i-1][j-1] = 1;
            
                //else if the cell is alive then
            }else if(temporaryMatrix[i][j] ==1){
                //if cells alive are less than 2 the cell dies in the next generation
                if(cellsAlive < 2 ){
                    newGeneration[i-1][j-1] = 0;

                    //if neighboring cells alive are 2 or 3 than the cell
                    //lives on to the next generation
                }else if((cellsAlive == 2) || (cellsAlive == 3)){
                    newGeneration[i-1][j-1] = 1;


                    //if cells alive are more than 3 then
                    //the cell dies due to overpopulation
                }else if(cellsAlive > 3){
                    newGeneration[i-1][j-1] = 0;
                }
            }

            //reset cellsAlive to 0
            cellsAlive = 0;

            
        }
    }

    //after evalauting each cell
    //copy the new generation to the current generation to keep the loop going
    copyNewGenToCurrentGen(currentGeneration, newGeneration)
}


//draw the matrix on the canvas
function drawMatrix(){
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    context.fillStyle = "#000";

    //clears canvas to redraw the matrix
    context.clearRect(0,0,500,500);

    for(var i = 0; i<size; i++){
        for(var j = 0; j < size; j++){
            
            if(currentGeneration[i][j] === 1){
                context.fillRect(j,i,1,1);
            }
        }
    }
}

