import listUsers, { adminLogin,adminRegister, blockUser, deleteUser, listAdmin, unblockuser } from "../controller/admin.js";
import express from 'express';
import verifyToken from "../middleware/auth.js";

const adminRouter = express.Router();

adminRouter.post('/register',verifyToken,adminRegister);
adminRouter.post('/login',adminLogin);
adminRouter.get('/userslist',verifyToken,listUsers);
adminRouter.get('/adminlist',verifyToken,listAdmin);
adminRouter.post('/blockuser',verifyToken,blockUser);
adminRouter.post('/unblockuser',verifyToken,unblockuser);
adminRouter.post('/deleteuser',verifyToken,deleteUser);

export default adminRouter;