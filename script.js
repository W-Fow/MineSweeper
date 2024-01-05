var mines = null;
var boardSize = null;
var flagMode = false;

function generateBoard(){
    let numMines = document.getElementById("numMines").value;
    let size = document.getElementById("boardSize").value;
    let board_elem = document.getElementById("board");
    board_elem.style.gridTemplateColumns = `repeat(${size}, 50px)`;
    board_elem.style.gridTemplateRows = `repeat(${size}, 50px)`;

    mines =create2DArray(size);
    boardSize = size;
    createBoard(size);
    placeMines(size,numMines);
}

function create2DArray (size){
    let array = [];
    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            row.push(0);
        }
        array.push(row);
    }
    return array;
}

function createBoard(n){
    const board_elem = document.getElementById("board");
    board_elem.innerHTML = '';
    for (let i=0; i<n;i++){
        for (let j=0;j<n;j++){
            const button = document.createElement("button");
            button.setAttribute("class","cell");
            button.setAttribute("id","("+j+","+i+")");
            button.setAttribute("onclick","revealElement(this)");
            button.setAttribute("oncontextmenu","flag(this);return false;");
            board_elem.appendChild(button);
        }
    }
}

function flag(el){
    var element=el;
    element.classList.add('flagged');
    element.setAttribute("oncontextmenu","unflag(this);return false;");
    element.setAttribute("onclick","");
    element.disabled = true;
}
function unflag(el){
    var element=el;
    element.classList.remove('flagged');
    element.setAttribute("oncontextmenu","flag(this);return false;");
    element.setAttribute("onclick","revealElement(this)");
    element.disabled = false;
}
function revealElement(el){
    var element=el;
    let x = element.id[1];
    let y = element.id[3];
    reveal(element,x,y);
}
function revealByCoordinates(x,y){
    console.log("x:"+x+" y:"+y);
    let element=document.getElementById("("+x+","+y+")");
    reveal(element,x,y);
}
function reveal(el,x,y){
    let element=el;
    element.classList.add('revealed');
    element.setAttribute("oncontextmenu","");
    if (mines[x][y]==1){
        element.textContent="boom";
        alert("You lose");

    }else{
        nearByBombs=viewNearByCells(isBomb,Number(x),Number(y));
        if (nearByBombs==0){
            viewNearByCells(revealByCoordinates,Number(x),Number(y));
        }else{
            element.textContent=nearByBombs;
        }
    }
    element.disabled = true;
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
        element = document.getElementById("("+x+","+y+")");
        if(element.classList.contains("revealed")){
            return 0;
        }else{
        return f(x,y)
        }
    }
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
