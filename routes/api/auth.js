const router = require('express').Router()
const bcrypt = require('bcrypt')
const chalk = require('chalk')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const { stringfyAndTrim, logServerError } = require('../../helpers/helpers')
const { isEmpty } = require('lodash')

const User = require('../../models/User')

router.post('/register', async (req, res) => {

  const name = stringfyAndTrim(req.body.name).replace(/ +/g, ' ')
  const email = stringfyAndTrim(req.body.email)
  const password = req.body.password

  const fields = {}
  if (!name) fields.name = 'Name is empty'
  if (!email) fields.email = 'Email is empty'
  if (!password) fields.password = 'Password is empty'

  if (!isEmpty(fields)) {
    return res.status(400).json({ msg: 'Invalid input', fields })
  }
  try {
    const user = await User.findOne({ email })
    if (user) {
      fields.email = 'Email already exists'
      return res.status(409).json({ msg: fields.email, fields })
    }

    const hash = await bcrypt.hash(password, 12)

    const newUser = await new User({
      name,
      email,
      password: hash
    }).save()
    return res.send(201).json(newUser)

  } catch (err) {
    logServerError(err, 'register user', __filename)
    return res.sendStatus(500)
  }
})

router.post('/login', async (req, res) => {

  const email = stringfyAndTrim(req.body.email)
  const password = req.body.password

  const fields = {}
  if (!email) fields.email = 'Email is empty'
  if (!password) fields.password = 'Password is empty'

  if (!isEmpty(fields)) {
    return res.status(400).json({ msg: 'Invalid input', fields })
  }

  try {
    const user = await User.findOne({ email })
    if (!user) {
      fields.email = 'Email not found'
      return res.status(404).json({ msg: fields.email, fields })
    }

    const matches = await bcrypt.compare(password, user.password)
    if (!matches) {
      fields.password = 'Wrong password'
      return res.status(400).json({ msg: fields.password, fields })
    }

    const bearerHeader = await jwtBearerHeader({ id: user.id })

    return res.json(bearerHeader)

  } catch (err) {
    logServerError(err, 'login user', __filename)
    return res.sendStatus(500)
  }
})

router.post('/refresh', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const bearerHeader = await jwtBearerHeader({ id: req.user.id })
      return res.json(bearerHeader)
    } catch (err) {
      logServerError(err, 'auth refresh', __filename)
      return res.sendStatus(500)
    }
  }
)

const jwtBearerHeader = payload => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: parseInt(process.env.JWT_EXPIRE_SEC) },
      (err, token) => {
        if (err) return reject(err)
        return resolve({ bearer: `Bearer ${token}` })
      }
    )
  })
}

module.exports = router