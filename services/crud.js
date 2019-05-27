const paginate = require('express-paginate')

module.exports = {
  getAll(req, res, model, options = {}) {
    options = Object.assign(options, {
      limit: req.query.limit,
      offset: req.skip,
    })
    model.findAndCountAll(options).then(out => {
      let pages_count = Math.ceil(out.count / req.query.limit)
      res.send({
        data: out.rows,
        item_count: out.count,
        pages_count,
        pages: paginate.getArrayPages(req)(3, pages_count, req.query.page),
      })
    })
  },
  getOne(req, res, model, options = {}, err) {
    options = Object.assign(options, {
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    })
    model.findOne(options).then(out => {
      if (!out) return res.status(400).send({ err })
      res.send(out)
    })
  },
  create(req, res, model, data = {}, options = {}) {
    data = Object.assign(data, req.body)
    model.create(data, options).then(out => {
      if (!out) return res.status(400).send('err')
      return res.send(out)
    })
  },
  update(req, res, model, options = {}) {
    const { body } = req
    options = Object.assign(options, {
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    })
    model.update(body, options).then(out => {
      res.send(out)
    })
  },
  delete(req, res, model, options = {}) {
    return (req, res) => {
      options = Object.assign(options, {
        where: {
          id: req.params.id,
          user_id: req.user.id,
        },
      })
      model.delete(options).then(out => res.send(out))
    }
  },
}
