const express = require('express')
const db = require('../../models')
const passport = require('passport')
const {
  getAll,
  getOne,
  update,
  create,
  isUser,
} = require('../../services/crud').default

let router = express.Router()

router.use(
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res, next) => {
    return next()
  }
)

router.get('/', [isUser(), getAll(db.balance)], (req, res) =>
  res.send(res.locals.val)
)

router.get(
  '/:id',
  getOne(
    db.balance,
    {
      include: [
        {
          model: db.flow,
        },
      ],
    },
    'Balance not found'
  ),
  (req, res) => res.send(res.locals.val)
)

router.patch('/:id/update-amount', (req, res) => update(req, res, db.balance))

router.post('/', [isUser(undefined, false), create(db.balance)], (req, res) =>
  res.send(res.locals.val)
)

export default router
