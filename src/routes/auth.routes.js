import { Router } from 'express';
import { body } from 'express-validator';
import { handleValidation } from '../utils/validate.js';
import { register, login } from '../controllers/auth.controller.js';

const router = Router();

router.post(
  '/register',
  body('name').isString().isLength({ min: 2, max: 80 }),
  body('email').isEmail(),
  body('password').isString().isLength({ min: 8 }),
  handleValidation,
  register
);

router.post(
  '/login',
  body('email').isEmail(),
  body('password').isString().isLength({ min: 8 }),
  handleValidation,
  login
);

export default router;
