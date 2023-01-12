import { createServer } from 'http'
import express from 'express'

const HOST = "localhost"
const PORT = 3000

const app = express()
const server = createServer(app)

app.use(express.static("./public"))

server.listen(PORT, HOST, () => {
  console.log(`Start server in http://${HOST}:${PORT}`)
})