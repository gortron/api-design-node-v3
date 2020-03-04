import config from '../config'
import { User } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'

export const newToken = user => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req, res) => {
  if (!req.body.email || !req.body.password)
    return res
      .status(400)
      .send({ message: 'Email and Password are required and cannot be empty.' })
  try {
    const user = await User.create(req.body)
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    console.log(e)
    return res.status(400).end()
  }
}

export const signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .send({ message: 'Email and Password are required and cannot be empty.' })
  }

  try {
    const user = await User.findOne({ email: req.body.email })

    if (!user)
      return res.status(401).send({
        message: 'Could not find user. Please confirm email is correct.'
      })

    const match = await user.checkPassword(req.body.password)
    if (!match) {
      return res
        .status(401)
        .send({ message: 'Password does not match records.' })
    }
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (error) {
    console.log(e)
    return res.status(400).end()
  }
}

export const protect = async (req, res, next) => {
  // grab the token, confirm it exists, then confirm user exists
  if (!req.headers.authorization) {
    return res.status(401).end()
  }

  const token = req.headers.authorization.split('Bearer ')[1]

  if (!token) {
    return res.status(401).end()
  }

  try {
    const payload = await verifyToken(token)

    // Some tricks here. .lean converts mongoose document to json. Select gets rid of unwanted fields.
    const user = await User.findById(payload.id)
      .select('-password')
      .lean()
      .exec()

    if (!user) {
      return res.status(401).end()
    }

    req.user = user
    next()
  } catch (e) {
    console.log(e)
    return res.status(400).end()
  }
}
