const tbody = document.querySelector(".leaderboard-body")
const tfoot = document.querySelector(".leaderboard-foot")
const btnSubmit = document.querySelector(".menu-button")
const inputName = document.querySelector(".menu-input")

const SUPABASE_URL = "https://xbihbjssyptazqfdepxk.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiaWhianNzeXB0YXpxZmRlcHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA0NDMyNDEsImV4cCI6MTk5NjAxOTI0MX0.US0TpGoTbP4MTMyTwwrAtLrRhnb4LBmCOKR72z68vRQ"

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

const timeFormat = time => {
  if ((typeof time) === "string") { return time }

  const secs = String(Math.floor(time % 60)).padStart(2, "0")
  const mins = String(Math.floor(time / 60)).padStart(2, "0")

  return `${mins}:${secs}`
}

const getUserList = async () => {
  const { data: users, error } = await sb.from("users").select("data")

  if (error) {
    console.log(error)
    return
  }

  users.sort((a, b) => a.data.total - b.data.total)

  Array(16).fill().forEach((_,i) => {
    const placeholder = {
      name: "-",
      scores: ["-", "-", "-"],
      total: "-"
    }

    const { data: user } = users[i] || { data: placeholder }

    tbody.innerHTML += `
      <tr>
        <td>${i+1}</td>
        <td>${user.name}</td>
        ${user.scores.map(score => `<td>${timeFormat(score)}</td>`).join("\n")}
        <td>${timeFormat(user.total)}</td>
      </tr>
    `
  })

  const userStorate = JSON.parse(localStorage.getItem("user"))
  
  users.forEach(({ data }, i) => {
    const IsUSerScores = data.scores.every((score, i) => score === userStorate.scores[i])
    const isUserName = data.name === userStorate.name

    if (isUserName && IsUSerScores) {
      tfoot.innerHTML = `
        <tr>
          <td colspan="6">Your Rank</td>
        </tr>
        <tr>
          <td>${i+1}</td>
          <td>${data.name}</td>
          ${data.scores.map(score => `<td>${timeFormat(score)}</td>`).join("\n")}
          <td>${timeFormat(data.total)}</td>
        </tr>
      `
    }
  })
}

getUserList()

btnSubmit.addEventListener("click", e => {
  e.preventDefault()

  if (inputName.value.length < 3 || inputName.value.length > 8) { return }
  
  const nameSanitize = DOMPurify.sanitize(inputName.value)
  if (/.*\<.*\>.*/.test(nameSanitize)) { return }

  localStorage.setItem("user", JSON.stringify({
    name: nameSanitize, scores: []
  }))

  location = "./levels/"
})

inputName.addEventListener("input", e => {
  if (inputName.value.length < 3 || inputName.value.length > 8) {
    btnSubmit.classList.add("disable")
    return
  }

  btnSubmit.classList.remove("disable")
})
