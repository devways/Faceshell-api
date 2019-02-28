import express from 'express'
import { json, urlencoded } from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'

const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

export const start = () => {
  app.listen(3000, () => {
    console.log('server listen on port 3000')
  })
}
