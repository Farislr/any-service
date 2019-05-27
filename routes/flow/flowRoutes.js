const express = require('express')
const db = require('../../models')
const passport = require('passport')
const { getAll } = require('../../services/crud')

let router = express.Router()

router.use(
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res, next) => {
    return next()
  }
)

router.get('/:id', (req, res) =>
  getAll(req, res, db.flow, {
    include: [
      {
        model: db.balance,
        attributes: [],
        where: {
          id: req.params.id,
          user_id: req.user.id,
        },
      },
    ],
  })
)

router.post('/:id/add', (req, res) => {
  const { body, params } = req
  db.balance
    .findOne({
      where: {
        id: params.id,
        user_id: req.user.id,
      },
    })
    .then(balance => {
      if (!balance)
        return res.status(400).json({ message: 'Balance not found' })

      db.flow
        .create({
          description: body.description,
          debit: body.debit,
          credit: body.credit,
        })
        .then(flow => {
          balance.addFlows(flow.id).then(() => {
            return res.send(flow)
          })
        })
    })
})

module.exports = router
