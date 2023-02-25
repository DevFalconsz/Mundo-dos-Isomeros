import { rectRound } from "../utils.js"

const createFrame = (style, text, ctx) => {
  const frameStyle = {
    fill: "#FFF",
    stroke: "#000",
    lineWidth: 2,
    ...style
  }
  const textStyle = {
    font: "bold 16px verdana",
    string: "",
    fill: "#FFF",
    stroke: "#000",
    textBaseline: "middle",
    ...text
  }

  const render = (coord, str = "") => {
    const frame = {
      x: 0, y: 0,
      width: 100, height: 100,
      radius: 5,
      ...coord
    }

    ctx.fillStyle = frameStyle.fill
    ctx.strokeStyle = frameStyle.stroke
    ctx.lineWidth = frameStyle.lineWidth

    ctx.beginPath()
    rectRound(ctx, frame.x, frame.y, frame.width, frame.height, frame.radius)
    ctx.closePath()

    ctx.fill()
    ctx.stroke()

    ctx.font = textStyle.font
    ctx.fillStyle = textStyle.fill
    ctx.strokeStyle = textStyle.stroke
    ctx.textAlign = "center"
    ctx.textBaseline = textStyle.textBaseline

    ctx.fillText(str || textStyle.string, frame.x + (frame.width / 2), frame.y + (frame.height / 2))
    ctx.strokeText(str || textStyle.string, frame.x + (frame.width / 2), frame.y + (frame.height / 2))
  }

  return { render }
}

export default createFrame