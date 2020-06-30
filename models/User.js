const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  credit: {
    type: Number,
    default: 0
  },
  role:{
    type: String,
    enum: ['user', 'manager', 'admin'],
    default: 'user'
  }
})

const User = mongoose.model('user', UserSchema)

module.exports = User