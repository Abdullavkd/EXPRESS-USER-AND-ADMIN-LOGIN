import { adminLogin,adminRegister } from "../controller/admin.js";
import express from 'express';
import verifyToken from "../middleware/auth.js";

const adminRouter = express.Router();

adminRouter.post('/register',verifyToken,adminRegister);
adminRouter.post('/login',adminLogin);

export default adminRouter;