const express = require('express')
const db = require('../../models')
const passport = require('passport')
const { paginate, whereIs } = require('../../services/helpers').default

let router = express.Router()

router.use(
  passport.authenticate('jwt', {
    session: false,
  }),
  async (req, res, next) => {
    return next()
  }
)

router.get('/', async (req, res) => {
  const balances = await paginate(req, db.balance, { ...whereIs(req) })
  return res.send(balances)
})

router.get('/:id', async (req, res) => {
  const { params } = req
  const balance = await db.balance.findOne({
    ...whereIs(req, {
      id: params.id,
    }),
    include: [{ model: db.flow, separate: true }],
  })
  return res.send(balance)
})

router.patch('/:id/update-amount', (req, res) => update(req, res, db.balance))

router.post('/', async (req, res) => {
  const data = { ...req.body }
  Object.assign(data, { user_id: req.user.id })
  const balance = await db.balance.create(data)
  return res.send(balance)
})

export default router
