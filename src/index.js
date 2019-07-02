// @flow

require('dotenv').config()
import express from 'express'
import type { $Request, $Response } from 'express'
import serverless from 'serverless-http'

var cookieParser = require('cookie-parser')
var logger = require('morgan')
import passport from 'passport'
// var session = require('express-session')
// var FileStore = require('session-file-store')(session)
const paginate = require('express-paginate')
const cubeJsServerCore = require('@cubejs-backend/server-core')

var app = express()

import coreRoutes from './routes'

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

import './routes/middleware/auth'

cubeJsServerCore.create().initApp(app)

app.use('/', coreRoutes)

app.use('*', (req: $Request, res: $Response) => res.sendStatus(404))

var port = process.env.PORT

export let handler = serverless(app)

// module.exports = app

export default app
