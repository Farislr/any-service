const express = require('express')
const passport = require('passport')
const db = require('../../models')
const { hashPassword } = require('./helper')
const { create } = require('../../services/crud').default
const webSocket = require('ws')

const router = express.Router()

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.send(req.user)
  }
)

router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
)

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    res.set('X-TOKEN', req.user.token)
    res.send('<div>Loading...</div>')
  }
)

router.post('/register', [hashPassword], (req, res) =>
  create(req, res, db.user, { is_active: 1, is_confirmed: 0, salt: req.salt })
)
router.get('/ws', (req, res) => {
  var ws = new webSocket('ws://localhost:3000')

  ws.onopen = function() {
    console.log('websocket is connected ...')
    // sending a send event to websocket server
    ws.send('connected')
  }
  // event emmited when receiving message
  ws.onmessage = function(ev) {
    console.log(ev)
  }

  res.send('ws')
})

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    res.send(req.user)
  }
)

export default router
