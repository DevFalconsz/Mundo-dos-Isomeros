import router from './controllers/authController.js'
import bodyParser from 'body-parser'
import { createServer } from 'http'
import express from 'express'

const app = express()
const server = createServer(app)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static("public"))
app.use("/auth", router)

server.listen(3000)