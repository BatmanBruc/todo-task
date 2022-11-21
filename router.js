import { Router } from 'express';
import { auth_register, auth_login } from './controllers/authController.js'
import { todo_get_list, todo_create, todo_change, todo_delete } from './controllers/todoController.js'
import { user_middleware } from './services/userService.js';
const router = Router();

router.post('/auth/register', auth_register)
router.post('/auth/login', auth_login)

router.post('/todo/list', user_middleware, todo_get_list)
router.post('/todo/create', user_middleware, todo_create)
router.post('/todo/change/:id', user_middleware, todo_change)
router.post('/todo/delete/:id', user_middleware, todo_delete)
export default router;