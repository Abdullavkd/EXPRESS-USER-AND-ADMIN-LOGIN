import bcrypt from 'bcrypt';
import { adminModel } from '../model/admin.js';
import jsonwebtoken from 'jsonwebtoken';

const adminRegister = async (req,res) => {
    try {
        // check is the creator an admin
        const admin = req.user;

        if(admin.role != 'admin') {
            return res.status(404).json("You are not an admin");
        }

        // take data from body
        const {name, email, password} = req.body;

        // bcrypt password
        const bcryptPass = await bcrypt.hash(password,10);

        // save data to database(MongoDB)
        const newAdmin = new adminModel({
            name, 
            email, 
            password:bcryptPass,
            role:'admin'
        });
        await newAdmin.save();

        // send response
        res.status(201).json({
            message: 'Admin account created successfully',
            admin:{
                name,
                email,
                password
            }
        })

    } catch (error) {
        res.status(error.status || 404).json({
            message:error.message || "There is an Error on creating admin account"
        });
    }
}

export {adminRegister}




// admin login
const adminLogin = async (req,res) => {
    try {
        // take data from body
        const {email, password} = req.body;

        // search is admin available
        const isAdmin = await adminModel.findOne({email:email})

        if(!isAdmin) {
            return res.status(404).json("No Admin Found");
        }

        // check is password correct
        const isPassword = await bcrypt.compare(password, isAdmin.password);

        console.log(isPassword)
        if(!isPassword) {
            return res.status(404).json("Incurrect Password");
        }

        // create JWT
        const token = jsonwebtoken.sign(
            {id:isAdmin._id},
            process.env.SECRET_KEY
        );

        if(!token) {
            res.status(404).json("there is an error on creating token");
        };

        res.status(201).json({admin:isAdmin,token:`Bearer ${token}`})

    } catch (error) {
        res.status(error.status || 5000).json(error.message || 'An error occured when login admin, try again')
    }
}

export { adminLogin}