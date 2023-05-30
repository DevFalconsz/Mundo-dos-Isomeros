import config from './config.json' assert { type: "json" }

const tbody = document.querySelector(".leaderboard-body")
const tfoot = document.querySelector(".leaderboard-foot")
const btnSubmit = document.querySelector(".menu-button")
const inputName = document.querySelector(".menu-input")

const sb = supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY)

const timeFormat = time => {
  if ((typeof time) === "string") { return time }

  const secs = String(Math.floor(time % 60)).padStart(2, "0")
  const mins = String(Math.floor(time / 60)).padStart(2, "0")

  return `${mins}:${secs}`
}

const getUserList = async () => {
  const { data: users, error } = await sb.from("users").select()

  if (error) {
    console.log(error)
    return
  }
  
  users.sort((a, b) => a.info.total - b.info.total)

  const placeholders = Array(16).fill({
    info: {name: "-", scores: ["-", "-", "-"], total: "-"}
  })
  
  const players = users.concat(placeholders)

  Array(16).fill().forEach((_,i) => {
    const { info } = players[i]

    tbody.innerHTML += `
      <tr>
        <td>${i+1}</td>
        <td>${info.name}</td>
        ${info.scores.map(score => `<td>${timeFormat(score)}</td>`).join("\n")}
        <td>${timeFormat(info.total)}</td>
      </tr>
    `
  })

  const authCurrent = localStorage.getItem("auth")
  
  users.forEach(({ auth, info }, i) => {
    if (auth !== authCurrent) { return }
    
    tfoot.innerHTML = `
      <tr>
        <td colspan="6">Your Rank</td>
      </tr>
      <tr>
        <td>${i+1}</td>
        <td>${info.name}</td>
        ${info.scores.map(score => `<td>${timeFormat(score)}</td>`).join("\n")}
        <td>${timeFormat(info.total)}</td>
      </tr>
    `
  })
}

getUserList()

btnSubmit.addEventListener("click", async e => {
  const name = DOMPurify.sanitize(inputName.value)

  if (/.*\<.*\>.*/.test(name)) { return }
  if (name.length < 3 || name.length > 8) { return }

  const auth = CryptoJS.SHA256(name + Date.now() + String(Math.random())).toString()

  await sb.from("users").insert({
    auth, info: { name, scores: [0, 0, 0], total: 3600 }
  })

  localStorage.setItem("auth", auth)

  location.replace("./levels/")
}, { once: true })

inputName.addEventListener("input", e => {
  const name = inputName.value

  if (name.length < 3 || name.length > 8) {
    btnSubmit.classList.add("disable")
    return
  }

  btnSubmit.classList.remove("disable")
})
