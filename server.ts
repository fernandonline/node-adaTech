import express from 'express'
import { config } from 'dotenv'
import { userRoutes } from './routes/UserRoutes'
import cors from 'cors'

config()
const app = express()
app.use(express.json())
const url = process.env.API_BASE_URL ?? 'http://localhost'
const port = process.env.API_PORT ?? 3000
app.use(cors())


app.get('/', (req, res) => {
  res.status(200).send('<h1> API base url </h1>')
})

app.use(userRoutes)

app.listen(port, () => {
  console.log(`Server is running - ${url}:${port}`)
})
