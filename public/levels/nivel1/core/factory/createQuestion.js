import createButton from './createButton.js'
import createFrame from './createFrame.js'
import gameEvents from '../gameEvents.js'

const createQuestion = (imgs, state, ctx) => {
  const { mouse, score, accScore } = state

  const questionGenerate = (btnOptionsColor) => {
    const imgNames = ["CADEIA", "FUNÇÃO", "POSIÇÃO", "METAMERIA", "TAUTOMERIA"]
    const choseImg = imgs[Math.floor(Math.random() * imgs.length)]

    const alternativeRandomizer = Array.from("abcde").map(value => {
      const imgNameRandomize = imgNames[Math.floor(Math.random() * imgNames.length)]
      const imgNameCapitalize = imgNameRandomize[0].toLocaleUpperCase() + imgNameRandomize.slice(1).toLocaleLowerCase()
      const alternative = `${value}) Isomeria de ${imgNameCapitalize}`

      imgNames.splice(imgNames.indexOf(imgNameRandomize), 1)

      return alternative
    })

    const frameScore = createFrame({
      fill: "#FFF",
      stroke: "#888",
      lineWidth: 4,
    }, {
      string: `Valendo ${score} Pontos`,
      fill: "#000",
      stroke: "#0000",
    }, ctx)
  
    const frameAccScore = createFrame({
      fill: "#FFF",
      stroke: "#888",
      lineWidth: 4,
    }, {
      string: `Pontuação: ${accScore} Pontos`,
      fill: "#000",
      stroke: "#0000",
    }, ctx)

    const questiongenerated = {
      img: choseImg,
      response: choseImg.alt,
      alt: alternativeRandomizer,
      btnOptionsColor: btnOptionsColor,
      frameScore: frameScore,
      frameAccScore: frameAccScore,
    }

    questiongenerated.btnOptions = btnQuestionGenerate(questiongenerated)

    return questiongenerated
  }

  const btnQuestionGenerate = (question) => {
    const btnOptions = Array.from("01234").map(value => {
      return createButton({
        font: "bold 16px verdana",
        string: question.alt[value],
        fill: "#CCC", fillHover: "#AAA", stroke: "#888",
        textFill: question.btnOptionsColor[value],
        textAlign: "left",
        lineWidth: 4,
      }, mouse, () => {
        if (question.btnOptionsColor[value] !== "#F00") {
          gameEvents.emit("chose-altenative", value, question.alt[value], question.response)
        }
      }, ctx)
    })

    return btnOptions
  }

  const btnOptionsColor = ["#000", "#000", "#000", "#000", "#000"]
  const question = {
    enum: "Qual a isomeria que ocorre entre as moléculas abaixo?",
    btnOptionsColor: btnOptionsColor,
    popup: null,
    attempts: 3,
    ...(questionGenerate(btnOptionsColor)),
    resolve: null
  }

  const frameQuestion = createFrame({
    fill: "#CCC",
    stroke: "#888",
    lineWidth: 4,
  }, {}, ctx)

  gameEvents.on("chose-altenative", (btnOptionIndex, alt, res) => {
    const altFormated = alt.split(" ").splice(-1).join("").toLocaleUpperCase()
    const stringAlertSucess = "Resposta correta!"
    const stringAlertFail = `Resposta errada, Tentativas: ${question.attempts - 1}`
    const stringAlertNoAttempts = "Não foi dessa vez!"
    const scoreMaxForTheWin = 40

    let string = ""

    if (altFormated === res) {
      string = stringAlertSucess
    } else if (altFormated !== res && (question.attempts - 1) !== 0) {
      string = stringAlertFail
    } else {
      string = stringAlertNoAttempts
    }

    if (!question.popup) {
      const frameAlert = createFrame({
        fill: "#2228",
        stroke: "#888",
        lineWidth: 4,
      }, {
        font: "bold 24px verdana",
        string: string,
        fill: altFormated === res ? "#0F0" : "#F00",
        stroke: "#0000",
      }, ctx)

      setTimeout(() => {
        question.btnOptionsColor[btnOptionIndex] = altFormated === res ? "#0F0" : "#F00"

        question.btnOptions = btnQuestionGenerate(question)
        question.popup = null

        if (!(altFormated === res)) {
          question.attempts -= 1
        }

        if (question.attempts === 0) {
          gameEvents.emit("pause-chrono")

          question.btnOptionsColor = ["#000", "#000", "#000", "#000", "#000"]

          const { img, alt, response, btnOptions } = questionGenerate(question.btnOptionsColor)

          question.img = img
          question.alt = alt
          question.response = response
          question.btnOptions = btnOptions
          question.resolve = false

          gameEvents.emit("result-incorrect")
        }

        if (altFormated === res) {
          gameEvents.emit("pause-chrono")

          question.btnOptionsColor = ["#000", "#000", "#000", "#000", "#000"]

          const { img, alt, response, btnOptions } = questionGenerate(question.btnOptionsColor)

          question.img = img
          question.alt = alt
          question.response = response
          question.btnOptions = btnOptions
          question.resolve = true

          if ((question.accScore + question.score) >= scoreMaxForTheWin) {
            gameEvents.emit("end-game")
          } else {
            gameEvents.emit("result-correct")
          }
        }
      }, 2000)

      question.popup = frameAlert
    }
  })

  const render = (coord) => {
    const frameQuestionProps = {
      x: 0, y: 0,
      width: 300, height: 300,
      radius: 10,
      ...coord
    }
    const { x, y, width, height } = frameQuestionProps
    
    frameQuestion.render(frameQuestionProps)

    ctx.fillStyle = "#000"
    ctx.textAlign = "center"
    ctx.textBaseline = "top"
    ctx.font = "bold 14px verdana"

    ctx.fillText(question.enum, x + (width / 2), y + 20)

    ctx.drawImage(question.img, x + (width / 2) - 200, y + 50, 400, 200)

    question.btnOptions.forEach((btnOption, index) => {
      const btnOptionProps = {
        x: x + 20,
        y: y + height - 100 + (40 * (index - (question.btnOptions.length - 1))),
        width: 275, height: 30, radius: 10,
      }

      btnOption.render(btnOptionProps)
    })

    const frameScoreProps = {
      x: x + 10, y: y + height - 50,
      width: 200, height: 30, radius: 10,
    }

    question.frameScore.render(frameScoreProps)

    const frameAccScoreProps = {
      x: x + width - 230, y: y + height - 50,
      width: 220, height: 30, radius: 10,
    }

    question.frameAccScore.render(frameAccScoreProps)

    if (question.popup) {
      question.popup.render(frameQuestionProps)
    }

    ctx.canvas.style.cursor = question.btnOptions.some(btnOption => btnOption.state.isMouseHover) ? "pointer" : "default"
  }

  const update = ({ score, accScore, attempts }) => {
    question.frameScore = createFrame({
      fill: "#FFF",
      stroke: "#888",
      lineWidth: 4,
    }, {
      string: `Valendo ${score} Pontos`,
      fill: "#000",
      stroke: "#0000",
    }, ctx)

    question.frameAccScore = createFrame({
      fill: "#FFF",
      stroke: "#888",
      lineWidth: 4,
    }, {
      string: `Pontuação: ${accScore} Pontos`,
      fill: "#000",
      stroke: "#0000",
    }, ctx)

    question.attempts = attempts
    question.score = score
    question.accScore = accScore
  }

  const getActualScore = () => {
    const { score, accScore, resolve } = question
    const actualScore = resolve ? accScore + score : accScore

    return String(actualScore || 0).padStart(2, "0") || "00"
  }

  return {
    render,
    update,
    getActualScore
  }
}

export default createQuestion
