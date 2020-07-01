require('dotenv').config()
process.env.JWT_EXPIRE_SEC = 3600

const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const chalk = require('chalk')

mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log('[mongo] connected'))
  .catch(err => {
    console.error(chalk.red('[mongo][error]', 'connect'))
    console.error(err)
  })

const app = express()

app.use(express.json())
app.use(passport.initialize())
require('./config/passport')

app.use('/api/auth', require('./routes/api/auth'))

app.get('/', (req, res) => {
  res.json({ success: true })
})

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`[server] listening to http://localhost:${port}`)
})