//import router from './controllers/authController.js'
//import bodyParser from 'body-parser'
import { createServer } from 'http'
import express from 'express'
import path from 'node:path'

const app = express()
const server = createServer(app)

//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended: false }))

app.use("/", express.static(path.join(path.dirname("public"), "public")))
//app.use("/levels", express.static("public/levels"))
//app.use("/auth", router)

server.listen(3000)