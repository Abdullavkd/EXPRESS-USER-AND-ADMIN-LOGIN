import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    name:{
        require:[true,'name is required for admin'],
        type:String
    },
    email:{
        requiere:[true,'email is require for admin'],
        type:String,
        unique:[true,'email Should be unique for admin']
    },
    password:{
        required:[true,'password is required for admin'],
        type:String
    },
    role: {
        required:true,
        type:String
    }
});

const adminModel = mongoose.model('admin',adminSchema);

export {adminModel}