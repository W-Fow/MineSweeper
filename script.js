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
            button.setAttribute("class","unclicked");
            button.setAttribute("id","("+j+","+i+")");
            button.setAttribute("onclick","reveal(this)");
            button.setAttribute("oncontextmenu","flag(this);return false;");
            board_elem.appendChild(button);
        }
    }
}

function flag(el){
    var element=el;
    element.className='flagged';
    //want to add action here to unflag
    element.setAttribute("oncontextmenu","unflag(this);return false;");
    element.setAttribute("onclick","");
}
function unflag(el){
    var element=el;
    element.className='unclicked';
    element.setAttribute("oncontextmenu","flag(this);return false;");
    element.setAttribute("onclick","reveal(this)");
}

function reveal(el){
    var element=el;
    let x = element.id[1];
    let y = element.id[3];
    element.className='clicked';
    element.setAttribute("oncontextmenu","");
    if (mines[x][y]==1){
        element.textContent="boom";
    }else{
        nearByBombs=calculateNumber(Number(x),Number(y));
        if (nearByBombs==0){
            //TODO need to clear nearby cells
        }else{
            element.textContent=nearByBombs;
        }
    }
    element.disabled = true;
}
function calculateNumber(x,y){
    return (safeCheck(x-1,y-1)+
            safeCheck(x-1,y)+
            safeCheck(x-1,y+1)+
            safeCheck(x,y-1)+
            safeCheck(x,y+1)+
            safeCheck(x+1,y-1)+
            safeCheck(x+1,y)+
            safeCheck(x+1,y+1)
            );
}
function safeCheck(x,y){
    if (x>=boardSize || x<0 || y>=boardSize || y<0){
        return 0;
    }else{
        return mines[x][y];
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
function game_page(){
    location.href = "file:///C:/Users/wfowl/git/MineSweeper/game_screen.html";
}