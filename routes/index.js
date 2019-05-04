const express = require('express')
const services = require('require-all')({
  dirname: __dirname,
  recursive: true
})

const router = express.Router()

router.use('/user', services.user.userRoutes)

module.exports = router