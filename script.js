let grid = Array(9).fill().map(() =>
    Array(9).fill(0));

let finalBoard = Array(9).fill().map(() =>
    Array(9).fill(0));

let isEditable = Array(9).fill().map(() =>
    Array(9).fill(true));

let lastClicked = ""

let blanks = 0

function checkWin() {
    if (blanks === 0) {
        stopTimer()
        setTimeout(() => {
            document.getElementById("result").style.display = "block"
        }, 2000);
    }
}

function keyFunctions() {
    const boxes = document.getElementsByClassName("box")
    for (let i = 0; i < boxes.length; i++) {
        let id = boxes[i].id
        let j = id.charAt(3)
        let k = id.charAt(4)
        if (isEditable[j][k]) {
            boxes[i].style.display = "grid"
            boxes[i].style.gridTemplateRows = "repeat(3,1fr)"
            boxes[i].style.gridTemplateColumns = "repeat(3,1fr)"
            for (let m = 1; m <= 9; m++) {
                let newBox = document.createElement("div");
                newBox.id = j + "" + k + "" + m
                newBox.textContent = ""
                newBox.style.fontSize = 12 + "px"
                boxes[i].appendChild(newBox)
            }
        }
    }
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].addEventListener("click", function () {
            if (lastClicked.length !== 0)
                document.getElementById(lastClicked).classList.remove("active")
            let id = boxes[i].id
            lastClicked = id
            boxes[i].classList.add("active")
            let j = id.charAt(3)
            let k = id.charAt(4)
            document.body.onkeydown = (e) => {
                let key = e.key;
                if (isEditable[j][k] === false)
                    alert("cant edit this cell")
                else if (!document.getElementById("candidateToggle").checked) {
                    if (key.length === 1 && key >= 1 && key <= 9) {
                        if (isSafe(j, k, key, finalBoard)) {
                            for (let m = 1; m <= 9; m++) {
                                let id = j + "" + k + "" + m
                                document.getElementById(id).textContent = ""
                            }
                            let id = j + "" + k + "" + 5
                            document.getElementById(id).textContent = key
                            document.getElementById(id).style.fontSize = 40 + "px"
                            finalBoard[j][k] = +key
                            let startRow = j - j % 3;
                            let startCol = k - k % 3;
                            for (let p = 0; p < 3; p++) {
                                for (let n = 0; n < 3; n++) {
                                    let row = startRow + p
                                    let col = startCol + n
                                    if (isEditable[row][col]) {
                                        let id = row + "" + col + "" + key
                                        if (document.getElementById(id).style.fontSize !== 40 + "px")
                                            document.getElementById(id).textContent = ""
                                    }
                                }
                            }
                            for (let p = 0; p < 9; p++) {
                                if (isEditable[p][k]) {
                                    let id = p + "" + k + "" + key
                                    if (document.getElementById(id).style.fontSize !== 40 + "px")
                                        document.getElementById(id).textContent = ""
                                }
                                if (isEditable[j][p]) {
                                    let id = j + "" + p + "" + key
                                    if (document.getElementById(id).style.fontSize !== 40 + "px")
                                        document.getElementById(id).textContent = ""
                                }
                            }
                            blanks--
                            checkWin()
                        }
                        else {
                            boxes[i].classList.add("wrong")
                            setTimeout(() => {
                                boxes[i].classList.remove("wrong")
                            }, 1500)
                        }
                    }
                    else if (key === "Backspace" || key === "Delete") {
                        let id = j + "" + k + "" + 5
                        document.getElementById(id).textContent = ""
                        finalBoard[j][k] = 0
                        blanks++
                    }
                }
                else if (document.getElementById("candidateToggle").checked) {
                    let id = j + "" + k + "" + 5
                    if (document.getElementById(id).style.fontSize === 40 + "px")
                        document.getElementById(id).textContent = ""
                    document.getElementById(id).style.fontSize = 12 + "px"
                    if (key.length === 1 && key >= 0 && key <= 9) {
                        let id = j + "" + k + "" + key
                        if (document.getElementById(id).textContent === key)
                            document.getElementById(id).textContent = ""
                        else
                            document.getElementById(id).textContent = key
                    }
                }
            }
        })
    }
}

function checkRow(row, num, grid) {
    for (let col = 0; col < 9; col++)
        if (grid[row][col] == num)
            return false;
    return true;
}

function checkCol(col, num, grid) {
    for (let row = 0; row < 9; row++)
        if (grid[row][col] == num)
            return false;
    return true;
}

function checkBox(row, col, num, grid) {
    let startRow = row - row % 3;
    let startCol = col - col % 3;
    for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++)
            if (grid[startRow + i][startCol + j] == num)
                return false;
    return true;
}

function isSafe(row, col, num, grid) {
    return checkRow(row, num, grid) && checkCol(col, num, grid) && checkBox(row, col, num, grid);
}

function createGrid(grid) {
    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    nums.sort(() => Math.random() - 0.5);
    for (let i = 0; i < 9; i++)
        grid[0][i] = nums[i];
    solveSudoku(0, 0, grid);
    return grid;
}

function createEmptyCells(grid, minNum) {
    let options = new Array()
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            finalBoard[i][j] = grid[i][j]
            options.push(new Array(i, j))
        }
    }
    let emptyCellCount = Math.floor(Math.random() * 10 + 1) + minNum;
    blanks = emptyCellCount
    let count = 0;
    options.sort(() => Math.random() - 0.5);
    while (count++ < emptyCellCount) {
        let index = options.pop()
        finalBoard[index[0]][index[1]] = 0;
    }
    return finalBoard;
}

function solveSudoku(row, col, grid) {
    if (row == 8 && col == 9)
        return true;
    if (col == 9) {
        row += 1;
        col = 0;
    }
    if (grid[row][col] != 0)
        return solveSudoku(row, col + 1, grid);
    for (let num = 1; num < 10; num++) {
        if (isSafe(row, col, num, grid)) {
            grid[row][col] = num;
            if (solveSudoku(row, col + 1, grid))
                return true;
        }
        grid[row][col] = 0;
    }
    return false;
}

function fillBoard(finalBoard) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (finalBoard[i][j] != 0) {
                document.getElementById("box" + i + j).textContent = finalBoard[i][j]
                document.getElementById("box" + i + j).style.backgroundColor = "#FFCCEA"
                document.getElementById("box" + i + j).style.color = "#691013"
                isEditable[i][j] = false
            }
        }
    }
}

document.getElementById("solveButton").addEventListener("click", () => {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (isEditable[i][j]) {
                for (let m = 1; m <= 9; m++)
                    document.getElementById(i + "" + j + "" + m).textContent = ""
                document.getElementById(i + "" + j + "" + 5).textContent = grid[i][j]
                document.getElementById(i + "" + j + "" + 5).style.fontSize = 40 + "px"
            }
        }
    }
    stopTimer()
    setTimeout(() => {
        document.getElementById("resultRevealed").style.display = "block"
    }, 2000);
})

document.getElementById("revealButton").addEventListener("click", () => {
    if (lastClicked.length === 0)
        return
    let j = lastClicked.charAt(3)
    let k = lastClicked.charAt(4)
    if (isEditable[j][k]) {
        for (let m = 1; m <= 9; m++)
            document.getElementById(j + "" + k + "" + m).textContent = ""
        document.getElementById(j + "" + k + "" + 5).textContent = grid[j][k]
        key = grid[j][k]
        document.getElementById(j + "" + k + "" + 5).style.fontSize = 40 + "px"
        isEditable[j][k] = false
        document.getElementById("box" + j + k).style.backgroundColor = "pink"
        let startRow = j - j % 3;
        let startCol = k - k % 3;
        for (let p = 0; p < 3; p++) {
            for (let n = 0; n < 3; n++) {
                let row = startRow + p
                let col = startCol + n
                if (isEditable[row][col]) {
                    let id = row + "" + col + "" + key
                    if (document.getElementById(id).style.fontSize !== 40 + "px")
                        document.getElementById(id).textContent = ""
                }
            }
        }
        for (let p = 0; p < 9; p++) {
            if (isEditable[p][k] && finalBoard[p][k] !== 0) {
                let id = p + "" + k + "" + key
                if (document.getElementById(id).style.fontSize !== 40 + "px")
                    document.getElementById(id).textContent = ""
            }
            if (isEditable[j][p] && finalBoard[j][p] !== 0) {
                let id = j + "" + p + "" + key
                if (document.getElementById(id).style.fontSize !== 40 + "px")
                    document.getElementById(id).textContent = ""
            }
        }
        blanks--
        checkWin()
    }
})

document.getElementById("resetButton").addEventListener("click", () => {
    const boxes = document.getElementsByClassName("box")
    let count = 0
    for (let i = 0; i < boxes.length; i++) {
        let id = boxes[i].id
        let j = id.charAt(3)
        let k = id.charAt(4)
        if (boxes[i].style.display === "grid") {
            finalBoard[j][k] = 0
            isEditable[j][k] = true
            while (boxes[i].firstChild)
                boxes[i].removeChild(boxes[i].lastChild)
            boxes[i].style.display = "block"
            boxes[i].style.backgroundColor = "aliceblue"
            count++
        }
    }
    fillBoard(finalBoard)
    keyFunctions()
    document.getElementById("candidateToggle").checked = false
    lastClicked = ""
    blanks = count
    startTimer()
})

document.getElementById("easy").addEventListener("click", () => {
    document.getElementById("topPlate").style.display = "none"
    grid = createGrid(grid)
    finalBoard = createEmptyCells(grid, 15);
    fillBoard(finalBoard)
    keyFunctions()
    startTimer()
})

document.getElementById("medium").addEventListener("click", () => {
    document.getElementById("topPlate").style.display = "none"
    grid = createGrid(grid)
    finalBoard = createEmptyCells(grid, 35);
    fillBoard(finalBoard)
    keyFunctions()
    startTimer()
})

document.getElementById("hard").addEventListener("click", () => {
    document.getElementById("topPlate").style.display = "none"
    grid = createGrid(grid)
    finalBoard = createEmptyCells(grid, 60);
    fillBoard(finalBoard)
    keyFunctions()
    startTimer()
})


let startTime;
let endTime;
let timerInterval

function startTimer() {
    startTime = new Date().getTime();
    timerInterval = setInterval(function () {
        let currentTime = new Date().getTime();
        let elapsedTime = currentTime - startTime;
        let minutes = Math.floor(elapsedTime / (1000 * 60));
        let seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
        if (minutes < 10)
            minutes = "0" + minutes
        if (seconds < 10)
            seconds = "0" + seconds
        document.getElementById("timer").textContent = minutes + " : " + seconds
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    let endTime = new Date().getTime();
    let totalTime = endTime - startTime;
    let totalMinutes = Math.floor(totalTime / (1000 * 60));
    let totalSeconds = Math.floor((totalTime % (1000 * 60)) / 1000);
    document.getElementById("timeTaken").textContent = "Time taken: " + totalMinutes + " minutes " + totalSeconds + " seconds"
}
