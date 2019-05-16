const paginate = require('express-paginate')

module.exports = {
  getAll(model, options = {}) {
    return (req, res) => {
      options = Object.assign(options, {
        limit: req.query.limit,
        offset: req.skip,
        where: {
          user_id: req.user.id,
        },
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
    }
  },
  getOne(model, options = {}, err) {
    return (req, res) => {
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
    }
  },
  create(model, options = {}) {
    return (req, res) => {}
  },
  update(model, options = {}) {
    return (req, res) => {}
  },
  delete(model, options = {}) {
    return (req, res) => {}
  },
}
