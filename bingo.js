const arrayB = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const arrayI = [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
const arrayN = [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45];
const arrayG = [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];
const arrayO = [61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75];
let gameTimer;
let gameStart = false;
let bingo = false;
// const buttonNext = document.querySelector('.next_number');
const buttonGame = document.querySelector('#game-button');
const buttonBingo = document.querySelector('#bingo');
// const buttonCreate = document.querySelector('.create_bingo');
const s1 = document.querySelector('#s-1');
const s2 = document.querySelector('#s-2');
const s3 = document.querySelector('#s-3');
const s4 = document.querySelector('#s-4');
const s5 = document.querySelector('#s-5');
const s1L = document.querySelector('#s-1-l');
const s2L = document.querySelector('#s-2-l');
const s3L = document.querySelector('#s-3-l');
const s4L = document.querySelector('#s-4-l');
const s5L = document.querySelector('#s-5-l');
const bingoResult = document.querySelector('#bingo-result');

const bingoFields = document.querySelectorAll('.bingo-field');

const numberSound = new Audio('numberSound.mp3');
const bingoSound = new Audio('bingoSound.mp3');
const stampSound = new Audio('stampSound.mp3');

let bingos = [];

let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75];
const selectedNumbers = [];

const bingoArray = [
  [],
  [],
  [],
  [],
  []
];

const bingoSelectedArray = [
  [],
  [],
  [],
  [],
  []
];

const getColor = (number) => {
  if (!isNaN(number)) {
    if (number < 16) {
      return 'red';
    } else if (number < 31) {
      return 'green';
    } else if (number < 45) {
      return 'yellow';
    } else if (number < 61) {
      return 'blue';
    } else if (number < 76) {
      return 'purple';
    }
    return 'transparent';
  }
  return 'transparent';
}

const getLetterToNumber = (number) => {
  let letter = '';
  if (number < 16) {
    letter = 'B';
  } else if (number < 31) {
    letter = 'I';
  } else if (number < 46) {
    letter = 'N';
  } else if (number < 61) {
    letter = 'G';
  } else if (number < 76) {
    letter = 'O';
  }
  return letter;
}

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}

const controlGame = () => {
  if (!gameStart) {
    if (!bingo) {
      nextNumber();
      gameStart = true;
      buttonGame.innerHTML = 'Pause Game';
      gameTimer = setInterval(() => {
        nextNumber();
      }, 2500);
    }
  } else {
    gameStart = false;
    clearInterval(gameTimer);
    if (!bingo) {
      buttonGame.innerHTML = 'Start Game';
    } else {
      buttonGame.innerHTML = 'Game Ended';
    }
  }
}

const checkDiagonal = () => {
  const tempArrayFromLeft = [bingoArray[0][0], bingoArray[1][1], bingoArray[2][2], bingoArray[3][3], bingoArray[4][4]];
  const tempArrayFromRight = [bingoArray[0][4], bingoArray[1][3], bingoArray[2][2], bingoArray[3][1], bingoArray[4][0]];
  if (tempArrayFromLeft.every(number => number.lottery)) {
    bingos.push({ direction: 'diagonal', from: 'left', inSelection: false });
  }
  if (tempArrayFromRight.every(number => number.lottery)) {
    bingos.push({ direction: 'diagonal', from: 'right', inSelection: false });
  }
}

const checkBingoGrid = () => {
  for (let i = 0; i < bingos.length; i++) {
    if (bingos[i].direction === 'horizontal') {
      if (bingoSelectedArray[bingos[i].row].every(number => number.lottery)) {
        bingos[i].inSelection = true;
      }
    } else if (bingos[i].direction === 'vertical') {
      const tempbingoArray = [];
      const column = bingos[i].column;
      for (let c = 0; c < 5; c++) {
        tempbingoArray.push(bingoSelectedArray[c][column]);
      }
      if (tempbingoArray.every(number => number.lottery)) {
        bingos[i].inSelection = true;
      }
    } else if (bingos[i].direction === 'diagonal') {
      if (bingos[i].from === 'left') {
        const tempbingoArray = [bingoSelectedArray[0][0], bingoSelectedArray[1][1], bingoSelectedArray[2][2], bingoSelectedArray[3][3], bingoSelectedArray[4][4]];
        if (tempbingoArray.every(number => number.lottery)) {
          bingos[i].inSelection = true;
        }
      } else if (bingos[i].from === 'right') {
        const tempbingoArray = [bingoSelectedArray[0][4], bingoSelectedArray[1][3], bingoSelectedArray[2][2], bingoSelectedArray[3][1], bingoSelectedArray[4][0]];
        if (tempbingoArray.every(number => number.lottery)) {
          bingos[i].inSelection = true;
        }
      }
    }
  }
}

const checkColumnBingo = () => {
  for (let r = 0; r < 5; r++) {
    let tempbingoArray = [];
    for (let c = 0; c < 5; c++) {
      tempbingoArray.push(bingoArray[c][r]);
    }
    if (tempbingoArray.every(number => number.lottery)) {
      bingos.push({ direction: 'vertical', column: r, inSelection: false });
    }
  }
}

const checkRowBingo = () => {
  bingoArray.forEach((row, i) => {
    if (row.every(number => number.lottery)) {
      bingos.push({ direction: 'horizontal', row: i, inSelection: false });
    }
  });
}

const checkBingo = () => {
  if (!bingo) {
    bingos = [];
    checkRowBingo();
    checkColumnBingo();
    checkDiagonal();
    checkBingoGrid();
    if (bingos.some(bingo => bingo.inSelection)) {
      bingo = true;
      bingoResult.innerHTML = `${75 - numbers.length} kihúzott szám után lett BINGO-d`;
      bingoSound.play();
      controlGame();
    }
  }
}

bingoFields.forEach(field => {
  field.addEventListener('click', (e) => {
    if(gameStart) {
      stampSound.play();
      if (field.classList.contains('selected')) {
        field.classList.remove('selected');
        bingoSelectedArray.forEach(row => {
          row.forEach(n => {
            if (n.number === parseInt(field.innerHTML)) {
              n.lottery = false;
            }
          });
        });
      } else {
        field.classList.add('selected');
        bingoSelectedArray.forEach(row => {
          row.forEach(n => {
            if (n.number === parseInt(field.innerHTML)) {
              n.lottery = true;
            }
          });
        });
      }
    }
  });
});

const nextNumber = () => {
  if (numbers.length > 0) {
    const selectIindex = Math.floor(Math.random() * (numbers.length - 1));
    const selectNumber = numbers[selectIindex];
    bingoArray.forEach(row => {
      row.forEach(n => {
        if (n.number === selectNumber) {
          n.lottery = true;
        }
      });
    });
    numbers.splice(selectIindex, 1);
    selectedNumbers.push(selectNumber);
    refreshSelectedNumbers(selectNumber);
    numberSound.play();
  }
}

const randomBingoSlot = () => {
  for (let i = 0; i < 5; i++) {
    const randomB = getRandomNumber(0, arrayB.length - 1);
    const randomI = getRandomNumber(0, arrayI.length - 1);
    const randomN = getRandomNumber(0, arrayN.length - 1);
    const randomG = getRandomNumber(0, arrayG.length - 1);
    const randomO = getRandomNumber(0, arrayO.length - 1);
    const divB = document.querySelector(`#b-${i + 1}`);
    const divI = document.querySelector(`#i-${i + 1}`);
    const divN = document.querySelector(`#n-${i + 1}`);
    const divG = document.querySelector(`#g-${i + 1}`);
    const divO = document.querySelector(`#o-${i + 1}`);
    divB.textContent = arrayB[randomB];
    divI.textContent = arrayI[randomI];
    divN.textContent = arrayN[randomN];
    divG.textContent = arrayG[randomG];
    divO.textContent = arrayO[randomO];
    bingoArray[i] = [
      { number: arrayB[randomB], lottery: false },
      { number: arrayI[randomI], lottery: false },
      { number: arrayN[randomN], lottery: false },
      { number: arrayG[randomG], lottery: false },
      { number: arrayO[randomO], lottery: false },
    ];
    bingoSelectedArray[i] = [
      { number: arrayB[randomB], lottery: false },
      { number: arrayI[randomI], lottery: false },
      { number: arrayN[randomN], lottery: false },
      { number: arrayG[randomG], lottery: false },
      { number: arrayO[randomO], lottery: false },
    ];
    arrayB.splice(randomB, 1);
    arrayI.splice(randomI, 1);
    arrayN.splice(randomN, 1);
    arrayG.splice(randomG, 1);
    arrayO.splice(randomO, 1);
  }
}

const refreshSelectedNumbers = (selectNumber) => {
  const actS1 = parseInt(s1.innerHTML);
  const actS2 = parseInt(s2.innerHTML);
  const actS3 = parseInt(s3.innerHTML);
  const actS4 = parseInt(s4.innerHTML);
  const actS1L = s1L.innerHTML;
  const actS2L = s2L.innerHTML;
  const actS3L = s3L.innerHTML;
  const actS4L = s4L.innerHTML;

  s2L.innerHTML = actS1L ? actS1L : '';
  s3L.innerHTML = actS2L ? actS2L : '';
  s4L.innerHTML = actS3L ? actS3L : '';
  s5L.innerHTML = actS4L ? actS4L : '';
  s1L.innerHTML = getLetterToNumber(selectNumber);
  
  s2.innerHTML = actS1 ? actS1 : '';
  s3.innerHTML = actS2 ? actS2 : '';
  s4.innerHTML = actS3 ? actS3 : '';
  s5.innerHTML = actS4 ? actS4 : '';
  s1.innerHTML = selectNumber;

  s1.parentElement.classList.remove('red', 'yellow', 'blue', 'green', 'purple', 'transparent');
  s2.parentElement.classList.remove('red', 'yellow', 'blue', 'green', 'purple', 'transparent');
  s3.parentElement.classList.remove('red', 'yellow', 'blue', 'green', 'purple', 'transparent');
  s4.parentElement.classList.remove('red', 'yellow', 'blue', 'green', 'purple', 'transparent');
  s5.parentElement.classList.remove('red', 'yellow', 'blue', 'green', 'purple', 'transparent');

  s1.parentElement.classList.add(getColor(selectNumber), 'move-top');
  s2.parentElement.classList.add(getColor(actS1), 'move');
  s3.parentElement.classList.add(getColor(actS2), 'move');
  s4.parentElement.classList.add(getColor(actS3), 'move');
  s5.parentElement.classList.add(getColor(actS4), 'move');

    setTimeout(() => {
    s1.parentElement.classList.remove('move-top');
    s2.parentElement.classList.remove('move');
    s3.parentElement.classList.remove('move');
    s4.parentElement.classList.remove('move');
    s5.parentElement.classList.remove('move');
  }, 1500);
}

// buttonNext.addEventListener('click', nextNumber);
// buttonCreate.addEventListener('click', randomBingoSlot);
buttonGame.addEventListener('click', controlGame);
buttonBingo.addEventListener('click', checkBingo);

randomBingoSlot();