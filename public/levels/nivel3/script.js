const controls = document.querySelector('[data-controls]')
const buttons = document.querySelectorAll('[data-button]')
const scores = document.querySelectorAll('[data-score]')
const tiles = document.querySelectorAll('[data-tile]')
const time = document.querySelector('[data-time]')

const init = async sb => {
  const game = {
    referency: {
      "compensacao": "metoxipropano etoxietano",
      "tautomeria": "acetona e propenol",
      "geometrica": "but 2 eno",
      "funcional": "etoxietano e butanol",
      "geometria": "dicloro e but 2 eno",
      "posicao": "but 1 eno e but 2 eno",
      "nucleo": "cliclopropano e propano",
      "cadeia": "butano e metil propano",
      "optica": "carbono quiral"
    },
    board: Array(9).fill(),
    isProcessing: false,
    players: {
      "player1": {char: 'X', score: 0},
      "player2": {char: 'O', score: 0}
    },
    turn: "player1"
  }

  const timestamp = {
    current: Date.now(),
    start: Date.now(),
    timerID: null
  }

  timestamp.timerID = window.setInterval(() => {
    timestamp.current = Date.now()

    const timeCurrent = timestamp.current - timestamp.start
    const secs = `${Math.floor(timeCurrent / 1000) % 60}`.padStart(2, "0")
    const mins = `${Math.floor(timeCurrent / 60000) % 60}`.padStart(2, "0")

    time.textContent = `${mins}:${secs}`
  }, 1000)

  const delay = ms => new Promise(res => setTimeout(res, ms))

  const resetBoard = () => {
    const referencyAsArray = Object.entries(game.referency).sort(() => Math.floor(Math.random() * 3) - 1)
    const buttonRandomize = [...buttons].sort(() => Math.floor(Math.random() * 3) - 1)

    game.board = referencyAsArray.map(([ key, value ], i) => {
      const button = buttonRandomize[i]
      const tile = tiles[i]

      button.classList.remove("disable")
      button.textContent = value

      tile.classList.remove("mark")
      tile.textContent = key

      return { button, tile, char: '#' }
    })
  }

  const checkBoard = () => {
    const regexTemplate = "(@@@.{6})|(...@@@...)|(.{6}@@@)|(@..){3}|(.@.){3}|(..@){3}|(..@.@.@..)|(@...@...@)"
    const boardAsString = game.board.map(({ char }) => char).join("")
    const playerCurrentChar = game.players[game.turn].char

    const isPlayerWin = RegExp(regexTemplate.replace(/@/g, playerCurrentChar)).test(boardAsString)
    const isBoardFull = !boardAsString.includes("#")

    if (isPlayerWin) {
      game.players[game.turn].score += 1

      if (game.turn === "player1") {
        scores[0].textContent = game.players[game.turn].score

        if (game.players[game.turn].score > 2) {
          game.players["player1"].score = 0
          scores[0].textContent = 0

          game.players["player2"].score = 0
          scores[1].textContent = 0

          handlePlayerWin()
        }
      }

      if (game.turn === "player2") {
        scores[1].textContent = game.players[game.turn].score

        if (game.players[game.turn].score > 2) {
          game.players["player1"].score = 0
          scores[0].textContent = 0

          game.players["player2"].score = 0
          scores[1].textContent = 0
        }
      }

      resetBoard()
    }

    if (isBoardFull) {
      resetBoard()
    }

    game.turn = (game.turn === "player1") ? "player2" : "player1"
  }

  const handlePlayerWin = async () => {
    clearInterval(timestamp.timerID)
    const timeTotal = timestamp.current - timestamp.start

    const auth = localStorage.getItem("auth")
    const { data: [ { info } ] } = await sb.from("users").select("info").eq("auth", auth)
    
    info.scores[2] = Math.floor(timeTotal / 1000)
    await sb.from("users").update({ info }).eq("auth", auth)

    location.replace("../final/")
  }

  const handleBot = async () => {
    if (game.turn === "player1") { return }
    
    const boardFilted = game.board.filter(({ char }) => char === '#')
    const randomIndex = Math.floor(Math.random() * boardFilted.length)
    const slotSelect = boardFilted[randomIndex]

    slotSelect.button.click()
  }

  const handleMark = target => {
    const slotSelect = game.board.find(slot => slot.button === target)

    slotSelect.tile.textContent = game.players[game.turn].char
    slotSelect.tile.classList.add("mark")

    slotSelect.button.classList.add("disable")
    
    slotSelect.char = game.players[game.turn].char
  }

  const handleGame = async ({ target }) => {
    if (target.nodeName != "BUTTON") { return }
    if (target.classList.contains("disable")) { return }

    handleMark(target)
    await delay(500)
    checkBoard()
  }

  const handleClick = async e => {
    await handleGame(e)
    controls.addEventListener("click", handleClick, { once: true })
    handleBot()
  }

  resetBoard()
  handleSound()

  controls.addEventListener("click", handleClick, { once: true })
}

const handleSound = () => {
  const soundtrack = new Audio('audio/somGame.wav')
  soundtrack.volume = 0.2
  soundtrack.loop = "loop"
  soundtrack.play()
}

const getConfig = async () => {
  const configAsText = await fetch("./../../config.json").then(res => res.text())
  const config = JSON.parse(configAsText)
  const sb = supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY)
  return sb
}

window.addEventListener("load", async () => {
  const auth  = localStorage.getItem("auth")

  if (!auth) {
    location.replace("../../")
    return
  }
  
  const sb = await getConfig()

  const { data, error } = await sb.from("users").select().eq("auth", auth)

  if (error || !data[0]) {
    location.replace("../../")
    return
  }
  
  const scoreAmoult = data[0].info.scores.filter(score => score > 0)
  
  if (scoreAmoult.length != 2) {
    location.replace("../nivel2/")
    return
  }

  init(sb)
})