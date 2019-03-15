import { Router } from 'express'
import { getMany, createOne } from './user.controllers'

const router = Router()

router.get('/', getMany)
router.post('/', createOne)

export default router
