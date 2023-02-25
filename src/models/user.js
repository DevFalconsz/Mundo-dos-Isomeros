import mongoose from '../database/index.js'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  scores: {
    type: Array,
    require: true
  },
  total: {
    type: Number,
    require: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const User = mongoose.model("users", UserSchema)

export default User