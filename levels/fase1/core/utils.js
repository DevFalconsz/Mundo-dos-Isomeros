const rectRound = (ctx, x, y, w, h, r) => {
  ctx.moveTo(x + r, y)

  ctx.lineTo(x + w - (2*r), y)
  ctx.arcTo(x + w, y, x + w, y + r, r)

  ctx.lineTo(x + w, y + h - (2*r))
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)

  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)

  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + w, y, r)
}

const collisionMouseInPath = (ctx, { x, y }, shape) => ctx.isPointInPath(shape, x, y)
const collisionMouseClick = (ctx, { x, y, type }, shape) => ctx.isPointInPath(shape, x, y) && type === "click"

const rad = degrees => (degrees * (Math.PI / 180))
const deg = radians => (radians * (180 / Math.PI))
const easeOut = (cur, ease, end) => (end - cur) * ease

export {
  collisionMouseInPath,
  collisionMouseClick,
  rad,
  deg,
  easeOut,
  rectRound
}