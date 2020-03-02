import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'

export const app = express()
// const router = express.Router()
// router.get('/me', (req, res) => {
//   res.send({message: 'Responding with router!'})
// })
// app.use('/', router)

app.disable('x-powered-by')

// Middleware
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

app.get('/data', (req, res) => {
  res.send({ data: [1, 2, 3] })
})

app.post('/data', (req, res) => {
  console.log(req.body)
  res.send({ requestProcessed: true })
})

export const start = () => {
  app.listen(3000, () => {
    console.log('Server is running on 3000')
  })
}
