import { userModel } from '../model/user.js'

// create user register sesstion
async function userRegister(req,res){

try {
    // take data from body
    const body = req.body;

    // save data to database(MongoDB)
    const newUser = new userModel(body);
    await newUser.save();
    
    const {name, age, email, password} = newUser;

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