const express = require('express')
const db = require('../../models')
const passport = require('passport')
const { getAll, getOne, update, create } = require('../../services/crud')

let router = express.Router()

router.use(
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res, next) => {
    return next()
  }
)

router.get('/', (req, res) =>
  getAll(req, res, db.balance, {
    where: {
      user_id: req.user.id,
    },
  })
)

router.get('/:id', (req, res) =>
  getOne(
    req,
    res,
    db.balance,
    {
      where: {
        user_id: req.user.id,
      },
      include: [
        {
          model: db.flow,
          through: { attributes: [] },
        },
      ],
    },
    'Balance not found'
  )
)

router.patch('/:id/update-amount', (req, res) => update(req, res, db.balance))

router.post('/', (req, res) => create(req, res, db.balance, { amount: 0 }))

module.exports = router
