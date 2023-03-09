const spanPlayer = document.querySelector('.player');
const timer = document.querySelector('.timer');
const grid = document.querySelector('.grid');

const soundtrack = new Audio('audio/somGame.wav');
soundtrack.volume = 0.2;
soundtrack.loop = "loop";
soundtrack.play();

const characters = [
  'img1',
  'img2',
  'img3',
  'img4',
  'img5',
  'img6',
  'img7',
  'img8',
  'img9',
  'img10',
];

const timestamp = {
  timerID: null,
  start: 0,
  current: 0,
};

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

let firstCard = '';
let secondCard = '';

const checkEndGame = () => {
  const disabledCards = document.querySelectorAll('.disabled-card');

  if (disabledCards.length === 20) {
    clearInterval(timestamp.timerID);
    
    const user = JSON.parse(localStorage.getItem("user"));
    user.scores[1] = Math.floor((timestamp.current - timestamp.start) / 1000);
    localStorage.setItem("user", JSON.stringify(user));

    location = "../final/";
  }
}

const checkCards = () => {
  const firstCharacter = firstCard.getAttribute('data-character');
  const secondCharacter = secondCard.getAttribute('data-character');

  if (firstCharacter === secondCharacter) {

    firstCard.firstChild.classList.add('disabled-card');
    secondCard.firstChild.classList.add('disabled-card');

    firstCard = '';
    secondCard = '';

    checkEndGame();

  } else {
    setTimeout(() => {

      firstCard.classList.remove('reveal-card');
      secondCard.classList.remove('reveal-card');

      firstCard = '';
      secondCard = '';

    }, 500);
  }

}

const revealCard = ({ target }) => {

  if (target.parentNode.className.includes('reveal-card')) {
    return;
  }

  if (firstCard === '') {

    target.parentNode.classList.add('reveal-card');
    firstCard = target.parentNode;

  } else if (secondCard === '') {

    target.parentNode.classList.add('reveal-card');
    secondCard = target.parentNode;

    checkCards();

  }  
}

const createCard = (character) => {

  const card = createElement('div', 'card');
  const front = createElement('div', 'face front');
  const back = createElement('div', 'face back');

  front.style.backgroundImage = `url('img/${character}.png')`;

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener('click', revealCard);
  card.setAttribute('data-character', character)

  return card;
}

const loadGame = () => {
  const duplicateCharacters = [ ...characters, ...characters ];

  const shuffledArray = duplicateCharacters.sort(() => Math.random() - 0.5);

  shuffledArray.forEach((character) => {
    const card = createCard(character);
    grid.appendChild(card);
  });
}

const timeFormat = () => {
  const time = timestamp.current - timestamp.start;
  const secs = String(Math.floor(time / 1000) % 60).padStart(2, "0");
  const mins = String(Math.floor(time / 60000) % 60).padStart(2, "0");

  return `${mins}:${secs}`;
}

const startTimer = () => {
  timestamp.start = Date.now();
  timestamp.current = Date.now();

  timestamp.timerID = setInterval(() => {
    timestamp.current = Date.now();
    timer.innerHTML = timeFormat();
  }, 1000);
}

window.onload = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  spanPlayer.innerHTML = user.name || "default";
  startTimer();
  loadGame();
}
