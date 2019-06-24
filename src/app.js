require('dotenv').config()
import express from 'express'
// var express = require('express')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var passport = require('passport')
// var session = require('express-session')
// var FileStore = require('session-file-store')(session)
const paginate = require('express-paginate')
const cubeJsServerCore = require('@cubejs-backend/server-core')

var app = express()

var coreRoutes = require('./routes')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
// app.use(
//   session({
//     store: new FileStore(),
//     secret: process.env.SESSION_SECRET,
//     resave: true,
//     saveUninitialized: true,
//   })
// )
app.use(passport.initialize())
// app.use(passport.session())
app.use(paginate.middleware(15, 25))

require('./routes/middleware/auth')

cubeJsServerCore.create().initApp(app)

app.use('/', coreRoutes)

app.use('*', (req, res) => res.sendStatus(404))

var port = process.env.PORT

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})

module.exports = app
