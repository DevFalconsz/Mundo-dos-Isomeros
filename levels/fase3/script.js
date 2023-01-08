const scoreboard = document.querySelector('[data-js="scoreboard"]')
const control = document.querySelector('[data-js="control"]')
const board = document.querySelector('[data-js="board"]')

const init = () => {
  const state = {
    scoreboard: null,
    board: null,
    turn: "",
    players: {},
    data: {
      controlText: [],
      tileText: [],
      objRef: {},
    },
  }

  const setup = () => {
    state.data.objRef = {
      "but 1 eno e but2 eno":       "posicao",
      "cliclopropano e propano":    "nucleo",
      "metoxipropano etoxietano":   "compensacao",
      "etoxietano e butanol":       "funcional",
      "but 2 eno":                  "geometrica",
      "butano e metil propano":     "cadeia",
      "acetona e propenol":         "tautomeria",
      "dicloco e but 2 e eno":      "geometria",
      "carbo quiral":               "optica",
    }
    
    state.data.controlText = Object.keys(state.data.objRef)
    state.data.tileText = Object.values(state.data.objRef)

    const { randomizeTileText, randomizeControlText } = randomizePairArray(state.data)
    
    state.data.controlText = randomizeControlText
    state.data.tileText = randomizeTileText

    state.players = {
      player1: {name: "player", char: "X", score: 0},
      player2: createBot({name: "bot", char: "O", score: 0})
    }

    state.scoreboard = createScoreboard(state.players)

    const documentFragmentscoreboard = new DocumentFragment()

    state.scoreboard.forEach(({ score }) => {
      documentFragmentscoreboard.append(score)
    })
    scoreboard.append(documentFragmentscoreboard)

    state.board = createBoard(state.data)

    const documentFragmentControl = new DocumentFragment()
    const documentFragmentBoard = new DocumentFragment()

    state.board.forEach(({ boardTile, btnControl }) => {
      documentFragmentControl.append(btnControl)
      documentFragmentBoard.append(boardTile)
    })
    control.append(documentFragmentControl)
    board.append(documentFragmentBoard)

    state.turn = "player1"

    control.addEventListener("click", handleMouse, { once: true })
  }

  const createBoard = ({ tileText, controlText }) => {
    const createBoardTile = (text) => {
      const span = document.createElement("span")
      const div = document.createElement("div")

      span.classList.add("tile-text")
      div.classList.add("tile")

      span.textContent = text
      div.dataset.js = text
      div.append(span)

      return div
    }

    const createBtnControl = (text) => {
      const button = document.createElement("button")
      const span = document.createElement("span")

      button.classList.add("btn-control")
      span.classList.add("btn-text")

      button.dataset.js = text
      span.textContent = text
      button.type = "button"
      button.append(span)

      return button
    }

    return Array(9).fill().map((_,i) => ({
      char: "#",
      boardTile: createBoardTile(tileText[i]),
      btnControl: createBtnControl(controlText[i]),
    }))
  }

  const createScoreboard = players => {
    const playersAsArray = Object.entries(players)
    
    const createScore = ({ name, score }) => {
      const span = document.createElement("span")
      const div = document.createElement("div")

      div.classList.add("score-container")
      span.classList.add("score")

      span.textContent = `${name} - ${score}`
      div.append(span)

      return div
    }

    return playersAsArray.map(([ key, value ]) => ({
      player: key, score: createScore(value),
    }))
  }

  const createBot = props => {
    const chooseTile = ({ board, turn, players, data }) => {
      const boardFormated = board.map(({ char }, i) => char === "#" ? i : "").filter(char => char !== "")
      const chooseIndex = Math.floor(Math.random() * boardFormated.length)
      const chooseBoardTile = boardFormated[chooseIndex]

      if (!board[chooseBoardTile]) { return }
      
      board[chooseBoardTile].boardTile.children[0].textContent = players[turn].char
      board[chooseBoardTile].boardTile.children[0].classList.add("mark")
      board[chooseBoardTile].char = players[turn].char

      const btnControlIndex = board.findIndex(({ btnControl }) => data.objRef[btnControl.dataset.js] === board[chooseBoardTile].boardTile.dataset.js)

      board[btnControlIndex].btnControl.classList.add("selected")
    }

    const handleBotAction = () => {
      const { turn, players } = state
      players[turn].chooseTile(state)
      
      if (checkedBoard()) {
        control.addEventListener("click", handleMouse, { once: true })
        return
      }

      const playerList = Object.keys(players)
      const nextTurn = playerList[playerList.indexOf(turn) + 1] || playerList[0]
      state.turn = nextTurn

      control.addEventListener("click", handleMouse, { once: true })
    }

    return {
      ...props,
      chooseTile,
      handleBotAction
    }
  }

  const checkedBoard = () => {
    const { board, turn, players } = state
    const boardAsString = board.map(({ char }) => char).join("")

    const isBoardFull = !boardAsString.includes("#")
    const isPlayerWin = Object.values(players).some(({ char }) => {
      const regAsString = "(XXX.{6})|(...XXX...)|(.{6}XXX)|(X..){3}|(.X.){3}|(..X){3}|(..X.X.X..)|(X...X...X)".replace(/X/g, char)
      return RegExp(regAsString).test(boardAsString)
    })

    if (isBoardFull) {
      setTimeout(() => {
        resetBoard()

        if (isPlayerWin && turn === "player2") {
          setTimeout(players[turn].handleBotAction, 500)
        }
      }, 1000)
    }

    if (isPlayerWin) {
      scoreMark()
      setTimeout(() => {
        resetBoard()

        if (isPlayerWin && turn === "player2") {
          setTimeout(players[turn].handleBotAction, 500)
        }
      }, 1000)
    }

    return isBoardFull || isPlayerWin
  }

  const scoreMark = () => {
    const { scoreboard, turn, players } = state

    const scoreboardIndex = scoreboard.findIndex(({ player }) => player === turn)
    players[turn].score = players[turn].score + 1
    
    const { name, score } = players[turn]
    scoreboard[scoreboardIndex].score.children[0].textContent = `${name} - ${score}`
  }

  const resetBoard = () => {
    const { randomizeTileText, randomizeControlText } = randomizePairArray(state.data)
    
    state.data.controlText = randomizeControlText
    state.data.tileText = randomizeTileText

    state.board = createBoard(state.data)

    const documentFragmentControl = new DocumentFragment()
    const documentFragmentBoard = new DocumentFragment()

    state.board.forEach(({ boardTile, btnControl }) => {
      documentFragmentControl.append(btnControl)
      documentFragmentBoard.append(boardTile)
    })

    control.innerHTML = ""
    board.innerHTML = ""
    control.append(documentFragmentControl)
    board.append(documentFragmentBoard)
  }

  const randomizePairArray = ({ tileText, controlText }) => {
    const randomizeControlText = Array(controlText.length).fill().map(() => {
      const sortIndex = Math.floor(Math.random() * controlText.length)
      const sortValue = controlText[sortIndex]

      controlText.splice(sortIndex, 1)
      return sortValue
    })

    const randomizeTileText = Array(tileText.length).fill().map(() => {
      const sortIndex = Math.floor(Math.random() * tileText.length)
      const sortValue = tileText[sortIndex]
      
      tileText.splice(sortIndex, 1)
      return sortValue
    })

    return {randomizeTileText, randomizeControlText}
  }

  const handleMouse = ({ target }) => {
    if (target === control) {
      control.addEventListener("click", handleMouse, { once: true })
      return
    }

    const { board, turn, players, data } = state

    const boardIndex = board.findIndex(({ boardTile }) => data.objRef[target.dataset.js] === boardTile.dataset.js)

    if (board[boardIndex].char !== "#") {
      control.addEventListener("click", handleMouse, { once: true })
      return
    }

    board[boardIndex].boardTile.children[0].textContent = players[turn].char
    board[boardIndex].boardTile.children[0].classList.add("mark")
    board[boardIndex].char = players[turn].char
    
    target.classList.add("selected")

    if (checkedBoard()) {
      control.addEventListener("click", handleMouse, { once: true })
      return
    }

    const playerList = Object.keys(players)
    const nextTurn = playerList[playerList.indexOf(turn) + 1] || playerList[0]
    state.turn = nextTurn

    setTimeout(players[state.turn].handleBotAction, 500)
  }

  setup()
}

init()