const btn = document.querySelector("button")

btn.addEventListener("click", e => location.replace("./nivel1/"))

const getConfig = async () => {
  const configAsText = await fetch("./../config.json").then(res => res.text())
  const config = JSON.parse(configAsText)
  const sb = supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY)
  return sb
}

window.addEventListener("load", async e => {
  const auth  = localStorage.getItem("auth")
  
  if (!auth) {
    location.replace("../")
    return
  }
  
  const sb = await getConfig()
  
  const { data, error } = await sb.from("users").select("auth").eq("auth", auth)

  if (error || !data[0]) {
    location.replace("../")
    return
  }
})