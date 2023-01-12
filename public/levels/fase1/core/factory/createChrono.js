import createFrame from './createFrame.js'

const createChrono = (ctx) => {
  const chrono = {
    timeID: null,
    timeCurrent: 0,
    timeFormated: "00:00:00"
  }

  const timeFormat = (timeCurrent) => {
    const decimalSeconds = String(timeCurrent % 100).padStart(2, "0")
    const seconds = String(Math.floor((timeCurrent / 100) % 60)).padStart(2, "0")
    const minutes = String(Math.floor((timeCurrent / 6000) % 60)).padStart(2, "0")

    return [minutes, seconds, decimalSeconds].join(":")
  }

  const render = (coord) => {
    chrono.timeFormated = timeFormat(chrono.timeCurrent)

    const frameChrono = createFrame({
      fill: "#CCC",
      stroke: "#888",
      lineWidth: 4,
    }, {
      string: chrono.timeFormated,
      fill: "#000",
      stroke: "#0000"
    }, ctx)

    const frameChronoProps = {
      x: 0, y: 0,
      width: 150, height: 50,
      radius: 10,
      ...coord
    }

    frameChrono.render(frameChronoProps)
  }

  const start = () => {
    chrono.timeID = setInterval(() => {
      chrono.timeCurrent += 1
    }, 10)
  }

  const pause = () => {
    clearInterval(chrono.timeID)
  }

  const getTimeValue = () => ({
    timeCurrent: chrono.timeCurrent,
    timeFormated: chrono.timeFormated
  })

  return {
    render,
    start,
    pause,
    getTimeValue
  }
}

export default createChrono