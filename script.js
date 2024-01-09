var mines = null;
var boardSize = null;
var cellsRevealed = null;
var numCellsRevealedToWin = null;
var flagMode = false;

function generateBoard(){
    const numMines = document.getElementById("numMines").value; 
    boardSize = document.getElementById("boardSize").value; 

    const board_elem = document.getElementById("board"); 
    board_elem.style.gridTemplateColumns = `repeat(${boardSize}, 50px)`;
    board_elem.style.gridTemplateRows = `repeat(${boardSize}, 50px)`;
    createBoard(boardSize, board_elem);

    mines = create2DArray(boardSize);
    placeMines(boardSize,numMines);

    cellsRevealed=0;
    numCellsRevealedToWin = boardSize*boardSize-numMines;
}

function createBoard(n, boardElem){
    boardElem.innerHTML = '';
    for (let i=0; i<n;i++){
        for (let j=0;j<n;j++){
            var cell = document.createElement("div");
            cell.setAttribute("class","cell");
            cell.classList.add("hidden");
            cell.setAttribute("id","("+j+","+i+")");
            cell.dataset.row=i;
            cell.dataset.col=j;

            cell.addEventListener('click', handleCellClick);
            cell.addEventListener('contextmenu', handleCellRightClick);
            
            boardElem.appendChild(cell);
        }
    }
}
function create2DArray (size){
    const array = [];
    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            row.push(0);
        }
        array.push(row);
    }
    return array;
}
function placeMines(size,num){
    for (let i=0;i<num;i++){
        let x = Math.floor(Math.random()*size);
        let y = Math.floor(Math.random()*size);
        if (mines[x][y]==1){
            i--;
        }else{
            mines[x][y]=1;
        }
    }
}

function handleCellClick(event){
    const element = event.target;
    if(element.classList.contains("revealed")){
        return;
    }
    if(flagMode){
        toggleFlag(element);
    }else{
        if(! element.classList.contains("flagged")){
            revealElement(element);
        }
    }
}
function handleCellRightClick(event){
    event.preventDefault();//stop context menu from showing up
    const element = event.target;
    if(element.classList.contains("revealed")){
        return;
    }
    if(flagMode){
        if(! element.classList.contains("flagged")){
            revealElement(element);
        }
    }else{
        toggleFlag(element);
    }
}

function toggleFlag(element){
    if(element.classList.contains("flagged")){
        element.classList.remove("flagged");
    }else{
        element.classList.add("flagged");
    }
}

function toggleFlagMode(flagButton){
    flagMode = !flagMode;
    if(flagMode){
        flagButton.style.backgroundColor= "Crimson";
    }else{
        flagButton.style.backgroundColor= "DarkRed";
    }
}


function revealElement(element){
    let x = element.dataset.col;
    let y = element.dataset.row;
    reveal(element,x,y);
}
function revealByCoordinates(x,y){
    let element = document.querySelector(`.cell[data-row="${y}"][data-col="${x}"]`)
    reveal(element,x,y);
}
function reveal(element,x,y){
    element.classList.replace("hidden","revealed");
    if (mines[x][y]==1){
        element.textContent="boom";
        setTimeout(function() { //need timeout so that css and html update before the alert appears
            alert("You lose");
        }, 5)
        return;
    }else{
        nearByBombs=viewNearByCells(isBomb,Number(x),Number(y));
        if (nearByBombs==0){
            viewNearByCells(revealByCoordinates,Number(x),Number(y));
        }else{
            element.textContent=nearByBombs;
        }
    }
    element.disabled = true;
    cellsRevealed++;
    checkWin();
}
function checkWin(){
    if(cellsRevealed==numCellsRevealedToWin){
        setTimeout(function() {
            alert("Congratulations! You won");
        }, 5)
    }
}

function isBomb(x,y){
    return mines[x][y];
}

function viewNearByCells(f,x,y){
    return (safeCheck(f,x-1,y-1)+
            safeCheck(f,x-1,y)+
            safeCheck(f,x-1,y+1)+
            safeCheck(f,x,y-1)+
            safeCheck(f,x,y+1)+
            safeCheck(f,x+1,y-1)+
            safeCheck(f,x+1,y)+
            safeCheck(f,x+1,y+1)
            );
}
function safeCheck(f,x,y){
    if (x>=boardSize || x<0 || y>=boardSize || y<0){
        return 0;
    }else{
        let element = document.querySelector(`.cell[data-row="${y}"][data-col="${x}"]`)
        if(element.classList.contains("revealed")){
            return 0;
        }else{
            return f(x,y)
        }
    }
}

