import createQuestion from './createQuestion.js'
import createRoullete from './createRoullete.js'
import gameObserver from '../gameObserver.js'
import createChrono from './createChrono.js'
import createButton from './createButton.js'
import createFrame from './createFrame.js'
import gameEvents from '../gameEvents.js'

const createGame = canvas => {
  const ctx = canvas.getContext("2d")
  const uploadImg = (() => {
    const imgNames = ["CADEIA", "FUNÇÃO", "METAMERIA", "POSIÇÃO", "TAUTOMERIA"]
    const imgNameNumbers = ["12345", "12345", "12345", "12345", "12345"]

    const imgAll = Array.from(imgNameNumbers.join("")).map((value, index) => {
      const img = new Image()
      img.src = "./imgs/" + imgNames[index % 5] + value + ".png"
      img.alt = imgNames[index % 5]

      return img
    })

    return imgAll
  })()

  const state = {
    obj: {},
    step: "spin-roullete",
    score: 0, accScore: 0, attempts: 3,
    mouse: {x: 0, y: 0, type: ""},
  }

  const start = () => {
    const frameRoullete = createFrame({
      fill: "#CCC",
      stroke: "#888",
      lineWidth: 4,
    }, {}, ctx)

    const roullete = createRoullete([
      {text: "05", color: "#600"}, {text: "14", color: "#000"},
      {text: "10", color: "#600"}, {text: "06", color: "#000"},
      {text: "13", color: "#600"}, {text: "04", color: "#000"},
      {text: "08", color: "#600"}, {text: "01", color: "#000"},
      {text: "07", color: "#600"}, {text: "09", color: "#000"},
      {text: "11", color: "#600"}, {text: "12", color: "#000"},
    ], ctx)

    const buttonSpin = createButton({
      string: "Girar",
      fill: "#CCC", fillHover: "#AAA", stroke: "#888",
      textFill: "#000",
      lineWidth: 4,
    }, state.mouse, () => {
      roullete.roullete.state.status = "start"
    }, ctx)

    const shapeQuestion = createQuestion(uploadImg, state, ctx)
    const shapeChrono = createChrono(ctx)

    const gameSteps = {
      "spin-roullete": [
        renderSpinRoullete,
        roullete.spinRoullete
      ],
      "show-question": [
        renderShowQuestion,
      ],
    }

    gameEvents.on("stop-roullete", result => {
      state.step = "show-question"
      state.score = Number(result.text)

      const frameAlert = createFrame({
        fill: "#2228",
        stroke: "#888",
        lineWidth: 4,
      }, {
        font: "bold 24px verdana",
        fill: "#FFF",
        stroke: "#0000",
        string: `Essa questão vale: ${result.text} pontos`,
      }, ctx)

      state.obj.frameAlert = frameAlert

      setTimeout(() => {
        state.obj.frameAlert = null
        state.obj.shapeQuestion.update(state)
        gameEvents.emit("start-chrono")

        gameObserver.unsubscribleAll()
        gameObserver.subscribles(gameSteps[state.step])
      }, 2000)
    })

    gameEvents.on("result-correct", () => {
      state.step = "spin-roullete"
      state.accScore += state.score
      state.score = 0

      gameObserver.unsubscribleAll()
      gameObserver.subscribles(gameSteps[state.step])
    })

    gameEvents.on("result-incorrect", () => {
      state.step = "spin-roullete"

      gameObserver.unsubscribleAll()
      gameObserver.subscribles(gameSteps[state.step])
    })

    gameEvents.on("end-game", () => {
      const result = shapeChrono.getTimeValue()

      localStorage.setItem("score-fase1", JSON.stringify(result))
      window.location.href = "https://www.professorcd.com/levels/fase2"
    })

    gameEvents.on("start-chrono", () => state.obj.shapeChrono.start())
    gameEvents.on("pause-chrono", () => state.obj.shapeChrono.pause())

    state.obj = {
      frameRoullete,
      roullete,
      buttonSpin,
      shapeQuestion,
      shapeChrono,
    }

    gameObserver.unsubscribleAll()
    gameObserver.subscribles(gameSteps[state.step])
    
    resizeGame()
    update()
  }

  const update = () => {
    const screenWidth = ctx.canvas.width
    const screenHeight = ctx.canvas.height

    ctx.clearRect(0, 0, screenWidth, screenHeight)

    gameObserver.notifyAll()

    requestAnimationFrame(update)
  }

  const renderSpinRoullete = () => {
    const screenWidth = ctx.canvas.width
    const screenHeight = ctx.canvas.height
    const halfScreenWidth = screenWidth >> 1
    const halfScreenHeight = screenHeight >> 1

    const roulleteProps = {
      x: halfScreenWidth,
      y: halfScreenHeight,
      insideRadius: 130,
      outsideRadius: 200,
    }

    const frameRoulleteProps = {
      x: halfScreenWidth - roulleteProps.outsideRadius - 25,
      y: halfScreenHeight - roulleteProps.outsideRadius - 25,
      width: 2 * (roulleteProps.outsideRadius + 25),
      height: 2 * (roulleteProps.outsideRadius + 25),
      radius: 10,
    }

    const buttonSpinProps = {
      x: screenWidth - 170,
      y: screenHeight - 70,
      width: 150,
      height: 50,
      radius: 5,
    }

    const frameAlertProps = frameRoulleteProps

    state.obj.frameRoullete.render(frameRoulleteProps)
    state.obj.roullete.render(roulleteProps)
    state.obj.buttonSpin.render(buttonSpinProps)

    ctx.canvas.style.cursor = state.obj.buttonSpin.state.isMouseHover ? "pointer" : "default"

    if (state.obj.frameAlert) { state.obj.frameAlert.render(frameAlertProps) }
  }

  const renderShowQuestion = () => {
    const screenWidth = ctx.canvas.width
    const screenHeight = ctx.canvas.height
    const halfScreenWidth = screenWidth >> 1
    const halfScreenHeight = screenHeight >> 1

    const frameChronoProps = {
      x: 10, y: 10,
      width: 100, height: 30, radius: 10,
    }

    const frameQuestionProps = {
      x: halfScreenWidth - 300 - 25,
      y: halfScreenHeight - 225 - 25,
      width: 650, height: 500, radius: 10,
    }

    state.obj.shapeChrono.render(frameChronoProps)
    state.obj.shapeQuestion.render(frameQuestionProps)
  }

  const resizeGame = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  const handleMouse = e => {
    state.mouse.x = e.clientX
    state.mouse.y = e.clientY
    state.mouse.type = e.type
  }

  return {
    start,
    resizeGame,
    handleMouse,
  }
}

export default createGame
