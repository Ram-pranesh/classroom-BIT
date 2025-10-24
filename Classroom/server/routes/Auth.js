import express from "express";
import { getUsers, Login, Logout, Register, googleLogin, editUser, deleteUser } from "../controllers/Auth.js";
import upload from "../middleware/Multer.js";
import authMiddleware from "../middleware/Authmiddleware.js";

const AuthRoutes = express.Router();

AuthRoutes.post('/register', upload.single('profile'), Register);
AuthRoutes.post('/login', Login);
AuthRoutes.post('/logout', Logout);
AuthRoutes.get('/getusers', authMiddleware, getUsers);
AuthRoutes.post('/edituser/:id', authMiddleware, editUser); // New route for editing a user
AuthRoutes.delete('/deleteuser/:id', authMiddleware, deleteUser);
AuthRoutes.post('/google', googleLogin); 

export default AuthRoutes;