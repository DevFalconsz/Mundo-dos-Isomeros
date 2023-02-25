import mongoose from 'mongoose'
import process from 'dotenv'

const { parsed } = process.config()

//mongoose.set('strictQuery', false)
//mongoose.Promise = global.Promise
mongoose.connect(parsed.MONGODB_URI)

export default mongoose