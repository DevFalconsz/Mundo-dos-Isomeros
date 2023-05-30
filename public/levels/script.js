import config from './../config.json' assert { type: "json" }

const btn = document.querySelector("button")

btn.addEventListener("click", e => location.replace("./nivel1/"))

window.addEventListener("load", async e => {
  const auth  = localStorage.getItem("auth")
  
  if (!auth) {
    location.replace("../")
    return
  }
  
  const sb = supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY)
  
  const { data, error } = await sb.from("users").select("auth").eq("auth", auth)

  if (error || !data[0]) {
    location.replace("../")
    return
  }
})