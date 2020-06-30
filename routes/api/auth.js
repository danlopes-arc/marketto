const router = require('express').Router()
const bcrypt = require('bcrypt')
const { isEmpty } = require('lodash')

const User = require('../../models/User')

router.post('/register', async (req, res) => {

  let { name, email, password } = req.body

  name = (name || '').trim().replace(/ +/g, ' ')
  email = (email || '').trim()

  const fields = {}
  if (!name) fields.name = 'Name is empty'
  if (!email) fields.email = 'Email is empty'
  if (!password) fields.password = 'Password is empty'
  
  if (!isEmpty(fields)) {
    return res.status(400).json({ msg: 'Invalid input', fields })
  }

  const user = await User.findOne({ email })
  if (user) {
    fields.email = 'Email already exists'
    return res.status(409).json({ msg: fields.email, fields})
  }

  const hash = await bcrypt.hash(password, 12)

  const newUser = await new User({
    name,
    email,
    password: hash
  }).save()

  return res.sendStatus(201)
})

module.exports = router