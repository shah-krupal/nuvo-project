import express from 'express'
const router = express.Router()
import User from '../models/user.js'
import jwt from 'jsonwebtoken';


router.post('/login', async (req, res) => {  // login
    const {email, password} = req.body;
    user = await User.findByPk(email);

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

    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});

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


router.post('/signup', async (req, res) => {  // signup for non-admin users
    const {email, username, password} = req.body;
    try{
        user = await User.create({
            email: email,
            username: username,
            password: password,
            role: process.env.USER
        })
    }
    catch(err){
        throw new Error('Error creating user');
    }

    let tokenData = {
        email: user.email,
        role: user.role
    }

    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});

    return res
    .status(200)
        .cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        })
        .json({
            status: true,
            success: "SendData",
            token: token
        })
}) ;


router.post('/signupadmin', async (req, res) => {  // signup for admin
    const {email, username, password} = req.body;
    try{
        user = await User.create({
            email: email,
            username: username,
            password: password,
            role: process.env.ADMIN
        })
    }
    catch(err){
        throw new Error('Error creating user');
    }

    let tokenData = {
        email: user.email,
        role: user.role
    }

    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});

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