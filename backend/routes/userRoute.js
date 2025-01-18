import express from 'express';
import { registerUser, logingUser, logoutUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', logingUser);
router.post('logout', logoutUser);

export default router;