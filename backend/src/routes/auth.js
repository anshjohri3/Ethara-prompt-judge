import { Router } from 'express';
import { signup, login, getMe, getAllUsers } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.get('/users', authenticate, getAllUsers);

export default router;