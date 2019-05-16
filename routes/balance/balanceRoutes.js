const express = require('express')
const db = require('../../models')
const passport = require('passport')
const { getAll, getOne } = require('../../services/crud')

let router = express.Router()

router.use(
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res, next) => {
    return next()
  }
)

router.get('/', getAll(db.balance))

router.get(
  '/:id',
  getOne(
    db.balance,
    {
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

router.patch('/:id/update-amount', (req, res) => {
  const { body, params, user } = req
  db.balance
    .update(
      {
        amount: body.amount,
      },
      {
        where: {
          id: params.id,
          user_id: user.id,
        },
      }
    )
    .then(balance => {
      if (!balance)
        return res.status(400).send({ message: 'Balance not found' })

      return res.status(200).send(balance)
    })
})

router.post('/', (req, res) => {
  db.balance
    .create({
      user_id: req.user.id,
      name: req.body.name,
      description: req.body.description,
      amount: 0,
    })
    .then(balance => {
      res.send(balance)
    })
})

module.exports = router
