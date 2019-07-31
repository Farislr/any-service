// @flow

import { getArrayPages } from 'express-paginate'
import type { $Request, $Response } from 'express'

const paginate = (req: $Request, model: any, options: any = {}) => {
  return new Promise<void>((resolve: any, reject: any) => {
    options = Object.assign(options, {
      limit: req.query.limit,
      offset: req.skip,
    })
    model.findAndCountAll(options).then(out => {
      let pages_count = Math.ceil(out.count / req.query.limit)
      resolve({
        data: out.rows,
        item_count: out.count,
        pages_count,
        pages: getArrayPages(req)(3, pages_count, req.query.page),
      })
    })
  })
}

const whereIs = (req: $Request, options: any = {}) => {
  options = Object.assign(options, { user_id: req.user.id })
  return Object.assign(options, { where: { ...options } })
}

export default {
  paginate,
  whereIs,
}
