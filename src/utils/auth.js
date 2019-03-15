import jwt from 'jsonwebtoken'
import config from '../config'
import { User } from '../resources/user/user.model'

const newToken = user => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

const verifyToken = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) reject(err)
      resolve(payload)
    })
  })
}

export const signin = async (req, res) => {
  if (!(req.body.email && req.body.password))
    return res.status(404).send({ message: 'require password and email' })
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(404).send({ message: 'error user not found' })
    const passwordMatch = await user.checkPassword(req.body.password)
    if (!passwordMatch)
      return res.status(404).send({ message: 'error password not match' })
    res.status(201).json({ token: newToken(user) })
  } catch (e) {
    console.log(e)
    res.status(404).send({ message: 'error' })
  }
}

export const signup = async (req, res) => {
  if (!(req.body.email && req.body.password))
    return res.status(404).send({ message: 'require password and email' })
  try {
    const user = await User.create({ ...req.body })
    if (!user) return res.status(404).send({ message: 'user already exist' })
    res.status(201).json({ token: newToken(user) })
  } catch (e) {
    console.log(e)
    res.status(404).send({ message: 'error' })
  }
}

export const protect = async (req, res, next) => {
  if (typeof req.headers.authorization !== 'string')
    return res.status(404).send({ message: 'error' })
  let token = req.headers.authorization.split('Bearer ')[1]
  if (!token) return res.status(404).send({ message: 'error' })
  try {
    const user = await verifyToken(token)
    const _user = await User.findById(user.id)
      .select('-password')
      .lean()
      .exec()
    if (_user) return res.status(404).send({ message: 'error' })
    req.user = _user
    next()
  } catch (e) {
    console.error(e)
    res.status(404).send({ message: 'error' })
  }
}
