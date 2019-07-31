const express = require('express')
const db = require('../../models')
const passport = require('passport')
const { whereIs, paginate } = require('../../services/helpers').default

let router = express.Router()

router.use(
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res, next) => {
    return next()
  }
)

router.get('/:balance_id', async (req, res) => {
  const { params } = req
  const flows = await paginate(req, db.flow, {
    where: { balance_id: params.balance_id },
    include: [{ model: db.balance, ...whereIs(req), attributes: [] }],
  })
  return res.send(flows)
})

router.post('/:balance_id/add', async (req, res) => {
  const { body, params } = req
  await db.balance
    .findOne({
      ...whereIs(req, { id: params.balance_id }),
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
        .then(async flow => {
          await balance.addFlow(flow.id)
          return res.send(flow)
        })
    })
})

export default router
