/* eslint-disable no-useless-concat */
let gameMove = 0;
let time = 0;
let running = 0;
const timer = document.createElement('div');
const btnPause = document.createElement('button');
btnPause.className = 'btnPause';
btnPause.innerHTML = 'Pause';
timer.className = 'timer';
timer.innerHTML = 'Время ' + '00:00:00:00';
document.body.appendChild(timer);
document.body.appendChild(btnPause);

function start() {
  if (running === 0) {
    running = 1;
    increment();
  } else {
    running = 0;
  }
}
function gameRestart() {
  while (document.querySelector('body > div.field').firstChild) {
    document.querySelector('body > div.field').removeChild(document.querySelector('body > div.field').firstChild);
    cells = [];
  }
  game();
}

function resetTimer() {
  running = 0;
  timer.innerHTML = 'Время ' + '00:00:00:00';
  time = 0;
}

function increment() {
  if (running === 1) {
    setTimeout(() => {
      time++;
      let mins = Math.floor(time / 10 / 60);
      let secs = Math.floor(time / 10 % 60);
      const hours = Math.floor(time / 10 / 60 / 60);
      const tenth = time % 10;
      if (mins < 10) {
        mins = `0${mins}`;
      }
      if (secs < 10) {
        secs = `0${secs}`;
      }

      document.querySelector('body > div.timer').innerHTML = 'Время ' + `0${hours}:${mins}:${secs}:${tenth}0 ` + 'Ходы: ' + `${gameMove}`;
      increment();
    }, 100);
  }
}

document.querySelector('body > button').addEventListener('click', () => {
  displayMenuPause();
  start();
});
let cells = [];
function game() {
  start();
  const field = document.querySelector('.field');
  const cellSize = 100;
  const empty = {
    value: 0,
    top: 0,
    left: 0,
  };

  cells.push(empty);

  function move(index) {
    const cell = cells[index];
    const leftDiff = Math.abs(empty.left - cell.left);
    const topDiff = Math.abs(empty.top - cell.top);
    if (leftDiff + topDiff > 1) {
      return;
    }

    cell.element.style.left = `${empty.left * cellSize}px`;
    cell.element.style.top = `${empty.top * cellSize}px`;

    const emptyLeft = empty.left;
    const emptyTop = empty.top;
    empty.left = cell.left;
    empty.top = cell.top;
    cell.left = emptyLeft;
    cell.top = emptyTop;

    const isFinished = cells.every((cell) => cell.value === cell.top * 4 + cell.left);
    if (isFinished) {
      displayVictory();
      alert('Ура! Вы решили головоломку за ' + `${gameMove}` + ' ходов ' + `${time}` + ' секунд!');
    }
  }

  const numbers = [...Array(15).keys()]
  .sort(() => Math.random() - 0.5);

  for (let i = 1; i <= 15; i++) {
    const cell = document.createElement('div');
    cell.setAttribute('draggable', true);
    const value = numbers[i - 1] + 1;
    cell.className = 'cell';
    cell.innerHTML = numbers[i - 1] + 1;

    const left = i % 4;
    const top = (i - left) / 4;
    cells.push({
      value,
      left,
      top,
      element: cell,
    });

    cell.style.left = `${left * cellSize}px`;
    cell.style.top = `${top * cellSize}px`;

    field.append(cell);
    cell.addEventListener('click', () => {
      gameMove += 1;
      move(i);
    });
  }
}
//! Menu victory!
const victoryMenu = document.createElement('div');
victoryMenu.className = 'victory hidden';
victoryMenu.innerHTML = 'ПОБЕДА!';
const victoryBtn = document.createElement('button');
victoryBtn.className = 'menuBtn';
victoryBtn.innerHTML = 'Новая игра';
document.body.appendChild(victoryMenu);
victoryMenu.appendChild(victoryBtn);

function displayVictory() {
  document.querySelector('body > div.victory').classList.add('visible');
  document.querySelector('body > div.victory > button').addEventListener('click', () => {
    document.querySelector('body > div.victory').classList.remove('visible');
    document.querySelector('body > div.victory').classList.add('hidden');
    time = 0;
    gameRestart();
    gameMove = 0;
  });
}
//! END

// TODO MENU PAUSE
const menuPause = document.createElement('div');
menuPause.className = 'menu hidden';
menuPause.innerHTML = 'Меню Паузы';
const menuPauseBtn = document.createElement('button');
menuPauseBtn.innerHTML = 'Продолжить игру';
menuPauseBtn.className = 'menuBtn';
const pauseNewGame = document.createElement('button');
pauseNewGame.className = 'menuBtn';
pauseNewGame.innerHTML = 'Новая игра';
document.body.appendChild(menuPause);
menuPause.appendChild(menuPauseBtn);
menuPause.appendChild(pauseNewGame);

const savegameBtn = document.createElement('button');
savegameBtn.innerHTML = 'Сохранить игру';
savegameBtn.className = 'menuBtn';
menuPause.appendChild(savegameBtn);

const loadgame = document.createElement('button');
loadgame.innerHTML = 'Загрузить игру';
loadgame.className = 'menuBtn';
menuPause.appendChild(loadgame);

// TODO END

function displayMenuPause() {
  document.querySelector('body > div.menu').classList.remove('hidden');
  document.querySelector('body > div.menu').classList.add('visible');
}

document.querySelector('body > div.menu.hidden > button').addEventListener('click', () => { // Кнопка продолжить
  document.querySelector('body > div.menu').classList.remove('visible');
  document.querySelector('body > div.menu').classList.add('hidden');
  start();
});
document.querySelector('body > div.menu.hidden > button:nth-child(2)').addEventListener('click', () => { // новая игра кнопка
  document.querySelector('body > div.menu').classList.add('hidden');
  document.querySelector('body > div.menu').classList.remove('visible');
  time = 0;
  gameRestart();
  gameMove = 0;
});

let saveTime = 0;
let saveGame = [];
let saveMoves = 0;

document.querySelector('body > div.menu.hidden > button:nth-child(3)').addEventListener('click', () => { // СОХРАНИТЬ ИГРУ
  document.querySelector('body > div.menu').classList.add('hidden');
  document.querySelector('body > div.menu').classList.remove('visible');
  saveTime = time;
  localStorage.setItem('time', saveTime);
  saveGame = cells[0];
  localStorage.setItem('game', JSON.stringify(saveGame));
  saveMoves = gameMove;
  localStorage.setItem('moves', saveMoves);
  alert('Игра сохранена!');
  start();
});
document.querySelector('body > div.menu.hidden > button:nth-child(4)').addEventListener('click', () => { // Загркзить игру
  document.querySelector('body > div.menu').classList.remove('visible');
  document.querySelector('body > div.menu').classList.add('hidden');
  gameMove = saveMoves;
  time = saveTime;
  start();
});

game();
