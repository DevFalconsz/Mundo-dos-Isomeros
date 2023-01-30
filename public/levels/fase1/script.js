import createGame from './core/factory/createGame.js'

const canvas = document.querySelector('[data-js="game"]')

const game = await createGame(canvas)

game.start()

window.addEventListener("resize", game.resizeGame)
canvas.addEventListener("click", game.handleMouse)
canvas.addEventListener("mousemove", game.handleMouse)