const express = require('express')
const db = require('../../models')
const { genPassword } = require('./helper')

const route = express.Router()

route.post('/register',[genPassword], (req, res) => {
  db.user.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    is_active: 1,
    is_confirmed: 0,
    salt: req.salt
  }).then(val => {
    res.send(val);
  })
})

route.post('/login', (req, res) => {
  
})

route.get('/', (req, res) => {
  db.user.findAll()
  .then(val => {
    res.send(val)
  })
})

module.exports = route
