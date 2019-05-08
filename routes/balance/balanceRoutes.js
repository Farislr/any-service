const express = require('express')
const db = require('../../models')
const passport = require('passport')
const paginate = require('express-paginate')

let router = express.Router()

router.use(
  passport.authenticate('jwt', {
    session: false,
  }),
  (req, res, next) => {
    return next()
  }
)

router.get('/', paginate.middleware(10, 25), (req, res) => {
  db.balance
    .findAndCountAll({
      limit: req.query.limit,
      offset: req.skip,
      where: {
        user_id: req.user.id,
      },
    })
    .then(balance => {
      const pages_count = Math.ceil(balance.count / req.query.limit)
      let output = {
        data: balance.rows,
        item_count: balance.count,
        pages_count,
        pages: paginate.getArrayPages(req)(3, pages_count, req.query.page),
      }
      res.send(output)
    })
})

router.get('/:id', (req, res) => {
  db.balance
    .findByPk(req.params.id, {
      include: [
        {
          model: db.flow,
          through: { attributes: [] },
        },
      ],
    })
    .then(balance => {
      if (!balance) return res.sendStatus(400)
      res.send(balance)
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
