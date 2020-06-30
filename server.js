require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log('[mongo] connected'))
  .catch(err => console.error(err))

const app = express()

app.use(express.json())
app.use('/api/auth', require('./routes/api/auth'))

app.get('/', (req, res) => {
  res.json({ success: true })
})

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`[server] listening to http://localhost:${port}`)
})