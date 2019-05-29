const passport = require('passport'),
  JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  LocalStrategy = require('passport-local').Strategy,
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  db = require('../../../models')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { env } = process

const jwtToken = env.JWT_SECRET

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
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      profile.emails.map(email => {
        db.user
          .findOrCreate({
            where: {
              email: email.value,
            },
            defaults: {
              name: profile.displayName,
              is_active: 1,
              is_confirmed: 0,
            },
          })
          .then(([user, created]) => {
            if (created)
              return db.social_user.create({
                user_id: user.id,
                provider_id: profile.id,
                provider: profile.provider,
              })
          })
          .then(user => {
            let value = {
              message: 'Login successful',
              token: jwt.sign({ user }, jwtToken),
            }
            return done(null, value)
          })
      })
    }
  )
)

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
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
