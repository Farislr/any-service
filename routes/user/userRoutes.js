const express = require('express')
const passport = require('passport')
const db = require('../../models')
const { hashPassword } = require('./helper')

const router = express.Router()

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send(req.user);
})

router.post('/register', [hashPassword], (req, res) => {
  db.user.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    is_active: 1,
    is_confirmed: 0,
    salt: req.salt
  }).then(val => {
    res.send(val)
  })
})

router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    res.send(req.user)
})

module.exports = router
