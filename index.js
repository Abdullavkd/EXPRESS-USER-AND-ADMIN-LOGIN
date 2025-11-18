import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRouter from './router/userRouter.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use('/user',userRouter)


mongoose.connect("mongodb://localhost:27017/mydatabaseone")
.then(() => {
    app.listen(PORT,() => {
    console.log(`server is running on port ${PORT}`)
    })
})
.catch((error) => {
    console.log("Eroor on connecting to database",error)
})
