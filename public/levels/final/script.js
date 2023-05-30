import config from './../../config.json' assert { type: "json" }

const buttonContinue = document.querySelector(".button-continue")
const scoreTitle = document.querySelector(".score-title")
const scoreTotal = document.querySelector(".score-total")
const scoreName = document.querySelector(".score-name")
const scoreBody = document.querySelector(".score-body")

const animateTypingTitle = () => {
  const title = "Você completou o nível!"
  const titleAsArray = title.split("")

  const animate = () => {
    if (titleAsArray.length === 0) { return }

    scoreTitle.textContent += titleAsArray.shift()
    setTimeout(animate, 50)
  }

  animate()
}

const showUserScore = async sb => {
  const timeFormat = score => {
    const seconds = String(score % 60).padStart(2, "0")
    const minutes = String(Math.floor(score / 60) % 60).padStart(2, "0")
  
    return `${minutes}:${seconds}`
  }

  const auth = localStorage.getItem("auth")
  const { data: [ { info } ] } = await sb.from("users").select("info").eq("auth", auth)
  const cells = [...scoreBody.children[0].children]

  scoreName.textContent = info.name

  cells.forEach((td, i) => {
    if (info.scores[i]) {
      td.textContent = timeFormat(info.scores[i])
      td.classList.remove("without-score")
    }
  })

  if (info.scores[2]) {
    scoreTotal.textContent = timeFormat(info.scores.reduce((a,v) => a+v))
    scoreTotal.classList.remove("without-score")
  }
}

const addLinkButton =  async sb => {
  const linksAceepted = ["../nivel2/", "../nivel3/", "../../"]
  const auth = localStorage.getItem("auth")
  const { data: [ { info } ] } = await sb.from("users").select("info").eq("auth", auth)
  const scoreFilted = info.scores.filter(score => score > 0)
  
  buttonContinue.addEventListener("click", e => {
    location.replace(linksAceepted[scoreFilted.length - 1])
  })
}

const playsoundtrack = () => {
  const soundtrack = new Audio("./audio/somFinal.wav")
  soundtrack.loop = "loop"
  soundtrack.volume = 0.2
  soundtrack.play()
}

const handleRanking = async sb => {
  const auth = localStorage.getItem("auth")
  const { data: [ { info } ] } = await sb.from("users").select("info").eq("auth", auth)

  if (!info.scores.every(score => score > 0)) { return }
  
  info.total = info.scores.reduce((a, v) => a + v, 0)
  await sb.from("users").update({ info }).eq("auth", auth)
}

window.addEventListener("load", async e => {
  const auth = localStorage.getItem("auth")
  
  if (!auth) {
    location.replace("../../")
    return
  }
  
  const sb = supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY)
  
  const { data, error } = await sb.from("users").select("auth").eq("auth", auth)

  if (error || !data[0]) {
    location.replace("../../")
    return
  }

  showUserScore(sb)
  addLinkButton(sb)
  handleRanking(sb)
  playsoundtrack()
  animateTypingTitle()
})
