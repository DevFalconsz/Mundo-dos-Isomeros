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
  easeOut
}