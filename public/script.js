let buttons = document.querySelectorAll('button');
function changeclicking() {
    if (youcan !== true) {
        buttons.forEach(button => { button.style.pointerEvents = 'none' });
    } else {
        buttons.forEach(button => { button.style.pointerEvents = 'auto' });
    }
}
for (let i = 0; i < 26; i++) {
    document.getElementById('cube').innerHTML += `<div class="piece">
            <div class="element left"></div>
            <div class="element right"></div>
            <div class="element top"></div>
            <div class="element bottom"></div>
            <div class="element back"></div>
            <div class="element front"></div>
        </div>`;
}

var colors = ['green', 'blue', 'white', 'yellow', 'orange', 'red'],
    directions = ['left', 'right', 'top', 'bottom', 'back', 'front'],
    pieces = document.getElementsByClassName('piece'),
    arrows = document.querySelector('.arrows'),
    combined = document.getElementById('combined'),
    scene = document.querySelector('.scene'),
    rotateface = true, backing = false, solveit = false, youcan = true,
    facerotated = [], direction = [],
    state = Array(6).fill().map(() => Array(3).fill().map(() => Array(3))),
    rotateX = -35, rotateY = 45, count = 0, pi = 0, topcolor = 'white', leftcolor = 'green', frontcolor = 'red', downcolor = 'yellow', rightcolor = 'blue', backcolor = 'orange';

const idMap = [[
    [21, 5, 37],
    [17, 1, 33],
    [25, 9, 41]
], [
    [38, 6, 22],
    [34, 2, 18],
    [42, 10, 26]
], [
    [21, 20, 22],
    [5, 4, 6],
    [37, 36, 38]
], [
    [41, 40, 42],
    [9, 8, 10],
    [25, 24, 26]
], [
    [22, 20, 21],
    [18, 16, 17],
    [26, 24, 25]
], [
    [37, 36, 38],
    [33, 32, 34],
    [41, 40, 42]
]], cube = [[
    [21, 20, 22],
    [5, 4, 6],
    [37, 36, 38]
], [
    [17, 16, 18],
    [1, null, 2],
    [33, 32, 34]
], [
    [25, 24, 26],
    [9, 8, 10],
    [41, 40, 42]
]], centers = [0, 1, 2, 4, 8, 16], edges = [20, 5, 6, 36, 17, 18, 33, 34, 24, 9, 10, 40], whiteedges = [20, 6, 36, 5], whitecorners = [37, 38, 22, 21], corners = [21, 22, 37, 38, 25, 26, 41, 42], midedges = [33, 34, 18, 17], middirections = ["front", "right", "back", "left"], yellowedges = [9, 40, 10, 24], yellowcorners = [25, 41, 42, 26],
    perspective = ['green', 'red', 'blue', 'orange'],pivot = document.getElementById("pivot");;

function mx(i, j) {
    return ([2, 4, 3, 5][j % 4 | 0] + i % 2 * ((j | 0) % 4 * 2 + 3) + 2 * (i / 2 | 0)) % 6;
}

function getAxis(face) {
    return String.fromCharCode('X'.charCodeAt(0) + face / 2);
}

function assembleCube() {
    function moveto(face, cnt) {
        id = id + (1 << face);
        pieces[i].children[face].appendChild(document.createElement('div'))
            .setAttribute('class', 'sticker ' + colors[face]);
        return 'translate' + getAxis(face) + '(' + (face % 2 * 4 - 2) + 'em)';
    }
    for (var id, x, i = 0; id = 0, i < 26; i++) {
        x = mx(i, i % 18);
        pieces[i].style.transform = 'rotateX(0deg)' + moveto(i % 6) +
            (i > 5 ? moveto(x, id) + (i > 17 ? moveto(mx(x, x + 2)) : '') : '');
        pieces[i].setAttribute('id', 'piece' + id);
    }
    printCubeState();
}

function getPieceBy(face, index, corner) {
    return document.getElementById('piece' +
        ((1 << face) + (1 << mx(face, index)) + (1 << mx(face, index + 1)) * corner));
}

function swapPieces(face, times) {
    for (var i = 0; i < 6 * times; i++) {
        var piece1 = getPieceBy(face, i / 2, i % 2),
            piece2 = getPieceBy(face, i / 2 + 1, i % 2);
        for (var j = 0; j < 5; j++) {
            var sticker1 = piece1.children[j < 4 ? mx(face, j) : face].firstChild,
                sticker2 = piece2.children[j < 4 ? mx(face, j + 1) : face].firstChild,
                className = sticker1 ? sticker1.className : '';
            if (className)
                sticker1.className = sticker2.className,
                    sticker2.className = className;
        }
    }
}

function isCubeSolved() {
    const faceColors = {
        top: 'white',
        bottom: 'yellow',
        left: 'green',
        right: 'blue',
        front: 'red',
        back: 'orange'
    };

    for (let face in faceColors) {
        let stickers = document.querySelectorAll(`.element.${face} .sticker`);

        for (let sticker of stickers) {
            if (!sticker.classList.contains(faceColors[face])) {
                return false;
            }
        }
    }
    youcan=true;
    changeclicking();
    facerotated.length=0;
    direction.length=0;
    scrambledstring="";
    return true;
}

let scrambledstring = "";

function animateRotation(face, cw, currentTime) {

    scrambledstring += getchar(colors[face]);
    if (!cw) {
        scrambledstring += "'";
    }
    scrambledstring += " ";
    console.log(scrambledstring);
    if (rotateface) {
        if (scene.classList.contains('levitate')) {
            scene.classList.remove('levitate');
        }
        if (!backing) {
            facerotated.push(face);
            direction.push(cw);
        }
        rotateface = false;
        var k = .3 * (face % 2 * 2 - 1) * (2 * cw - 1),
            qubes = Array(9).fill(pieces[face]).map(function (value, index) {
                return index ? getPieceBy(face, index / 2, index % 2) : value;
            });
        (function rotatePieces() {
            var passed = Date.now() - currentTime,
                style = 'rotate' + getAxis(face) + '(' + k * passed * (passed < 300) + 'deg)';
            qubes.forEach(function (piece) {
                piece.style.transform = piece.style.transform.replace(/rotate.\(\S+\)/, style);
            });
            if (passed >= 300)
                return swapPieces(face, 3 - 2 * cw);
            requestAnimationFrame(rotatePieces);
        })();
        setTimeout(function () {
            rotateface = true;
            if (isCubeSolved()) {
                if (!scene.classList.contains('levitate')) {
                    scene.classList.add('levitate');
                }
            }
            printCubeState();
        }, 400);
    }
}

window.addEventListener('load', assembleCube);

function rotateCube(arrow) {
    switch (arrow) {
        case 'ArrowUp':
            rotateX += 180;
            pi = (pi + 2) % 4;
            topcolor = (topcolor === 'white') ? 'yellow' : 'white';
            break;
        case 'ArrowDown':
            rotateX -= 180;
            pi = (pi + 2) % 4;
            topcolor = (topcolor === 'white') ? 'yellow' : 'white';
            break;
        case 'ArrowLeft':
            rotateY += (topcolor === 'white') ? -90 : 90;
            if (topcolor === 'white') {
                pi = (pi + 1) % 4;
            } else {
                pi = (pi + 3) % 4;
            }
            break;
        case 'ArrowRight':
            rotateY += (topcolor === 'white') ? 90 : -90;
            if (topcolor === 'white') {
                pi = (pi + 3) % 4;
            } else {
                pi = (pi + 1) % 4;
            }
            break;
    }

    if (topcolor === 'white') {
        leftcolor = perspective[pi];
        frontcolor = perspective[(pi + 1) % 4];
        //console.log(whitecorners[pi]);
    } else {
        frontcolor = perspective[pi];
        leftcolor = perspective[(pi + 1) % 4];
    }

    downcolor = oppositecolor(topcolor);
    rightcolor = oppositecolor(leftcolor);
    backcolor = oppositecolor(frontcolor);

    pivot.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function rollback() {
    if (rotateface && facerotated.length > 0) {
        backing = true;
        animateRotation(facerotated.pop(), !direction.pop(), Date.now());
        backing = false;
        if (facerotated.length === 0) {
            solveit = false;
            youcan = true;
            changeclicking();
        }
    }
    if (solveit) {
        setTimeout(rollback, 400);
    }
}

function findcolor(id, j) {
    let child1 = document.querySelector(`#piece${id}`);
    for (let i = 0; i < child1.children.length; i++) {
        if (child1.children[i].childElementCount === 1) {
            if (child1.children[i].classList[1] === directions[j]) {
                //child1.children[i].children[0].innerHTML=id;
                return child1.children[i].children[0].classList[1];
            }
        }
    }
}

let present = null;

function findpresent() {
    let colororder = ['w', 'o', 'g', 'r', 'b', 'y'];
    for (let i = 0; i < 6; i++) {
        let temp = document.querySelector(`.${colororder[i]}lyr`);
        let j = 2;
        let k = 0;
        for (let elcnt = 0; elcnt < 9; elcnt++) {
            if (i === 0) {
                numstring += getnum(temp.children[j + k].classList[0]);
            } else if (i === 5) {
                numstring += getnum(temp.children[8 - (j + k)].classList[0]);
            } else {
                numstring += getnum(temp.children[elcnt].classList[0]);
            }
            k = k + 3;
            if (k === 9) {
                k = 0;
                j--;
            }
        }
    }
    //console.log(numstring);
}

let numstring = "";

function printCubeState() {
    present = '';
    numstring = '';
    for (let i = 0; i < 6; i++) {
        let temp = document.querySelector(`.${colors[i][0]}lyr`);
        let elcnt = 0;
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                state[i][j][k] = findcolor(idMap[i][j][k], i);
                temp.children[elcnt].classList.remove(temp.children[elcnt].classList[0]);
                temp.children[elcnt].classList.add(state[i][j][k]);
                elcnt++;
            }
        }
    }
    findpresent();
}

function mix() {
    youcan = false;
    changeclicking();
    if (count < 10) {
        count++;
        animateRotation(Math.floor(Math.random() * 6), true, Date.now());
        setTimeout(mix, 400);
    } else {
        count = 0;
        youcan = true;
        changeclicking();
    }
}

function oppositecolor(color) {
    let i = colors.indexOf(color);
    if (i % 2 === 0) {
        return colors[i + 1];
    } else {
        return colors[i - 1];
    }
}

function charget(i){
    switch (i) {
        case 'B': return 'r';
        case 'F': return 'l';
        case 'U': return 'u';
        case 'D': return 'd';
        case 'R': return 'f';
        case 'L': return 'b';
    }
}

function debug(solution){
    scrambledstring='';
    let ans = '';
    for (let i = 0; i < solution.length; i++) {
        if(solution[i]===" "||solution[i]==="'"){
            ans += solution[i];
        } else if(solution[i]==="2"){
            ans += " "+charget(solution[i-1]);
        } else {
            ans += charget(solution[i]);
        }
    }
    //console.log(ans);
    processChar(0,ans,"solution");
    
}

function getchar(i) {
    switch (i) {
        case 'blue': return 'B';
        case 'green': return 'F';
        case 'white': return 'U';
        case 'yellow': return 'D';
        case 'red': return 'R';
        case 'orange': return 'L';
    }
}

function getnum(i) {
    switch (i) {
        case 'blue': return '5';
        case 'green': return '3';
        case 'white': return '1';
        case 'yellow': return '6';
        case 'red': return '4';
        case 'orange': return '2';
    }
}

function getcolor(i) {
    switch (i) {
        case 'r': return rightcolor;
        case 'l': return leftcolor;
        case 'u': return topcolor;
        case 'd': return downcolor;
        case 'f': return frontcolor;
        case 'b': return backcolor;
    }
}

function solvecross() {
    let num = 0, num1 = 0, num2 = 0, num3 = 0, num4 = 0;
    let child1 = document.querySelector(`#piece${yellowedges[pi]}`);
    for (let i = 0; i < child1.children.length; i++) {
        if (child1.children[i].children.length === 1 && child1.children[i].classList[1] === "bottom" && child1.children[i].children[0].classList[1] === topcolor) {
            num++;
            num1++;
        }
    }
    let child2 = document.querySelector(`#piece${yellowedges[(pi + 1) % 4]}`);
    for (let i = 0; i < child2.children.length; i++) {
        if (child2.children[i].children.length === 1 && child2.children[i].classList[1] === "bottom" && child2.children[i].children[0].classList[1] === topcolor) {
            num++;
            num2++;
        }
    }
    let child3 = document.querySelector(`#piece${yellowedges[(pi + 2) % 4]}`);
    for (let i = 0; i < child3.children.length; i++) {
        if (child3.children[i].children.length === 1 && child3.children[i].classList[1] === "bottom" && child3.children[i].children[0].classList[1] === topcolor) {
            num++;
            num3++;
        }
    }
    let child4 = document.querySelector(`#piece${yellowedges[(pi + 3) % 4]}`);
    for (let i = 0; i < child4.children.length; i++) {
        if (child4.children[i].children.length === 1 && child4.children[i].classList[1] === "bottom" && child4.children[i].children[0].classList[1] === topcolor) {
            num++;
            num4++;
        }
    }
    if (num === 4) {
        executeformula("r u r' u r u u r'", "edges");
    } else if (num === 2 || num === 0) {
        if ((num1 === 1 && num2 === 1) || (num3 === 1 && num4 === 1) || (num1 === 1 && num3 === 1)) {
            rotateCube('ArrowLeft');
        }
        processChar(0, "f r u r' u' f'", "plus");
    }
}

function edgessolved() {
    let num = 0;
    let child1 = document.querySelector(`#piece${yellowedges[pi]}`);
    for (let i = 0; i < child1.children.length; i++) {
        if (child1.children[i].children.length === 1 && child1.children[i].children[0].classList[1] !== "yellow") {
            if (child1.children[i].children[0].classList[1] === frontcolor) {
                num++;
            }
        }
    }
    let child2 = document.querySelector(`#piece${yellowedges[(pi + 1) % 4]}`);
    for (let i = 0; i < child1.children.length; i++) {
        if (child2.children[i].children.length === 1 && child2.children[i].children[0].classList[1] !== "yellow") {
            if (child2.children[i].children[0].classList[1] === leftcolor) {
                num++;
            }
        }
    }
    let child3 = document.querySelector(`#piece${yellowedges[(pi + 2) % 4]}`);
    for (let i = 0; i < child1.children.length; i++) {
        if (child3.children[i].children.length === 1 && child3.children[i].children[0].classList[1] !== "yellow") {
            if (child3.children[i].children[0].classList[1] === backcolor) {
                num++;
            }
        }
    }
    if (num === 3) {
        executeformula("u r u' l' u r' u' l", "corners");
    } else if (num === 2 || num === 0) {
        animateRotation(3, true, Date.now());
        setTimeout(() => edgessolved(), 400);
    } else if (num === 1) {
        processChar(0, "r u r' u r u u r'", "edges");
    }
}

function inposition(id) {
    let child1 = document.querySelector(`#piece${id}`);
    for (let i = 0; i < child1.children.length; i++) {
        if (child1.children[i].children.length === 1) {
            if (!(child1.children[i].children[0].classList[1] === topcolor || child1.children[i].children[0].classList[1] === frontcolor || child1.children[i].children[0].classList[1] === rightcolor)) {
                return false;
            }
        }
    }
    return true;
}

function midsolved() {
    for (let k = 0; k < 4; k++) {
        let parent = document.getElementById(`piece${midedges[(pi + k) % 4]}`);
        for (let i = 0; i < parent.children.length; i++) {
            if (parent.children[i].children.length === 1) {
                if (parent.children[i].classList[1] === middirections[(pi + k) % 4]) {
                    if (parent.children[i].children[0].classList[1] !== colors[directions.indexOf(middirections[(pi + k) % 4])]) {
                        return false;
                    }
                } else {
                    if (parent.children[i].children[0].classList[1] !== colors[directions.indexOf(middirections[(pi + k + 3) % 4])]) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}

function secondlayer() {
    let child1 = document.querySelector(`#piece${midedges[pi]}`);
    let child2 = document.querySelector(`#piece${yellowedges[(pi + 1) % 4]}`);
    let child3 = document.querySelector(`#piece${yellowedges[pi]}`);
    let child4 = document.querySelector(`#piece${yellowedges[(pi + 3) % 4]}`);
    let child5 = document.querySelector(`#piece${yellowedges[(pi + 2) % 4]}`);
    let pieceleft = null, pieceright = null, leftpiecetop = null, leftpiecebottom = null, frontpiecetop = null, frontpiecebottom = null, rightpiecetop = null, rightpiecebottom = null, backpiecetop = null, backpiecebottom = null;
    for (let i = 0; i < child1.children.length; i++) {
        if (child1.children[i].children.length === 1) {
            if (child1.children[i].classList[1] === middirections[pi]) {
                pieceleft = child1.children[i].children[0].classList[1];
            } else {
                pieceright = child1.children[i].children[0].classList[1];
            }
        }
    }
    for (let i = 0; i < child2.children.length; i++) {
        if (child2.children[i].children.length === 1) {
            if (child2.children[i].classList[1] === "bottom") {
                leftpiecetop = child2.children[i].children[0].classList[1];
            } else {
                leftpiecebottom = child2.children[i].children[0].classList[1];
            }
        }
    }
    for (let i = 0; i < child3.children.length; i++) {
        if (child3.children[i].children.length === 1) {
            if (child3.children[i].classList[1] === "bottom") {
                frontpiecetop = child3.children[i].children[0].classList[1];
            } else {
                frontpiecebottom = child3.children[i].children[0].classList[1];
            }
        }
    }
    for (let i = 0; i < child4.children.length; i++) {
        if (child4.children[i].children.length === 1) {
            if (child4.children[i].classList[1] === "bottom") {
                rightpiecetop = child4.children[i].children[0].classList[1];
            } else {
                rightpiecebottom = child4.children[i].children[0].classList[1];
            }
        }
    }
    for (let i = 0; i < child5.children.length; i++) {
        if (child5.children[i].children.length === 1) {
            if (child5.children[i].classList[1] === "bottom") {
                backpiecetop = child5.children[i].children[0].classList[1];
            } else {
                backpiecebottom = child5.children[i].children[0].classList[1];
            }
        }
    }
    if (pieceleft === leftcolor && pieceright === frontcolor) {
        if (midsolved()) {
            executeformula("f r u r' u' f'", "plus");
        } else {
            rotateCube('ArrowLeft');
            secondlayer();
        }
    } else if (pieceleft === frontcolor && pieceright === leftcolor) {
        animateRotation(3, true, Date.now());
        executeformula("u f u' f' u' l' u l", "midleft");
        setTimeout(() => {
            animateRotation(3, true, Date.now());
            setTimeout(() => {
                animateRotation(3, true, Date.now());
                setTimeout(() => {
                    executeformula("u f u' f' u' l' u l", "midleft");
                }, 400);
            }, 400);
        }, 6400);
    } else if (pieceleft === topcolor || pieceright === topcolor) {
        if (leftpiecetop === frontcolor && leftpiecebottom === leftcolor) {
            executeformula("u f u' f' u' l' u l", "midleft");
        } else if (leftpiecetop === leftcolor && leftpiecebottom === frontcolor) {
            animateRotation(3, false, Date.now());
            setTimeout(() => {
                executeformula("u' l' u l u f u' f'", "midright");
            }, 400);
        } else if (frontpiecetop === leftcolor && frontpiecebottom === frontcolor) {
            executeformula("u' l' u l u f u' f'", "midright");
        } else if (frontpiecetop === frontcolor && frontpiecebottom === leftcolor) {
            animateRotation(3, true, Date.now());
            setTimeout(() => {
                executeformula("u f u' f' u' l' u l", "midleft");
            }, 400);
        } else if (rightpiecetop === leftcolor && rightpiecebottom === frontcolor) {
            animateRotation(3, true, Date.now());
            setTimeout(() => {
                executeformula("u' l' u l u f u' f'", "midright");
            }, 400);
        } else if (rightpiecetop === frontcolor && rightpiecebottom === leftcolor) {
            animateRotation(3, true, Date.now());
            setTimeout(() => {
                animateRotation(3, true, Date.now());
                setTimeout(() => {
                    executeformula("u f u' f' u' l' u l", "midleft");
                }, 400);
            }, 400);
        } else if (backpiecetop === frontcolor && backpiecebottom === leftcolor) {
            animateRotation(3, false, Date.now());
            setTimeout(() => {
                executeformula("u f u' f' u' l' u l", "midleft");
            }, 400);
        } else if (backpiecetop === leftcolor && backpiecebottom === frontcolor) {
            animateRotation(3, true, Date.now());
            setTimeout(() => {
                animateRotation(3, true, Date.now());
                setTimeout(() => {
                    executeformula("u' l' u l u f u' f'", "midright");
                }, 400);
            }, 400);
        } else {
            rotateCube('ArrowLeft');
            secondlayer();
        }
    } else {
        if (leftpiecetop === topcolor || leftpiecebottom === topcolor) {
            executeformula("u f u' f' u' l' u l", "midleft");
        } else if (frontpiecetop === topcolor || frontpiecebottom === topcolor) {
            executeformula("u' l' u l u f u' f'", "midright");
        } else if (rightpiecetop === topcolor || rightpiecebottom === topcolor) {
            animateRotation(3, true, Date.now());
            setTimeout(() => {
                executeformula("u' l' u l u f u' f'", "midright");
            }, 400);
        } else if (backpiecetop === topcolor || backpiecebottom === topcolor) {
            animateRotation(3, false, Date.now());
            setTimeout(() => {
                executeformula("u f u' f' u' l' u l", "midleft");
            }, 400);
        } else {
            rotateCube('ArrowLeft');
            secondlayer();
        }
    }
}
function processChar(index, formula, purpose) {
    if (index >= formula.length) {
        youcan = true;
        changeclicking();
        if (purpose === "final") {
            if (!frcSolved(yellowcorners[pi])) {
                processChar(0, formula, purpose);
            } else {
                if (!(frcSolved(yellowcorners[0]) && frcSolved(yellowcorners[1]) && frcSolved(yellowcorners[2]) && frcSolved(yellowcorners[3]))) {
                    animateRotation(3, true, Date.now());
                    setTimeout(() => executeformula("r' d r d' r' d r d'", "final"), 400);
                } else {
                    lastrotate();
                }
            }
        } else if (purpose === "corners") {
            console.log('solving corners pc');
            if (inposition(yellowcorners[pi])) {
                rotateCube('ArrowLeft');
                if (!inposition(yellowcorners[pi])) {
                    rotateCube('ArrowRight');
                    processChar(0, formula, purpose);
                } else {
                    executeformula("r' d r d' r' d r d'", "final");
                }
            } else {
                rotateCube('ArrowLeft');
                setTimeout(() => {
                    if (!inposition(yellowcorners[pi])) {
                        rotateCube('ArrowLeft');
                        setTimeout(() => {
                            if (!inposition(yellowcorners[pi])) {
                                rotateCube('ArrowLeft');
                                setTimeout(() => {
                                    processChar(0, formula, purpose);
                                }, 500)
                            } else {
                                processChar(0, formula, purpose);
                            }
                        }, 500);
                    } else {
                        processChar(0, formula, purpose);
                    }
                }, 500);
            }
        } else if (purpose === "edges") {
            console.log('solving edges pc');
            edgessolved();
        } else if (purpose === "plus") {
            console.log('solving plus pc');
            solvecross();
        } else if (purpose==="midleft"||purpose==="midright"){
            console.log('solving second layer pc');
            secondlayer();
        }
        return;
    }
    if (formula[index] !== " ") {
        if (formula[index + 1] === "'") {
            animateRotation(colors.indexOf(getcolor(formula[index])), false, Date.now());
            index++;
        } else {
            animateRotation(colors.indexOf(getcolor(formula[index])), true, Date.now());
        }
    }
    setTimeout(() => processChar(index + 1, formula, purpose), 400);
}

function frcSolved(id) {
    let child1 = document.querySelector(`#piece${id}`);
    for (let i = 0; i < child1.children.length; i++) {
        if (child1.children[i].classList[1] === "bottom") {
            if (child1.children[i].children.length === 0) {
                return false;
            } else if (child1.children[i].children[0].classList[1] !== topcolor) {
                return false;
            }
        }
    }
    return true;
}

function lastrotate() {
    if (!isCubeSolved()) {
        animateRotation(3, true, Date.now());
        setTimeout(lastrotate, 400);
    }
}

function executeformula(formula, purpose) {
    youcan = false;
    changeclicking();
    if (purpose === "final") {
        if (!frcSolved(yellowcorners[pi])) {
            processChar(0, formula, purpose);
        } else {
            if (!(frcSolved(yellowcorners[0]) && frcSolved(yellowcorners[1]) && frcSolved(yellowcorners[2]) && frcSolved(yellowcorners[3]))) {
                animateRotation(3, true, Date.now());
                setTimeout(() => executeformula("r' d r d' r' d r d'", "final"), 400);
            } else {
                lastrotate();
            }
        }
    } else if (purpose === "corners") {
        console.log('solving corners ef');
        if (inposition(yellowcorners[pi])) {
            rotateCube('ArrowLeft');
            if (!inposition(yellowcorners[pi])) {
                rotateCube('ArrowRight');
                processChar(0, formula, purpose);
            } else {
                rotateCube('ArrowRight');
                executeformula("r' d r d' r' d r d'", "final");
            }
        } else {
            rotateCube('ArrowLeft');
            setTimeout(() => {
                if (!inposition(yellowcorners[pi])) {
                    rotateCube('ArrowLeft');
                    setTimeout(() => {
                        if (!inposition(yellowcorners[pi])) {
                            rotateCube('ArrowLeft');
                            setTimeout(() => {
                                processChar(0, formula, purpose);
                            }, 500)
                        } else {
                            processChar(0, formula, purpose);
                        }
                    }, 500);
                } else {
                    processChar(0, formula, purpose);
                }
            }, 500);
        }
    } else if (purpose === "edges") {
        console.log('solving edges ef');
        edgessolved();
    } else if (purpose === "plus") {
        console.log('solving plus ef');
        solvecross();
    } else if (purpose === "midleft"||purpose==="midright") {
        console.log('solving second layer ef');
        secondlayer();
    } else {
        processChar(0, formula, purpose);
    }
}

function position(){
    if(topcolor==='yellow'){
        rotateCube('ArrowUp');
    }
    while(leftcolor!=='green'){
        rotateCube('ArrowLeft');
    }
}

document.addEventListener("keydown", (event) => {
    if (youcan) {
        switch (event.key) {
            case 'ArrowUp': rotateCube(event.key); break;
            case 'ArrowDown': rotateCube(event.key); break;
            case 'ArrowLeft': rotateCube(event.key); break;
            case 'ArrowRight': rotateCube(event.key); break;
            case 'w': animateRotation(2, true, Date.now()); break;
            case 'W': animateRotation(2, false, Date.now()); break;
            case 'r': animateRotation(5, true, Date.now()); break;
            case 'R': animateRotation(5, false, Date.now()); break;
            case 'g': animateRotation(0, true, Date.now()); break;
            case 'G': animateRotation(0, false, Date.now()); break;
            case 'o': animateRotation(4, true, Date.now()); break;
            case 'O': animateRotation(4, false, Date.now()); break;
            case 'y': animateRotation(3, true, Date.now()); break;
            case 'Y': animateRotation(3, false, Date.now()); break;
            case 'b': animateRotation(1, true, Date.now()); break;
            case 'B': animateRotation(1, false, Date.now()); break;
            case 'm': mix(); break;
            case '-': rollback(); break;
            case '*': executeformula("r l u u f  u' d f f r r b b l u u f' b' u r r d f f u r r u", "superflip"); break;
            case '=': if (!scene.classList.contains('levitate')) {
                solveit = true;
                youcan = false;
                changeclicking();
                rollback();
            }
                break;
        }
    }
});

for (let i = 0; i < combined.childElementCount; i++) {
    if (combined.childNodes[i].nodeName !== "#text") {
        let j = (i - 1) / 2;
        let clockwise = combined.childNodes[i];
        let counter = combined.childNodes[i + 12];
        clockwise.addEventListener('click', () => {
            animateRotation(j, true, Date.now());
        });
        counter.addEventListener('click', () => {
            animateRotation(j, false, Date.now());
        });
    }
}

for (let i = 0; i < arrows.childElementCount * 2; i++) {
    if (arrows.childNodes[i].nodeName !== "#text" && arrows.childNodes[i].classList.length > 1) {
        arrows.childNodes[i].addEventListener('click', () => {
            rotateCube(arrows.childNodes[i].classList[1]);
        });
    }
}

document.getElementById("fullscreenBtn").addEventListener("click", function () {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M240-120v-120H120v-80h200v200h-80Zm400 0v-200h200v80H720v120h-80ZM120-640v-80h120v-120h80v200H120Zm520 0v-200h80v120h120v80H640Z"/></svg>`;
    } else {
        document.exitFullscreen();
        this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M120-120v-200h80v120h120v80H120Zm520 0v-80h120v-120h80v200H640ZM120-640v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80Z"/></svg>`;
    }
});

document.querySelector('.solve').addEventListener('click',async () => {
    if (!scene.classList.contains('levitate')) {
        position();
        console.log('fetching');
        youcan=false;
        changeclicking();
        const response = await fetch(`/solve?cubeState=${numstring}`);
        const data = await response.json();
        if (data.solution) {
            console.log('solution:',data.solution);
            debug(data.solution);
        } else {
            console.log("No solution found.");
            youcan=true;
            changeclicking();
            solveit = true;
            rollback();
        }
    }
});

document.querySelector('.reset').addEventListener('click', () => {
    location.reload();
});

document.querySelector('.scramble').addEventListener('click', () => {
    mix();
});

document.querySelector('.srev').addEventListener('click', () => {
    rollback();
});
document.querySelector('.superflip').addEventListener('click', () => {
    executeformula("r l u u f  u' d f f r r b b l u u f' b' u r r d f f u r r u", "superflip");
});

