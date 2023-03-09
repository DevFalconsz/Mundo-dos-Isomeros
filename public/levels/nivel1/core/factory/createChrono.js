import createFrame from './createFrame.js'

const createChrono = (ctx) => {
  const chrono = {
    timerID: null,
    timestampStart: 0,
    timestampCurrent: 0,
    timestampAccumulate: 0
  }

  const timeFormat = () => {
    const { timestampStart, timestampCurrent, timestampAccumulate } = chrono
    const time = timestampAccumulate + (timestampCurrent - timestampStart)

    const seconds = String(Math.floor(time / 1000) % 60).padStart(2, "0")
    const minutes = String(Math.floor(time / 60000) % 60).padStart(2, "0")

    return `${minutes}:${seconds}`
  }

  const render = coord => {
    const frameChrono = createFrame({
      fill: "#CCC",
      stroke: "#888",
      lineWidth: 4,
    }, {
      string: timeFormat(),
      fill: "#000",
      stroke: "#0000"
    }, ctx)

    const frameChronoProps = {
      x: 0, y: 0,
      width: 75, height: 50,
      radius: 10,
      ...coord
    }

    frameChrono.render(frameChronoProps)
  }

  const start = () => {
    chrono.timestampStart = Date.now()
    chrono.timestampCurrent = Date.now()

    chrono.timerID = setInterval(() => {
      chrono.timestampCurrent = Date.now()

      const { timestampStart, timestampCurrent, timestampAccumulate } = chrono
      const time = timestampAccumulate + (timestampCurrent - timestampStart)
    }, 1000)
  }

  const pause = () => {
    clearInterval(chrono.timerID)
    chrono.timestampAccumulate += chrono.timestampCurrent - chrono.timestampStart
    chrono.timestampCurrent = 0
    chrono.timestampStart = 0
  }

  const getTime = () => chrono.timestampAccumulate

  return {
    render,
    start,
    pause,
    getTime
  }
}

export default createChrono
