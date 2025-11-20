import bcrypt from 'bcrypt';
import { adminModel } from '../model/admin.js';
import userModel from '../model/user.js';
import jsonwebtoken from 'jsonwebtoken';
import { userLogin } from './user.js';

const adminRegister = async (req,res) => {
    try {
        // check is the creator an admin
        const admin = req.user;

        if(admin.role != 'admin') {
            return res.status(404).json("You are not an admin");
        }

        // take data from body
        const {name, email, password} = req.body;

        // check is this email already exists
        const isOld = await adminModel.findOne({email:email});

        if(isOld) {
            return res.status(404).json("Admin is Alredy exist")
        }

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


// view full users
const listUsers = async (req,res) => {
    try {
        // check is this an admin
        const role = req.user.role;
        
        if(role != 'admin') {
            return res.status(404).json("You have no access for this page")
        }

        // take full user list
        const usersList = await userModel.find();

        if(!usersList || usersList.length == 0) {
            return res.status(404).json("No users Found")
        }
        
        // filter name, age and email
        const flList = usersList.map((val) => ({
            name:val.name,age:val.age,email:val.email
        }))
        // give response with list of users
        res.status(201).json(flList)
        
    } catch (error) {
        res.status(error.status || 500).json(error.message || "There is an error on publishing list of users, try again")
    }
    
}

export default listUsers;



// view list of admins
export const listAdmin = async (req,res) => {
    try {
        // chek is this an admin
        const role = req.user.role;

        if(role != 'admin') {
            return res.status(404).json("You are not an admin")
        }

        // take all details of every admins
        const adminList = await adminModel.find();

        if(!adminList) {
            res.status(404).json("There is no admins");
        }

        // filter name and email of admins
        const allAdmin = adminList.map((val) => ({
            name:val.name,
            email:val.email
        }))

        if(!allAdmin) {
            res.status(404).json("There is no admin list available")
        }

        // give response with list of admins
        res.status(201).json(allAdmin)
    } catch (error) {
        res.status(error.status || 500).json(error.message || "There is an error when looking to the list of admins")
    }
}


// block a user
export const blockUser = async (req,res) => {
    try {
        // check is this an admin
        const role = req.user.role;

        if(role != 'admin') {
            return res.status(404).json('You Are Not an Admin')
        }

        // collect user data from body
        const name = req.body;

        if(!name) {
            return res.status(404).json("There is no data provided")
        }

        // check is user available
        const user = await userModel.findOne(name);

        if(!user) {
            return res.status(404).json('user not found')
        }
        
        // check users current blocked status
        if(user.blocked) {
            return res.status(404).json("user is already blocked")
        }

        // update user blocked status as true
        await userModel.updateOne(name,{$set: {blocked: true}})

        // send response as the user is blocked
        res.status(201).json(`You Blocked user ${user.name}`)

    } catch (error) {
        res.status(error.status || 500).json(error.message || 'There is an error when blocking the user')
    }
}


// unblock a user
export const unblockuser = async (req,res) => {
    try {
        // check is this admin
        const role = req.user.role;

        if(role != 'admin') {
            return res.status(404).json("You are not an admin")
        }

        // take data from body
        const name = req.body;

        if(!name) {
            return res.status(404).josn("There is no user provided")
        }

        // check is user available
        const user = await userModel.findOne(name);

        if(!user) {
            return res.status(404).json("user not found")
        }

        // check user blocked or not
        if(!user.blocked) {
            return res.status(404).json("user is already unblocked")
        }

        // unblock user
        await userModel.updateOne(name,{$set:{blocked:false}})

        // give response
        res.status(201).json(`You are Unblocked ${name.name}`)
    } catch (error) {
        res.status(error.status || 5000).json(error.message || "There is an error on unblocking a user")
    }
}









// delete a user
export const deleteUser = async (req,res) => {
    try {
        // check is this an admin
        const role = req.user.role;

        if(role != 'admin') {
            return res.status(404).json("You are not an admin")
        }

        // take data from body
        const name = req.body;

        if(!name) {
            return res.status(404).json('There in no name provided')
        }

        // check is user available
        const user = await userModel.findOne(name);

        if(!user) {
            return res.status(404).json("There is no user Available in this name")
        }
        // delete user
        await userModel.deleteOne(name);

        // give response
        res.status(201).json(`You Deleted User ${name.name}`)
    } catch (error) {
        res.status(error.status || 5000).json(error.message || "There is an error on deleting user")
    }
}