const express = require('express')
const db = require('../../models')
const passport = require('passport')
const { getAll, isIncluded } = require('../../services/helpers').default

let router = express.Router()

router.use(
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res, next) => {
    return next()
  }
)

router.get(
  '/:id',
  [isIncluded(undefined, db.balance, 'id'), getAll(db.flow)],
  (req, res) => res.send(res.locals.val)
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

      return db.flow
        .create({
          description: body.description,
          debit: body.debit,
          credit: body.credit,
        })
        .then(flow => {
          return res.send(flow)
        })
    })
})

export default router
