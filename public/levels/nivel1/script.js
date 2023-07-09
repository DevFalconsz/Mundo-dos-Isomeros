import createGame from './core/factory/createGame.js'

const canvas = document.querySelector('[data-js="game"]')
const game = createGame(canvas)

const soundtrack = new Audio('./audio/somRoleta.wav')
soundtrack.volume = 0.2
soundtrack.loop = "loop"
soundtrack.play()

const getConfig = async () => {
  const configAsText = await fetch("./../../config.json").then(res => res.text())
  const config = JSON.parse(configAsText)
  const sb = supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY)
  return sb
}

window.addEventListener("load", async e => {
  const auth  = localStorage.getItem("auth")
  
  if (!auth) {
    location.replace("../../")
    return
  }
  
  const sb = await getConfig()
  
  const { data, error } = await sb.from("users").select().eq("auth", auth)

  if (error || !data[0]) {
    location.replace("../../")
    return
  }

  const scoreAmoult = data[0].info.scores.filter(score => score > 0)
  
  if (scoreAmoult.length != 0) {
    location.replace("../../")
    return
  }
  
  game.start(sb)
})

window.addEventListener("resize", game.resizeGame)
canvas.addEventListener("click", game.handleMouse)
canvas.addEventListener("mousemove", game.handleMouse)