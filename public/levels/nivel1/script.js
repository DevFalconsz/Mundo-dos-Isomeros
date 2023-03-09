import createGame from './core/factory/createGame.js'

const canvas = document.querySelector('[data-js="game"]')
const game = createGame(canvas)

const soundtrack = new Audio('./audio/somRoleta.wav')
soundtrack.volume = 0.2
soundtrack.loop = "loop"
soundtrack.play()

game.start()

window.addEventListener("resize", game.resizeGame)
canvas.addEventListener("click", game.handleMouse)
canvas.addEventListener("mousemove", game.handleMouse)