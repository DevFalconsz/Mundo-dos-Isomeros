const buttonContinue = document.querySelector(".button-continue")
const scoreTitle = document.querySelector(".score-title")
const scoreTotal = document.querySelector(".score-total")
const scoreName = document.querySelector(".score-name")
const scoreBody = document.querySelector(".score-body")

const animateTypingTitle = () => {
  const title = "ocê completou o nível!"
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
  const linksAceepted = ["../fase2/pages/game.html", "../fase3", "../../"]
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
    await fetch("../../auth/register", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: user.name,
        scores: user.scores,
        total: user.scores.reduce((a,v) => a+v)
      })
    }).catch(err => console.log(err))
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