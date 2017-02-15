/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	var list = [];
	var isInit = true;
	var width = 40;
	var height = 40;
	var IImaxSteps = 100;
	var IImaxCicles = 500;
	var IIrememberCiles = 10;
	var IIcorrectNumber = 2;
	var IIincorrectNumber = 4;
	var IIdefaultKoef = 1;
	var IIincreaseKoef = 0.3;
	var IIdecreaseKoef = 0.3;
	var IIMaxKoef = 0;
	var allowedValue = "7";
	var disallowedValue = "5";
	var disallowCellsList = [];
	var bonusList = [];
	var startX = 0;
	var startY = 0;
	var results = [];
	var outputDomElement = document.querySelector(".js-result");
	var startTime = performance.now();
	var savedList = JSON.parse(localStorage.getItem("list"));
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
	        for (var i = 0; i < width; i++) {
	            list[i] = [];
	            for (var j = 0; j < height; j++) {
	                var koef = arr.length ? arr[i][j].IIkoef : IIdefaultKoef;
	                var isDisallow = isDisallowCells(i, j);
	                list[i][j] = {};
	                list[i][j].coords = [i, j];
	                if (isDisallow) {
	                    list[i][j].state = disallowedValue;
	                }
	                else {
	                    list[i][j].state = allowedValue;
	                }
	                list[i][j].IIkoef = koef;
	                list[i][j].isVisited = false;
	            }
	        }
	    }
	    else {
	        for (var i = 0; i < list.length; i++) {
	            for (var j = 0; j < list[i].length; j++) {
	                var isDisallow = isDisallowCells(i, j);
	                if (isDisallow) {
	                    list[i][j].state = disallowedValue;
	                }
	                else {
	                    list[i][j].state = allowedValue;
	                }
	                list[i][j].isVisited = false;
	            }
	        }
	    }
	}
	function start() {
	    if (results.length % IIrememberCiles === 0)
	        IIsetKoef();
	    var tempResults = [];
	    var tempPosition = [startX, startY];
	    for (var step = 0; step < IImaxSteps; step++) {
	        tempPosition = runStep(tempPosition);
	        if (tempPosition) {
	            tempResults.push(tempPosition);
	            if (checkIfBonus(tempPosition))
	                setBonus(tempResults);
	        }
	        else {
	            addToResults(tempResults);
	            break;
	        }
	    }
	    if (results.length < IImaxCicles) {
	        createList([]);
	        start();
	    }
	    else {
	        var endTime = performance.now();
	        console.log(endTime - startTime);
	    }
	}
	function setBonus(arr) {
	    for (var i = 0; i < arr.length; i++) {
	        var x = arr[i][0];
	        var y = arr[i][1];
	        list[x][y].IIkoef += IIincreaseKoef * 100;
	    }
	}
	function checkIfBonus(arr) {
	    for (var i = 0; i < bonusList.length; i++) {
	        if (bonusList[i].x === arr[0] && bonusList[i].y === arr[1])
	            return true;
	    }
	    return false;
	}
	function IIsetKoef() {
	    var lastResults = results.slice(results.length - IIrememberCiles, results.length);
	    if (!lastResults.length)
	        return false;
	    increaseKoef(lastResults);
	    decreaseKoef(lastResults);
	}
	function increaseKoef(lastResults) {
	    lastResults.sort(function (a, b) {
	        return a.length < b.length ? 1 : -1;
	    });
	    for (var i = 0; i < IIcorrectNumber; i++) {
	        var arr = lastResults[i];
	        for (var cell = 0; cell < arr.length; cell++) {
	            var koef = list[arr[cell][0]][arr[cell][1]].IIkoef;
	            list[arr[cell][0]][arr[cell][1]].IIkoef = koef + IIincreaseKoef * arr.length;
	        }
	    }
	}
	function decreaseKoef(lastResults) {
	    lastResults.sort(function (a, b) {
	        return a.length > b.length ? 1 : -1;
	    });
	    for (var i = 0; i < IIincorrectNumber; i++) {
	        var arr = lastResults[i];
	        for (var cell = 0; cell < arr.length; cell++) {
	            var IIkoef = list[arr[cell][0]][arr[cell][1]].IIkoef - IIdecreaseKoef;
	            list[arr[cell][0]][arr[cell][1]].IIkoef = IIkoef < 0 ? IIdefaultKoef : IIkoef;
	        }
	    }
	}
	function runStep(tempPosition) {
	    var x = tempPosition[0];
	    var y = tempPosition[1];
	    var allowedCells = getAllowedCells(x, y);
	    if (allowedCells.length) {
	        var nextCell = IIgetNextCell(allowedCells);
	        setCellVisited(nextCell);
	        return nextCell.coords;
	    }
	    else {
	        return false;
	    }
	}
	function isDisallowCells(i, j) {
	    var result = false;
	    for (var num = 0; num < disallowCellsList.length; num++) {
	        var x = disallowCellsList[num].x;
	        var y = disallowCellsList[num].y;
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
	    var siblings = getSiblingCells(x, y);
	    var result = [];
	    for (var i = 0; i < siblings.length; i++) {
	        var xPos = siblings[i].x;
	        var yPos = siblings[i].y;
	        var cell = list[xPos][yPos];
	        if (cell.state === allowedValue && !cell.isVisited)
	            result.push(siblings[i]);
	    }
	    return result;
	}
	function getSiblingCells(x, y) {
	    var possibleCells = [
	        { x: x - 1, y: y },
	        { x: x, y: y - 1 },
	        { x: x, y: y + 1 },
	        { x: x + 1, y: y }
	    ];
	    return filterPossibleCells(possibleCells);
	}
	function filterPossibleCells(possibleCells) {
	    var result = [];
	    for (var i = 0; i < possibleCells.length; i++) {
	        var x = possibleCells[i].x;
	        var y = possibleCells[i].y;
	        if (list[x] && list[x][y]) {
	            result.push(possibleCells[i]);
	        }
	    }
	    return result;
	}
	function IIgetNextCell(allowedCells) {
	    setTempProcent({ koefSum: countKoefSum() });
	    return getRandom();
	    // -----------
	    function countKoefSum() {
	        var result = 0;
	        for (var i = 0; i < allowedCells.length; i++) {
	            var x = allowedCells[i].x;
	            var y = allowedCells[i].y;
	            result += list[x][y].IIkoef;
	        }
	        return result;
	    }
	    function setTempProcent(options) {
	        var koefSum = options.koefSum;
	        var etalon = 100 / koefSum;
	        for (var i = 0; i < allowedCells.length; i++) {
	            var x = allowedCells[i].x;
	            var y = allowedCells[i].y;
	            list[x][y].procent = list[x][y].IIkoef * etalon;
	        }
	    }
	    function getRandom() {
	        var randomNumber = Math.floor(Math.random() * 100);
	        var procentSum = 0;
	        for (var i = 0; i < allowedCells.length; i++) {
	            var x = allowedCells[i].x;
	            var y = allowedCells[i].y;
	            if (randomNumber >= procentSum && randomNumber < procentSum + list[x][y].procent) {
	                return list[x][y];
	            }
	            else {
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
	    var resultArr = [];
	    for (var i = 0; i < arr.length; i++) {
	        for (var j = 0; j < arr.length; j++) {
	            resultArr.push(arr[i][j].IIkoef);
	        }
	    }
	    IIMaxKoef = resultArr.sort(function (a, b) {
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
	    var list = document.querySelector(".list");
	    var row = list.querySelectorAll(".row");
	    var item = row[startX].querySelectorAll(".cell")[startY];
	    item.style.backgroundColor = "green";
	}
	function drawWalls() {
	}
	function drawMap(arr) {
	    var result = document.createElement("ul");
	    result.className = "list";
	    for (var i = 0; i < arr.length; i++) {
	        var row = document.createElement("li");
	        row.className = "row";
	        var coll = document.createElement("ul");
	        coll.className = "coll";
	        for (var j = 0; j < arr[i].length; j++) {
	            var cell = document.createElement("li");
	            cell.className = "cell";
	            cell.innerText = "" + Math.floor(calcProcent(arr[i][j].IIkoef) * 100);
	            cell.style.backgroundColor = "rgba(0, 0, 256, " + calcProcent(arr[i][j].IIkoef) + ")";
	            coll.appendChild(cell);
	        }
	        row.appendChild(coll);
	        result.appendChild(row);
	    }
	    outputDomElement.appendChild(result);
	}
	function calcProcent(number) {
	    return number / IIMaxKoef;
	}
	function drawResults(map, res) {
	    for (var i = 0; i < res.length; i++) {
	        drawMap(map);
	        drawResult(res[i]);
	    }
	}
	function drawResult(arr) {
	    var lists = document.querySelectorAll(".list");
	    var list = lists[lists.length - 1];
	    var row = list.querySelectorAll(".row");
	    for (var i = 0; i < arr.length; i++) {
	        var item = row[arr[i][0]].querySelectorAll(".cell")[arr[i][1]];
	        item.style.backgroundColor = "red";
	        item.style.opacity = "" + i * 0.01;
	    }
	}
	function save(arr) {
	    localStorage.setItem("list", JSON.stringify(arr));
	}
	function showBest() {
	    results.sort(function (a, b) { return a.length < b.length ? 1 : -1; });
	    drawResult(results[0]);
	}


/***/ }
/******/ ]);