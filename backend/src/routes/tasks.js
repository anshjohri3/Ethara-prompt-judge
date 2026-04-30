import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTaskStatus,
  evaluateTask,
  getTaskStats,
  generateTaskResponses,
  updateTaskResponses
} from '../controllers/taskController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/stats', authenticate, getTaskStats);
router.post('/', authenticate, isAdmin, createTask);
router.get('/', authenticate, getTasks);
router.get('/:id', authenticate, getTaskById);
router.put('/:id/status', authenticate, updateTaskStatus);
router.post('/:id/evaluate', authenticate, evaluateTask);
router.post('/:id/generate', authenticate, generateTaskResponses);
router.put('/:id/responses', authenticate, updateTaskResponses);

export default router;