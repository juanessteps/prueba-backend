import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { handleValidation } from '../utils/validate.js';
import auth from '../middleware/auth.js';
import { createEvent, listEvents, registerToEvent } from '../controllers/event.controller.js';

const router = Router();

router.post(
  '/',
  auth,
  body('title').isString().isLength({ min: 1, max: 140 }),
  body('description').optional().isString().isLength({ max: 2000 }),
  body('date').isISO8601().toDate(),
  body('capacity').isInt({ min: 1 }),
  handleValidation,
  createEvent
);

router.get(
  '/',
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('fromDate').optional().isIn(['today']),
  query('dateGte').optional().isISO8601(),
  query('createdBy').optional().isString(),
  query('search').optional().isString(),
  handleValidation,
  listEvents
);

router.post(
  '/:id/register',
  auth,
  param('id').isString(),
  handleValidation,
  registerToEvent
);

export default router;
