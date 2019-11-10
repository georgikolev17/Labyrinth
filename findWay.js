let gridX;
let gridY;
let isDone = false;
let labyrinth = [
    ['*', '*', '*', '*', 'f', 'f', '*', 'f', '*', '*'],
    ['*', '.', '.', '.', '*', '*', '.', '*', '.', '*'],
    ['*', '.', '*', '.', '.', '*', '.', '*', '.', '*'],
    ['*', '.', '*', '*', '.', '*', '.', '*', '*', '*'],
    ['*', '.', '.', '*', '.', '.', '.', '*', '.', 'f'],
    ['*', '.', '*', '*', '.', '*', '.', '*', '.', '*'],
    ['*', '.', '.', '.', '.', '*', '.', '.', '.', '*'],
    ['*', '*', '*', '*', '*', '*', '*', '*', 'f', '*']
];
let way = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];
function mouseClick(e) {
    if(!isDone) {
        let mouseX, mouseY;

        if (e.offsetX) {
            mouseX = e.offsetX;
            mouseY = e.offsetY;
        } else if (e.layerX) {
            mouseX = e.layerX;
            mouseY = e.layerY;
        }

        gridX = Math.floor(mouseX / 75.591);
        gridY = Math.floor(mouseY / 75.591);

        if(labyrinth[gridY][gridX] != '*') {
            let newImage = document.createElement("img");
            newImage.setAttribute('src', 'emojismile.svg');
            newImage.setAttribute('id', 'smile');
            newImage.style.left = (gridX * 75.591 + 75.591 / 8) + "px";
            newImage.style.top = (gridY * 75.591 + 75.591 / 8) + "px";
            document.body.appendChild(newImage);
            isDone = true;
        }
    }
};

function play(e) {
    if(isDone){
        let rows = [];
        let cols = [];
        rows.push(gridY);
        cols.push(gridX);

        way[gridY][gridX] = -1;

        let distance = 1;
        let finalRow;
        let finalCol;
        let isThereAnExit = false;
        let visited = [
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false]
        ];
        visited[gridY][gridX] = true;

        while (rows.length>0) {
            let currentRow = rows.shift();
            let currentCol = cols.shift();
            let current = labyrinth[currentRow][currentCol];

            if(current == 'f'){
                finalRow = currentRow;
                finalCol = currentCol;
                isThereAnExit = true;
                break;
            }

            if(upNeighbour(currentRow, currentCol, visited)){
                rows.push(currentRow-1);
                cols.push(currentCol);
                way[currentRow-1][currentCol] = distance;
                visited[currentRow-1][currentCol] = true;
            }
            if(downNeighbour(currentRow, currentCol, visited)){
                rows.push(currentRow+1);
                cols.push(currentCol);
                way[currentRow+1][currentCol] = distance;
                visited[currentRow+1][currentCol] = true;
            }
            if(leftNeighbour(currentRow, currentCol, visited)){
                rows.push(currentRow);
                cols.push(currentCol-1);
                way[currentRow][currentCol-1] = distance;
                visited[currentRow][currentCol-1] = true;
            }
            if(rightNeighbour(currentRow, currentCol, visited)) {
                rows.push(currentRow);
                cols.push(currentCol+1);
                way[currentRow][currentCol+1] = distance;
                visited[currentRow][currentCol+1] = true;
            }

            distance++;
        }
        printWayToExit(isThereAnExit, labyrinth, way, gridX, gridY, finalRow, finalCol, distance);
    }
}

function printWayToExit(isThereAnExit, labyrinth, way, gridX, gridY, finalRow, finalCol, distance) {
    if(isThereAnExit==false){
        document.getElementById("result").innerHTML = 'There is no exit from there! Try something else!';
    }

    else {
        if(labyrinth[gridY][gridX]!='f') {
            let br=1;
            while (distance >= 0) {
                let newImage = document.createElement("img");
                newImage.setAttribute('src', 'emojismile.svg');
                newImage.setAttribute('id', 'smile');
                newImage.style.left = (finalCol * 75.591 + 75.591 / 8) + "px";
                newImage.style.top = (finalRow * 75.591 + 75.591 / 8) + "px";
                document.body.appendChild(newImage);
                if (finalCol - 1 >= 0 && way[finalRow][finalCol - 1] == distance - 1 && labyrinth[finalRow][finalCol - 1] != '*') {
                    finalCol--;
                    br++;
                } else if (finalCol + 1 < 10 && way[finalRow][finalCol + 1] == distance - 1 && labyrinth[finalRow][finalCol + 1] != '*') {
                    finalCol++;
                    br++;
                } else if (finalRow + 1 < 8 && way[finalRow + 1][finalCol] == distance - 1 && labyrinth[finalRow + 1][finalCol] != '*') {
                    finalRow++;
                    br++;
                } else if (finalRow - 1 >= 0 && way[finalRow - 1][finalCol] == distance - 1 && labyrinth[finalRow - 1][finalCol] != '*') {
                    finalRow--;
                    br++;
                }

                distance--;
            }
            document.getElementById("result").innerHTML = 'You escaped in ' + br + ' moves';
        }
        else{
            document.getElementById("result").innerHTML = 'You escaped in 1 move';
        }
    }
}


function upNeighbour(currentRow, currentCol, visited) {
    return currentRow-1>=0 && labyrinth[currentRow-1][currentCol] != '*' && !visited[currentRow-1][currentCol];
}

function downNeighbour(currentRow, currentCol, visited) {
    return currentRow+1<8 && labyrinth[currentRow+1][currentCol] != '*' && !visited[currentRow+1][currentCol];
}

function leftNeighbour(currentRow, currentCol, visited) {
    return currentCol-1>=0&& labyrinth[currentRow][currentCol-1] != '*' && !visited[currentRow][currentCol-1];
}

function rightNeighbour(currentRow, currentCol, visited) {
    return currentCol+1<10&& labyrinth[currentRow][currentCol+1] != '*' && !visited[currentRow][currentCol+1];
}