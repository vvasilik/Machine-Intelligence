let list = [];
let isInit = true;
const width = 40;
const height = 40;
const IImaxSteps = 100;
const IImaxCicles = 500;
const IIrememberCiles = 10;
const IIcorrectNumber = 2;
const IIincorrectNumber = 4;
const IIdefaultKoef = 1;
const IIincreaseKoef = 0.3;
const IIdecreaseKoef = 0.3;
let IIMaxKoef = 0;
const allowedValue = "7";
const disallowedValue = "5";
const disallowCellsList = [
    // {x: 1,y: 3},{x: 1,y: 2},{x: 1,y: 1},{x: 2,y: 6},
    // {x: 1,y: 4},{x: 1,y: 5},{x: 1,y: 6},{x: 3,y: 6},{x: 4,y: 6},
    // {x: 5,y: 6},{x: 6,y: 6},{x: 7,y: 6},{x: 8,y: 6},{x: 9,y: 6},
    // {x: 4,y: 7},{x: 4,y: 8},{x: 4,y: 9},
    // {x: 1,y: 1},{x: 2,y: 1},{x: 3,y: 1},{x: 4,y: 1},{x: 5,y: 1},{x: 6,y: 1},{x: 7,y: 1},{x: 8,y: 1},{x: 9, y: 1},{x: 0, y: 8}
];
const bonusList = [
    // {x: 10,y: 1}
];
const startX = 0;
const startY = 0;

let results = [];

const outputDomElement = document.querySelector(".js-result");

const startTime = performance.now();
const savedList = JSON.parse(localStorage.getItem("list"));
createList(savedList ? savedList : []);
start();
drawAll(list);
showBest();
save(list);
// draw(list, results);

// ---------
function createList(arr) {
    if (isInit) {
        isInit = false;

        for (let i = 0; i < width; i++) {
            list[i] = [];
            for (let j = 0; j < height; j++) {
                let koef = arr.length ? arr[i][j].IIkoef : IIdefaultKoef;
                let isDisallow = isDisallowCells(i, j);
                list[i][j] = {};
                list[i][j].coords = [i, j];

                if (isDisallow) {
                    list[i][j].state = disallowedValue;
                } else {
                    list[i][j].state = allowedValue;
                }

                list[i][j].IIkoef = koef;
                list[i][j].isVisited = false;
            }
        }
    } else {
        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < list[i].length; j++) {
                let isDisallow = isDisallowCells(i, j);

                if (isDisallow) {
                    list[i][j].state = disallowedValue;
                } else {
                    list[i][j].state = allowedValue;
                }

                list[i][j].isVisited = false;
            }
        }
    }
}

function start() {
    if (results.length % IIrememberCiles === 0) IIsetKoef();

    let tempResults = [];
    let tempPosition = [startX, startY];

    for (let step = 0; step < IImaxSteps; step++) {
        tempPosition = runStep(tempPosition);

        if (tempPosition) {
            tempResults.push(tempPosition);
            if (checkIfBonus(tempPosition)) setBonus(tempResults);
        } else {
            addToResults(tempResults);
            break;
        }
    }

    if (results.length < IImaxCicles) {
        createList([]);
        start();
    } else {
        let endTime = performance.now();
        console.log(endTime - startTime);
    }
}

function setBonus(arr) {
    for (let i = 0; i < arr.length; i++) {
        let x = arr[i][0];
        let y = arr[i][1];

        list[x][y].IIkoef += IIincreaseKoef * 100;
    }
}

function checkIfBonus(arr) {
    for (let i = 0; i < bonusList.length; i++) {
        if (bonusList[i].x === arr[0] &&  bonusList[i].y === arr[1]) return true;
    }

    return false;
}

function IIsetKoef() {
    let lastResults = results.slice(results.length - IIrememberCiles,results.length);

    if (!lastResults.length) return false;

    increaseKoef(lastResults);
    decreaseKoef(lastResults);
}

function increaseKoef(lastResults) {
    lastResults.sort(function (a, b) {
        return a.length < b.length ? 1 : -1;
    });

    for (let i = 0; i < IIcorrectNumber; i++) {
        let arr = lastResults[i];

        for (let cell = 0; cell < arr.length; cell++) {
            let koef = list[arr[cell][0]][arr[cell][1]].IIkoef;
            list[arr[cell][0]][arr[cell][1]].IIkoef = koef + IIincreaseKoef * arr.length;
        }
    }
}

function decreaseKoef(lastResults) {
    lastResults.sort(function (a, b) {
        return a.length > b.length ? 1 : -1;
    });

    for (let i = 0; i < IIincorrectNumber; i++) {
        let arr = lastResults[i];

        for (let cell = 0; cell < arr.length; cell++) {
            let IIkoef = list[arr[cell][0]][arr[cell][1]].IIkoef - IIdecreaseKoef;

            list[arr[cell][0]][arr[cell][1]].IIkoef = IIkoef < 0 ? IIdefaultKoef : IIkoef;
        }
    }
}

function runStep(tempPosition) {
    let x = tempPosition[0];
    let y = tempPosition[1];
    let allowedCells = getAllowedCells(x, y);

    if (allowedCells.length) {
        let nextCell = IIgetNextCell(allowedCells);

        setCellVisited(nextCell);
        return nextCell.coords;
    } else {
        return false;
    }
}

function isDisallowCells(i, j) {
    let result = false;

    for (let num = 0; num < disallowCellsList.length; num++) {
        let x = disallowCellsList[num].x;
        let y = disallowCellsList[num].y;

        if (i === x && j === y) {
            result = true;
            break;
        }
    }

    return result;
}

function setCellVisited(cell) {
    cell.isVisited = true;
}

function addToResults(item) {
    results.push(item);
}

function getAllowedCells(x, y) {
    let siblings = getSiblingCells(x, y);
    let result = [];

    for (let i = 0; i < siblings.length; i++) {
        const xPos = siblings[i].x;
        const yPos = siblings[i].y;
        const cell = list[xPos][yPos];

        if (cell.state === allowedValue && !cell.isVisited) result.push(siblings[i]);
    }

    return result;
}

function getSiblingCells(x, y) {
    const possibleCells = [
        {x: x - 1, y: y},
        {x: x, y: y - 1},
        {x: x, y: y + 1},
        {x: x + 1, y: y}
        // wide steps
        // {x: x - 1, y: y - 1},
        // {x: x - 1, y: y + 1},
        // {x: x + 1, y: y - 1},
        // {x: x + 1, y: y + 1}
    ];

    return filterPossibleCells(possibleCells);
}

function filterPossibleCells(possibleCells) {
    let result = [];

    for (let i = 0; i < possibleCells.length; i++) {
        const x = possibleCells[i].x;
        const y = possibleCells[i].y;

        if (list[x] && list[x][y]) {
            result.push(possibleCells[i]);
        }
    }

    return result;
}

function IIgetNextCell(allowedCells) {
    setTempProcent({koefSum: countKoefSum()});
    return getRandom();

    // -----------
    function countKoefSum() {
        let result = 0;

        for (let i=0; i<allowedCells.length; i++) {
            let x = allowedCells[i].x;
            let y = allowedCells[i].y;

            result += list[x][y].IIkoef;
        }

        return result;
    }

    function setTempProcent(options) {
        const koefSum = options.koefSum;
        const etalon = 100 / koefSum;
        for (let i=0; i<allowedCells.length; i++) {
            let x = allowedCells[i].x;
            let y = allowedCells[i].y;

            list[x][y].procent = list[x][y].IIkoef * etalon;
        }
    }

    function getRandom() {
        let randomNumber = Math.floor( Math.random() * 100 );
        let procentSum = 0;

        for (let i=0; i<allowedCells.length; i++) {
            const x = allowedCells[i].x;
            const y = allowedCells[i].y;

            if (randomNumber >= procentSum && randomNumber < procentSum + list[x][y].procent) {
                return list[x][y];
            } else {
                procentSum += list[x][y].procent;
            }
        }
    }
}

// drawAllInOne
function drawAll(map) {
    setMaxState(list);
    drawMap(map);
    // drawAllInOne(res);
}

function drawAllInOne(arr) {

}

function setMaxState(arr) {
    let resultArr = [];

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            resultArr.push(arr[i][j].IIkoef);
        }
    }

    IIMaxKoef = resultArr.sort(function(a, b){
        return a < b ? -1 : 1;
    })[resultArr.length - 1];
}

// draw
function draw(map, res) {
    // drawStatic();
    drawResults(map, res);
}

function drawStatic() {
    drawStartPosition();
    drawWalls();
}

function drawStartPosition() {
    let list = document.querySelector(".list");
    let row = list.querySelectorAll(".row");
    let item = row[startX].querySelectorAll(".cell")[startY];
    (<HTMLElement>item).style.backgroundColor = "green";
}

function drawWalls() {

}

function drawMap(arr) {
    let result = document.createElement("ul");
    result.className = "list";

    for (let i = 0; i < arr.length; i++) {
        let row = document.createElement("li");
        row.className = "row";

        let coll = document.createElement("ul");
        coll.className = "coll";

        for (let j = 0; j < arr[i].length; j++) {
            let cell = document.createElement("li");
            cell.className = "cell";
            cell.innerText = `${Math.floor(calcProcent(arr[i][j].IIkoef) * 100)}`;
            cell.style.backgroundColor = `rgba(0, 0, 256, ${calcProcent(arr[i][j].IIkoef)})`;
            coll.appendChild(cell);
        }

        row.appendChild(coll);
        result.appendChild(row);
    }

    outputDomElement.appendChild(result);
}

function calcProcent(number) {
    return number / IIMaxKoef
}

function drawResults(map, res) {
    for (let i = 0; i < res.length; i++) {
        drawMap(map);
        drawResult(res[i]);
    }
}

function drawResult(arr) {
    let lists = document.querySelectorAll(".list");
    let list = lists[lists.length - 1];
    let row = list.querySelectorAll(".row");

    for (let i = 0; i < arr.length; i++) {

        let item = row[arr[i][0]].querySelectorAll(".cell")[arr[i][1]];
        (<HTMLElement>item).style.backgroundColor = "red";
        (<HTMLElement>item).style.opacity = `${i * 0.01}`;
    }
}

function save(arr) {
    localStorage.setItem("list", JSON.stringify(arr));
}

function showBest() {
    results.sort(function(a,b){return a.length < b.length ? 1 : -1});
    drawResult(results[0])
}