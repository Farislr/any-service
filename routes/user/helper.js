const express = require('express')
const bcrypt = require('bcrypt')

const app = express()

var saltRounds = 10

module.exports = {
  genPassword(req, res, next) {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) return res.send(err)
      req.salt = salt
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) return res.send(err);
        req.body.password = hash
        return next()
      })
    })
  }
}