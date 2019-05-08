const express = require('express')
const db = require('../../models')
const passport = require('passport')

let router = express.Router()

router.use(
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res, next) => {
    return next()
  }
)

router.post('/:id/add', (req, res) => {
  const { body, params } = req
  db.balance
    .findOne({
      where: {
        id: params.id,
      },
    })
    .then(balance => {
      db.flow
        .create({
          description: body.description,
          debit: body.debit,
          credit: body.credit,
        })
        .then(flow => {
          balance.addFlows(flow.id).then(() => {
            res.send(flow)
          })
        })
    })
})

module.exports = router
