import User from '../models/user.js'
import express from 'express'

const router = express.Router()

router.post("/register", async (req, res) => {
  try {
    const users = await User.find()
    const isUserEqual = users.some(user => {
      return user.name === req.body.name && userscores.every((score, i) => score === req.body.scores[i])
    })

    if (isUserEqual) {
      res.send({ warning: "data exist in database" })
    }

    const user = await User.create(req.body)

    res.send({ sucess: "data save sucess" })
  } catch {
    res.status(400).send({ error: "registration failed" }) 
  }
})

router.get("/all", async (req, res) => {
  try {
    const users = await User.find()
    const usersSorted = users.sort((a, b) => a.total - b.total)

    res.send({ users: usersSorted })
  } catch {
    return res.status(400).send({ error: "get database failed" })
  }
})

export default router