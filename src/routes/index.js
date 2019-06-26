import { Router } from 'express'
import * as routes from './core'

const router = Router()

router.use('/user', routes.user)
router.use('/balance', routes.balance)
router.use('/flow', routes.flow)

export default router
