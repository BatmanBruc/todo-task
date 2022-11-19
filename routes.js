import { Router } from 'express';
import { auth_register, auth_login} from './controllers/authController'
const router = Router();

router.post('/auth/register', auth_register)
router.post('/auth/login', auth_login)

export default router;