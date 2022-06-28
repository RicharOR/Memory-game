const moves = document.querySelector('#moves-count')
const timeValue = document.querySelector('#time')
const startBtn = document.querySelector('#start')
const stopBtn = document.querySelector('#stop')
const gameContainer = document.querySelector('.container__game')
const result = document.querySelector('#result')
const controls = document.querySelector('.container__controls')
let cards
let interval
let firstCard = false
let secondCard = false

// Array de items
const items = [
  {nombre: 'aguila', imagen: 'aguila.png'},
  {nombre: 'camaleon', imagen: 'camaleon.png'},
  {nombre: 'cocodrilo', imagen: 'cocodrilo.png'},
  {nombre: 'hormiga', imagen: 'hormiga.png'},
  {nombre: 'mariposa', imagen: 'mariposa.png'},
  {nombre: 'mono', imagen: 'mono.png'},
  {nombre: 'pajaro', imagen: 'pajaro.png'},
  {nombre: 'pantera', imagen: 'pantera.png'},
  {nombre: 'perezoso', imagen: 'perezoso.png'},
  {nombre: 'rana', imagen: 'rana.png'},
  {nombre: 'raton', imagen: 'raton.png'},
  {nombre: 'serpiente', imagen: 'serpiente.png'},
]

let seconds = 0,
  minutes = 0,
  movesCount = 0,
  winCount = 0

const timeGenerator = () => {
  seconds += 1
  if (seconds >= 60) {
    minutes += 1
    seconds = 0
  }
  // Reiniciar el tiempo antes de que se muestre en pantalla
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes
  timeValue.innerHTML = `<span>Tiempo: </span>${minutesValue}:${secondsValue}`
}

const movesCounter = () => {
  movesCount += 1
  moves.innerHTML = `<span>Movimientos: </span>${movesCount}`
}

// Seleccionar un item al azar del array de objs
const generateRandom = (size = 4) => {
  let tempArray = [...items]
  let cardValues = []
  // El tamaño debe ser el doble Matriz(4x4)/2 donde los paris de los objestos deberían existir
  size = (size * size) / 2
  // Seleccionador de objeto al azar
  for (let i = 0; i < size; i++) {
    const randonIndex = Math.floor(Math.random() * tempArray.length)
    cardValues.push(tempArray[randonIndex])
    // Una vez seleccionado remover el objeto del array temp
    tempArray.splice(randonIndex, 1)
  }
  return cardValues
}

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = ''
  cardValues = [...cardValues, ...cardValues]
  cardValues.sort(() => Math.random() - 0.5)
  for (let i = 0; i < size * size; i++) {
    /* Crear cartas
    before --> el lado frontal (contiene signos de pregunta)
    after --> el lado de atrás (contiene la imagen)
    data-card-values --> es un atributo custom el cual almacena los nombres de las cartas
    para poder relacionarlas después*/
    gameContainer.innerHTML += `
    <div class="card-container" data-card-value="${cardValues[i].nombre}">
      <div class="card-before">?</div>
      <div class="card-after">
        <img src="./imgs/${cardValues[i].imagen}" class="image"/>
      </div>
    </div>`
  }
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`

  // Cartas
  cards = document.querySelectorAll('.card-container')
  cards.forEach(card => {
    card.addEventListener('click', () => {
      if (!card.classList.contains('matched')) {
        card.classList.add('flipped')
        /* Si esta es la firstCard ( debe ser !firstCard, ya que esta está 
          inicializada a falsa) */
        if (!firstCard) {
          firstCard = card
          // El valor de la carta actual se almacena en firstCardValue
          firstCardValue = card.getAttribute('data-card-value')
        } else {
          // Se incrementan los movimientos cuando el usuario selecciona la segunda carta
          movesCounter()
          secondCard = card
          let secondCardValue = card.getAttribute('data-card-value')
          if (firstCardValue === secondCardValue) {
            firstCard.classList.add('matched')
            secondCard.classList.add('matched')
            firstCard = false
            winCount += 1
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>¡Ganaste!</h2>
              <h4>Movimientos: ${movesCount}</h4>`
              stopGame()
            }
          } else {
            let [tempFirstCard, tempSecondCard] = [firstCard, secondCard]
            firstCard = false
            secondCard = false
            let delay = setTimeout(() => {
              tempFirstCard.classList.remove('flipped')
              tempSecondCard.classList.remove('flipped')
            }, 900)
          }
        }
      }
    })
  })
}

// Iniciar el Juego
startBtn.addEventListener('click', () => {
  movesCount = 0
  minutes = 0
  seconds = 0
  controls.classList.add('hide')
  stopBtn.classList.remove('hide')
  startBtn.classList.add('hide')
  // Iniciar cronometro
  interval = setInterval(timeGenerator, 1000)
  moves.innerHTML = `<span>Movimientos: </span>${movesCount}`
  initializer
})

// Detener el juego
stopBtn.addEventListener(
  'click',
  (stopGame = () => {
    controls.classList.remove('hide')
    stopBtn.classList.add('hide')
    startBtn.classList.remove('hide')
    clearInterval(interval)
  })
)

// Inicializar valores y llamado a la función
const initializer = () => {
  result.innerText = ''
  winCount = 0
  let cardValues = generateRandom()
  matrixGenerator(cardValues)
}

initializer()
