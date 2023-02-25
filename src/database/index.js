import process from 'dotenv'
import mongoose from 'mongoose'

const { parsed } = process.config()

mongoose.set('strictQuery', false)
mongoose.Promise = global.Promise
mongoose.connect(`mongodb+srv://${parsed.USER}:${parsed.PASS}@isomeros.ietmfxn.mongodb.net/?retryWrites=true&w=majority`)

export default mongoose