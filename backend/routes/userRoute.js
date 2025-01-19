import express from 'express';
import { registerUser, logingUser, logoutUser, updateUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', logingUser);
router.post('/logout', logoutUser);
router.put('/update', updateUser);

export default router;