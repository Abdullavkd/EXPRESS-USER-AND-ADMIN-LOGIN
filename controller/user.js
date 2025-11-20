import userModel  from '../model/user.js'
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

// create user register sesstion
async function userRegister(req,res){

try {
    // take data from body
    const {name, age, email, password} = req.body;

    // check is user already exist
    const isOld = await userModel.findOne({email:email});

    if(isOld) {
        return res.status(404).json("User is already exist")
    }

    // bcrypt password
    const bcryptPass = await bcrypt.hash(password,10);

    // save data to database(MongoDB)
    const newUser = new userModel({
        name,
        age,
        email,
        password:bcryptPass,
        role:'user',
        blocked: false
    });
    await newUser.save();
    

    // send response
    res.status(201).json({
        message: 'Account Created Successfully',
        user: {
            name,
            age,
            email,
            password
        }
    })

} catch (error) {
    res.status(error.status || 404).json({
        message:error.message || 'Some Error Occured in Registraion, Try Again'
    })
}
}

export {userRegister};




// user login
async function userLogin(req,res) {
    try {
        
    // collect data from body
    const {email, password} = req.body;

    // search is the user available
    const user = await userModel.findOne({email:email});

    // chek is user available
    if(!user) {
        return res.status(404).json("There is no user Available")
    }

    // check is password correct
    const isMatchPass = await bcrypt.compare(password,user.password)

    if(!isMatchPass) {
        return res.status(404).json('Password in incurrect')
    };

    // create JWT
    const token = jsonwebtoken.sign(
        {id:user._id},
        process.env.SECRET_KEY
    );

    if(!token){
        return res.status(404).json("Something Went Wrong")
    }

    res.status(201).json('Login Completed',{user:user,token:`Bearer ${token}`})

    } catch (error) {
        res.status(error.status || 500).json(error.message || 'an error occured on login')
    }
    
}

export {userLogin};