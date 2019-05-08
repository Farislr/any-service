require('dotenv').config()
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var passport = require('passport')

var app = express()

var coreRoutes = require('./routes')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())

require('./routes/middleware/auth')

app.use('/', coreRoutes)

app.use('*', (req, res) => res.sendStatus(404))

module.exports = app
