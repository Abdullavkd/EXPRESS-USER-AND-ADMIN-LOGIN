import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required']
    },
    age:{
        type:Number,
        required:[true,'Age is required']
    },
    email: {
        type:String,
        required:[true, 'Email is required']
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    }
});

const userModel = mongoose.model('user',userSchema);

export { userModel };