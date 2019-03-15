import express from 'express'
import { json, urlencoded } from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import userRouter from './resources/user/user.router'
import { connect } from './utils/db'
import config from './config'
import { signin, signup, protect } from './utils/auth'

const app = express()

app.disable('x-powered-by')

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

app.post('/signin', signin)
app.post('/signup', signup)

app.use(protect)

app.use('/user', userRouter)

export const start = async () => {
  try {
    await connect()
    app.listen(config.port, () => {
      console.log(`server listen on port ${config.port}`)
    })
  } catch (e) {
    console.error(e)
  }
}
