import { createServer } from 'http'
import { readdirSync } from 'fs'
import express from 'express'

const HOST = "localhost"
const PORT = 3000

const app = express()
const server = createServer(app)

app.use(express.static("./public"))

app.get("/imgsFase1", (res, req) => {
  const listFile = readdirSync("./public/levels/fase1/imgs")
  req.status(200)
  req.send(JSON.stringify(listFile))
})

server.listen(PORT, HOST, () => {
  console.log(`Start server in http://${HOST}:${PORT}`)
})