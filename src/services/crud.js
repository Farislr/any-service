// @flow

const paginate = require('express-paginate')

const isUser = (options = {}) => {
  return (req, res, next) => {
    if (req.user) {
      Object.assign(options, {
        where: {
          user_id: req.user.id,
        },
      })
      checkOptions(res, options)
      return next()
    }
    return next()
  }
}

const whereIs = (req, ...keys) => {
  const { params, query, user } = req
  let where = {}
  keys.map(key => {
    if (params[key]) Object.assign(where, { [key]: params[key] })
    if (query[key]) Object.assign(where, { [key]: query[key] })
  })
  return where
}

const isIncluded = (options = {}, associated_model, ...keys) => {
  return (req, res, next) => {
    const { params, query, user } = req
    let where = whereIs(req, keys)
    if (req.user) where.user_id = user.id

    const include = []

    options = Object.assign(options, {
      include: [
        {
          model: associated_model,
          where,
        },
      ],
    })

    checkOptions(res, options)
    return next()
  }
}

const checkOptions = (res, options) => {
  if (res.locals.options) return Object.assign(res.locals.options, options)
  else return (res.locals.options = options)
}

module.exports = {
  isUser,
  isIncluded,
  getAll(model, options = {}) {
    return (req, res, next) => {
      options = checkOptions(res, options)
      options = Object.assign(options, {
        limit: req.query.limit,
        offset: req.skip,
      })
      model.findAndCountAll(options).then(out => {
        let pages_count = Math.ceil(out.count / req.query.limit)
        res.locals.val = {
          data: out.rows,
          item_count: out.count,
          pages_count,
          pages: paginate.getArrayPages(req)(3, pages_count, req.query.page),
        }
        return next()
      })
    }
  },
  getOne(model, options = {}, err) {
    return (req, res, next) => {
      options = checkOptions(res, options)
      options = Object.assign(options, {
        where: {
          id: req.params.id,
        },
      })
      model.findOne(options).then(out => {
        if (!out) return res.status(400).send({ err })
        res.locals.val = out
        return next()
      })
    }
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
