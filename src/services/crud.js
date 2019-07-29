// @flow

import { getArrayPages } from 'express-paginate'
import type { $Request, $Response } from 'express'

const isUser = (options: { where: {} } = {}, extended: boolean = true) => {
  return (req: $Request, res: $Response, next: any) => {
    const { method, user } = req
    if (user) {
      if (method === 'POST' || method === 'PATCH') {
        payload(req, res, { user_id: user.id })
      }

      if (extended) {
        Object.assign(options, {
          where: {
            user_id: user.id,
          },
        })
        checkOptions(res, options)
      }
      return next()
    }
    return next()
  }
}

const whereIs = (req, ...keys) => {
  const { params, query, user } = req
  let where = {}
  keys.map((key: []) => {
    if (params[key]) Object.assign(where, { [(key: any)]: params[key] })
    if (query[key]) Object.assign(where, { [(key: any)]: query[key] })
  })
  return where
}

const isIncluded = (
  options: { include: any, where: {} } = {},
  associated_model: [],
  ...keys: []
) => {
  return (req: $Request, res: $Response, next: any) => {
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

const payload = (req, res, data = {}) => {
  const { body } = req
  Object.assign(body, data)
  if (res.locals.payload) return Object.assign(res.locals.payload, body)
  else return (res.locals.payload = body)
}

export default {
  isUser,
  isIncluded,
  getAll(model: any, options: { where: {} } = {}) {
    return (req: $Request, res: $Response, next: any) => {
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
          pages: getArrayPages(req)(3, pages_count, req.query.page),
        }
        return next()
      })
    }
  },
  getOne(model: any, options: { where: {} } = {}, err: String) {
    return (req: $Request, res: $Response, next: any) => {
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
  create(model, options = {}) {
    return (req: $Request, res: $Response, next: any) => {
      let body = payload(req, res)
      options = checkOptions(res, options)
      model.create(body, options).then(out => {
        if (!out) return res.status(400).send('err')
        res.locals.val = out
        return next()
      })
    }
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
