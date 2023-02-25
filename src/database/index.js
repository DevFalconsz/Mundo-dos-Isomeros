import process from 'dotenv'
import mongoose from 'mongoose'

const { parsed } = process.config()

mongoose.set('strictQuery', false)
mongoose.Promise = global.Promise
mongoose.connect(parsed.MONGODB_URI)

export default mongoose