import express from 'express'
const router = express.Router()
import User from '../models/user.js'
import jwt from 'jsonwebtoken';


router.post('/login', async (req, res) => {  // login
    const {email, password} = req.body;
    const user = await User.findByPk(email);

    if(!user){
        throw new Error('User not found');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword){
        throw new Error('Password not correct');
    }

    let tokenData = {
        email: user.email,
        role: user.role
    }

    console.log(tokenData);
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
    console.log(token + 111);

    return res
    .status(200)
        .cookie("access_token", token, {
            httpOnly: true,
            secure: process.Env.NODE_ENV === "production",
        })
        .json({
            status: true,
            success: "SendData",
            token: token
        })

}) ;




export default router