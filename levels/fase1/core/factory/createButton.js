import { collisionMouseInPath, collisionMouseClick, rectRound } from '../utils.js'

const createButton = (style, mouse, cb, ctx) => {
  const frameStyle = {
    font: "bold 25px verdana",
    string: "",
    fill: "#FFF", fillHover: "#888", stroke: "#000",
    textFill: "#000", textStroke: "#0000",
    textAlign: "center",
    lineWidth: 2,
    ...style
  }
  const state = {
    mouse: mouse,
    callback: cb,
    isCallbackApply: false,
    isMouseHover: false,
  }

  const render = coord => {
    const frame = {
      x: 0, y: 0,
      width: 100, height: 100,
      radius: 5,
      shape: new Path2D(),
      ...coord
    }
    const { x, y, width, height, radius, shape } = frame
    
    rectRound(shape, x, y, width, height, radius)

    state.isMouseHover = collisionMouseInPath(ctx, state.mouse, shape)
    
    ctx.fillStyle = state.isMouseHover ? frameStyle.fillHover : frameStyle.fill
    ctx.strokeStyle = frameStyle.stroke
    ctx.lineWidth = frameStyle.lineWidth

    ctx.fill(shape)
    ctx.stroke(shape)

    ctx.font = frameStyle.font
    ctx.fillStyle = frameStyle.textFill
    ctx.strokeStyle = frameStyle.textStroke
    ctx.textAlign = frameStyle.textAlign
    ctx.textBaseline = "middle"

    if (frameStyle.textAlign === "left") {
      ctx.fillText(frameStyle.string, x + 10, y + (height / 2))
      ctx.strokeText(frameStyle.string, x + 10, y + (height / 2))
    }
    
    if (frameStyle.textAlign === "center") {
      ctx.fillText(frameStyle.string, x + (width / 2), y + (height / 2))
      ctx.strokeText(frameStyle.string, x + (width / 2), y + (height / 2))
    }

    const isMouseClick = collisionMouseClick(ctx, state.mouse, shape)

    if (isMouseClick && !state.isCallbackApply) {
      state.isCallbackApply = true
      state.mouse.type = ""
      state.callback()
    }

    if (!isMouseClick && state.isCallbackApply) {
      state.isCallbackApply = false
    }
  }

  return { render, state }
}

export default createButton