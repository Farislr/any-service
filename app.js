require('dotenv').config()
var express = require('express')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var passport = require('passport')
const paginate = require('express-paginate')

var app = express()

var coreRoutes = require('./routes')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())
app.use(paginate.middleware(15, 25))

require('./routes/middleware/auth')

app.use('/', coreRoutes)

app.use('*', (req, res) => res.sendStatus(404))

module.exports = app
