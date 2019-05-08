const express = require('express')
const services = require('require-all')({
  dirname: __dirname,
  recursive: true,
})

const router = express.Router()

router.use('/user', services.user.userRoutes)
router.use('/balance', services.balance.balanceRoutes)
router.use('/flow', services.flow.flowRoutes)

module.exports = router
