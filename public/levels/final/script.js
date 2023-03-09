const buttonContinue = document.querySelector(".button-continue")
const scoreTitle = document.querySelector(".score-title")
const scoreTotal = document.querySelector(".score-total")
const scoreName = document.querySelector(".score-name")
const scoreBody = document.querySelector(".score-body")

const SUPABASE_URL = "https://cgxrznxnjxxvsymdmatc.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNneHJ6bnhuanh4dnN5bWRtYXRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzczNjk2MDcsImV4cCI6MTk5Mjk0NTYwN30.r55VK2Z_7pUz9UrruWDMRvQcoyVQMhBP3GC54aXDtTM"

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

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

const showUserScore = () => {
  const timeFormat = score => {
    const seconds = String(score % 60).padStart(2, "0")
    const minutes = String(Math.floor(score / 60) % 60).padStart(2, "0")
  
    return `${minutes}:${seconds}`
  }

  const user = JSON.parse(localStorage.getItem("user"))
  const cells = [...scoreBody.children[0].children]

  scoreName.textContent = user.name

  cells.forEach((td, i) => {
    if (user.scores[i]) {
      td.textContent = timeFormat(user.scores[i])
      td.classList.remove("without-score")
    }
  })

  if (user.scores[2]) {
    scoreTotal.textContent = timeFormat(user.scores.reduce((a,v) => a+v))
    scoreTotal.classList.remove("without-score")
  }
}

const addLinkButton = () => {
  const linksAceepted = ["../nivel2/", "../nivel3/", "../../"]
  const user = JSON.parse(localStorage.getItem("user"))

  buttonContinue.addEventListener("click", e => {
    location = linksAceepted[user.scores.length - 1]
  })
}

const playsoundtrack = () => {
  const soundtrack = new Audio("./audio/somFinal.wav")
  soundtrack.loop = "loop"
  soundtrack.volume = 0.2
  soundtrack.play()
}

const handleRanking = async () => {
  const userAsJson = localStorage.getItem("user")
  const userAsJsonSanitize = DOMPurify.sanitize(userAsJson)
  const user = JSON.parse(userAsJsonSanitize)

  if (user.scores.length === 3) {
    await sb.from("users").insert({ data: {
      name: user.name,
      scores: user.scores,
      total: user.scores.reduce((a,v) => a+v)
    }})
  }
}

animateTypingTitle()
playsoundtrack()
showUserScore()
addLinkButton()
handleRanking()

// var string = "Parabéns por ter finalizado todo o site dos isômeros!"; /* type your text here */
// var array = string.split("");
// var timer = null;

// var somRoleta = new Audio('audio/somFinal.wav');
// somRoleta.volume = 0.2;
// somRoleta.loop = "loop";
// somRoleta.play();

// function frameLooper () {
//   if (array.length > 0) {
//     document.getElementById("text").innerHTML += array.shift();
//   } else {
//     clearTimeout(timer);
//     return
//   }

//   timer = setTimeout(frameLooper, 70); /* change 70 for speed */
// }

// frameLooper();
