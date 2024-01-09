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
    createBoard(boardSize);

    mines = create2DArray(boardSize);
    placeMines(boardSize,numMines);

    cellsRevealed=0;
    numCellsRevealedToWin = boardSize*boardSize-numMines;
}

function createBoard(n){
    const board_elem = document.getElementById("board");
    board_elem.innerHTML = '';
    for (let i=0; i<n;i++){
        for (let j=0;j<n;j++){
            const button = document.createElement("button");
            button.setAttribute("class","cell");
            button.classList.add("hidden");
            button.setAttribute("id","("+j+","+i+")");

            button.addEventListener('click', handleCellClick);
            button.addEventListener('contextmenu', handleCellRightClick);
            
            board_elem.appendChild(button);
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
        unflag(element);
    }else{
        flag(element);
    }
}

function flag(element){
    //let element=el;
    element.classList.add('flagged');
}
function unflag(element){
    //let element=el;
    element.classList.remove('flagged');
}

function toggleFlagMode(flagButton){
    flagMode = !flagMode
    if(flagMode){
        flagButton.style.backgroundColor= "Crimson";
    }else{
        flagButton.style.backgroundColor= "DarkRed";
    }
}


function revealElement(el){
    let element=el;
    let x = element.id[1];
    let y = element.id[3];
    reveal(element,x,y);
}
function revealByCoordinates(x,y){
    let element=document.getElementById("("+x+","+y+")");
    reveal(element,x,y);
}
function reveal(el,x,y){
    let element=el;
    element.classList.replace("hidden","revealed");
    if (mines[x][y]==1){
        element.textContent="boom";
        setTimeout(function() {
            alert("You lose");
        }, 0)
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
    if(cellsRevealed==numCellsRevealedToWin){
        setTimeout(function() {
            alert("Congratulations! You won");
        }, 0)
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
        let element = document.getElementById("("+x+","+y+")");
        if(element.classList.contains("revealed")){
            return 0;
        }else{
            return f(x,y)
        }
    }
}

