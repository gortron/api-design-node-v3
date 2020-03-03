import { Router } from 'express'
import controllers from './item.controllers'

const router = Router()

// /api/item
router
  .route('/')
  .get(controllers.getMany)
  .post(controllers.createOne)
// router
//   .route('/')
//   .get()
//   .post()

// /api/item/:id
router
  .route('/:id')
  .get(controllers.getOne)
  .put(controllers.updateOne)
  .delete(controllers.removeOne)
// router
//   .route('/:id')
//   .get()
//   .put()
//   .delete()

export default router
