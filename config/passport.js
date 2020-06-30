const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const chalk = require('chalk')

const User = require('../models/User')

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

module.exports = passport => {
  passport.use(new JwtStrategy(options,
    async (decodedToken, done) => {
      try {
        const user = await User.findById(decodedToken.id)

        if (!user) return done(null, false)

        return done(null, user)

      } catch (err) {

        console.error(chalk.red('[server][error]', 'passport jwt verify'))
        console.error(chalk.red('[at]', __filename))

        return done(err)
      }
    }
  ))
}