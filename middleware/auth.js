import jwt from 'jsonwebtoken';
import { adminModel } from '../model/admin.js';

const verifyToken = async (req,res,next) => {
    try {
        // collect token from req.header
        const authHead = req.headers.authorization;

        if(!authHead) {
            return res.status(404).json("There is no token provided")
        }

        // Remove the extra added Bearer
        const token = authHead.split(" ")[1];

        // Assure existence of secret key
        if(!process.env.SECRET_KEY) {
            return res.status(404).json("There is no secret key")
        }

        // collect user details from token
        const data = jwt.verify(token, process.env.SECRET_KEY);
console.log(data.id)
        // find the user details
        const user = await adminModel.findOne({name:'admin'})
console.log(user)
        if(!user) {
            return res.status(404).json("admin not found")
        }

        req.user = user;
        next()
    } catch (error) {
        
    }

}

export default verifyToken;