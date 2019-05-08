const passport = require('passport'),
  JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  LocalStrategy = require('passport-local').Strategy,
  db = require('../../../models')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const jwtToken = 'JwtSecret'

let opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtToken,
}

passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    const { user } = jwt_payload
    db.user
      .findOne({
        where: {
          id: user.id,
        },
        attributes: ['id', 'email', 'name', 'is_active', 'is_confirmed'],
      })
      .then(user => {
        if (!user) return done(null, false)
        return done(null, user)
      })
  })
)

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
    console.log('local strategy')
    db.user
      .findOne({
        where: {
          email: username,
        },
      })
      .then(user => {
        if (!user) return done(null, false)
        bcrypt.hash(password, user.salt, (err, hash) => {
          if (err) return done(err)
          if (user.password === hash) {
            let value = {
              message: 'Login successful',
              token: jwt.sign({ user }, jwtToken),
            }
            return done(null, value)
          }
          return done(null, false)
        })
      })
  })
)
