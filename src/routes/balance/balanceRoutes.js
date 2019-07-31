const express = require('express')
const db = require('../../models')
const passport = require('passport')
const { paginate } = require('../../services/helpers').default

let router = express.Router()

const whereIs = (req, options = {}) => {
  options = Object.assign(options, { user_id: req.user.id })
  return Object.assign(options, { where: { ...options } })
}

router.use(
  passport.authenticate('jwt', {
    session: false,
  }),
  async (req, res, next) => {
    return next()
  }
)

router.get('/', async (req, res) => {
  const balances = await paginate(req, db.balance)
  return res.send(balances)
})

router.get('/:id', async (req, res) => {
  const { params } = req
  let options = {
    id: params.id,
  }
  const balance = await db.balance.findOne({
    ...whereIs(req, options),
    include: [{ model: db.flow, separate: true }],
  })
  return res.send(balance)
})

router.patch('/:id/update-amount', (req, res) => update(req, res, db.balance))

router.post('/', async (req, res) => {
  let data = { ...req.body }
  Object.assign(data, { user_id: req.user.id })
  const balance = await db.balance.create(data)
  return res.send(balance)
})

export default router
