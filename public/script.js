const tbody = document.querySelector(".leaderboard-body")
const tfoot = document.querySelector(".leaderboard-foot")
const btnSubmit = document.querySelector(".menu-button")
const inputName = document.querySelector(".menu-input")

const timeFormat = time => {
  if ((typeof time) === "string") { return time }

  const secs = String(Math.floor(time % 60)).padStart(2, "0")
  const mins = String(Math.floor(time / 60)).padStart(2, "0")

  return `${mins}:${secs}`
}

const getUserList = async () => {
  await fetch("/auth/all", {
    method: "POST",
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(res => res.json())
  .then(db => {
    Array(16).fill().forEach((_,i) => {
      const placeholder = {
        name: "-",
        scores: Array(3).fill("-"),
        total: "-"
      }

      const data = db.users[i] || placeholder

      tbody.innerHTML += `
        <tr>
          <td>${i+1}</td>
          <td>${data.name}</td>
          ${data.scores.map(score => `<td>${timeFormat(score)}</td>`).join("\n")}
          <td>${timeFormat(data.total)}</td>
        </tr>
      `
    })

    const userStorate = JSON.parse(localStorage.getItem("user"))
    
    db.users.forEach((user, i) => {
      const isUserName = user.name === userStorate.name
      const IsUSerScores = user.scores.every((score, i) => score === userStorate.scores[i])

      if (isUserName && IsUSerScores) {
        tfoot.innerHTML = `
          <tr>
            <td colspan="6">Your Rank</td>
          </tr>
          <tr>
            <td>${i+1}</td>
            <td>${user.name}</td>
            ${user.scores.map(score => `<td>${timeFormat(score)}</td>`).join("\n")}
            <td>${timeFormat(user.total)}</td>
          </tr>
        `
      }
    })
  })
  .catch(err => console.log(err))
}

getUserList()

btnSubmit.addEventListener("click", e => {
  e.preventDefault()

  if (inputName.value.length < 3) { return }
  
  const nameSanitize = DOMPurify.sanitize(inputName.value)
  if (/.*\<.*\>.*/.test(nameSanitize)) { return }

  localStorage.setItem("user", JSON.stringify({
    name: nameSanitize, scores: []
  }))

  location = "./levels"
})

inputName.addEventListener("input", e => {
  if (inputName.value.length >= 3) {
    btnSubmit.classList.remove("disable")
    return
  }

  btnSubmit.classList.add("disable")
})