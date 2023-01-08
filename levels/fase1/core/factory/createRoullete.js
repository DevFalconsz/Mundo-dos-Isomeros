import { rad, deg, easeOut } from '../utils.js'
import gameEvents from '../gameEvents.js'

var somRoleta = new Audio();
somRoleta.src = 'audio/somRoleta.wav';
somRoleta.volume = 0.2;
somRoleta.load();

function tocarAudioRoleta(){
  somRoleta.play();
}

const createRoullete = (data, ctx) => {
  const roullete = {
    data: data,
    result: null,
    state: {
      spinAngle: 0,
      spinTimeTotal: 0,
      spinTimeCurrent: 0,
      status: "stop"
    },
    offsetArc: Math.PI / 4,
    segmentArc: (2 * Math.PI) / data.length,
  }

  const render = coord => {
    const { data, state } = roullete
    const screenWidth = ctx.canvas.width
    const screenHeight = ctx.canvas.height
    const halfScreenWidth = screenWidth >> 1
    const halfScreenHeight = screenHeight >> 1

    const frame = {
      x: 0, y: 0,
      insideRadius: 0,
      outsideRadius: 0,
      ...coord
    }
    frame.textRadius = frame.insideRadius + ((frame.outsideRadius - frame.insideRadius) >> 1)
    
    const { x, y, insideRadius, textRadius, outsideRadius } = frame
    const { offsetArc, segmentArc } = roullete

    data.forEach(({ text, color }, index) => {
      const angle = state.spinAngle + ((segmentArc * index) - offsetArc)

      ctx.fillStyle = color
      ctx.strokeStyle = "#FFF"
      ctx.lineWidth = 1
      
      ctx.beginPath()
      ctx.arc(x, y, outsideRadius, angle, angle + segmentArc, false)
      ctx.arc(x, y, insideRadius, angle + segmentArc, angle, true)
      ctx.closePath()
  
      ctx.fill()
      ctx.stroke()
  
      const angleWidth = textRadius * Math.cos(angle + (segmentArc / 2))
      const angleheight = textRadius * Math.sin(angle + (segmentArc / 2))
  
      ctx.font = "bold 25px verdana"
      ctx.fillStyle = "#FFF"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
  
      ctx.translate(x + angleWidth, y + angleheight)
      ctx.rotate(angle + (segmentArc / 2) + (Math.PI / 2))
  
      ctx.fillText(text, 0, 0)
  
      ctx.resetTransform()
    })
    
    const arrow = {
      char: "▼", fill: "#FFF", stroke: "#000", lineWidth: 2,
      width: halfScreenWidth,
      height: halfScreenHeight - (outsideRadius + 2) + (ctx.measureText("▼").width / 2)
    }

    ctx.fillStyle = arrow.fill
    ctx.strokeStyle = arrow.stroke
    ctx.lineWidth = arrow.lineWidth
    ctx.textBaseline = "alphabetic"
  
    ctx.fillText(arrow.char, arrow.width, arrow.height)
    ctx.strokeText(arrow.char, arrow.width, arrow.height)
  }

  const startSpinRoullete = () => {
    //roullete.state.spinTimeTotal = (Math.random() * 1000) + 6000
    roullete.state.spinTimeTotal = 5700
    roullete.state.spinTimeCurrent = 0
  }
  
  const spinRoullete = () => {
    const { spinTimeTotal, spinTimeCurrent } = roullete.state

    if (roullete.state.status === "start") {
      roullete.state.status = "running"
      startSpinRoullete()
      tocarAudioRoleta()
      return
    }

    if (spinTimeCurrent >= spinTimeTotal && roullete.state.status === "running") {
      roullete.state.status = "stop"
      stopSpinRoullete()
      return
    }
    
    if (roullete.state.status === "running") {
      const spinAngleEasing = easeOut(spinTimeCurrent, 0.002, spinTimeTotal)
    
      roullete.state.spinAngle += rad(spinAngleEasing)
      roullete.state.spinTimeCurrent += deg(roullete.segmentArc)
    }
  }
  
  const stopSpinRoullete = () => {
    const { offsetArc, segmentArc } = roullete
    const { spinAngle } = roullete.state
  
    const spinAngleAjust = spinAngle - offsetArc + (Math.PI / 2)
    const spinAngleSimplify = (2 * Math.PI) - (spinAngleAjust % (2 * Math.PI))
    const resultIndex = Math.floor(spinAngleSimplify / segmentArc)

    roullete.spinAngle = ((2 * Math.PI) - (offsetArc)) - spinAngleSimplify
    gameEvents.emit("stop-roullete", data[resultIndex])
  }

  return {
    render,
    spinRoullete,
    roullete,
  }
}

export default createRoullete