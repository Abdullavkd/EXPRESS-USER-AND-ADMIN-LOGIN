import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRouter from './router/userRouter.js';
import adminRouter from './router/adminRouter.js';
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/mydatabaseone";

app.use(express.json());
app.use('/user',userRouter)
app.use('/admin',adminRouter)


async function start() {
    try {
        await mongoose.connect(MONGO_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
        })
        console.log("Monogdb Connected");
        app.listen(PORT,() => {
            console.log("Server is running on Port "+PORT)
        })
    } catch (error) {
        console.log("An error occured on connecting MOngoDB",error.message)
        process.exit(1);
    }
}
start();

