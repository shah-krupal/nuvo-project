import express from "express";
import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import { Strategy as googleStrategy } from "passport-google-oauth20";
import User from "../models/user.js";
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/signup/local', async (req, res) => {  // signup for non-admin users
    const {email, username, password} = req.body;
    try{
        const user = await User.create({
            email: email,
            username: username,
            password: password,
            role: process.env.USER || "user"
        })
		let tokenData = {
			email: user.email,
			role: user.role
		}
		console.log(tokenData)
		const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
	
		return res
			.status(200)
			// .cookie("access_token", token, {
			// 	httpOnly: true,
			// 	secure: process.env.NODE_ENV === "production",
			// })
			.json({
				status: true,
				success: "SendData",
				token: token
			})
    }
    catch(err){
        return res
		.status(400)
		.json({message: err.message + err.stack})
    }
}) ;


router.post('/signupadmin/local', async (req, res) => {  // signup for admin
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
            secure: process.env.NODE_ENV === "production",
        })
        .json({
            status: true,
            success: "SendData",
            token: token
        })
}) ;

// router.post('login/local',passport.authenticate('local',{session:false}),
// (req,res)=>{
// 	const token = generateJWTToken(user)
// 	return res
// 		.status(200)
// 		.cookie("access_token", token, {
// 			httpOnly: true,
// 			secure: process.Env.NODE_ENV === "production",
// 		})
// 		.json({
// 			status: true,
// 			success: "SendData",
// 			token: token,
// 		})
// 	}) ;

router.post("/login/local", (req, res, next) => {
	passport.authenticate('local',(err,user)=>{
		if(err){
			return next(err) ;
		}
		if(!user){
			return res
        	.status(400)
        	.json({message: err.message})
		}
		const token = generateJWTToken(user) ;
		return res
		.status(200)
		.cookie("access_token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
		})
		.json({
			status: true,
			success: "SendData",
			token: token,
		})(res,req,next)
	})
});

router.get("/logout", (req, res) => {
	req.logout();
	res.send("Successfully logged out");
});

router.get("/login/google",passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
	"/login/google/callback",
	passport.authenticate("googleStrategy", { failureRedirect: "/login-failed" }),
	(req, res) => {
		const token = generateJWTToken(req.user);
		return res
		.status(200)
		.cookie("access_token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
		})
		.json({
			status: true,
			success: "SendData",
			token: token,
		})
	}
);

router.get("/login-failed", (req, res) => {
	res.status(401).json({ message: "Login failed" });
});

const generateJWTToken = (user) => {
	let tokenData = {
		email: user.email,
		role: process.env.USER, // google signup only for users Not Admin
	};
	const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
	return res
		.status(200)
		.cookie("access_token", token, {
			httpOnly: true,
			secure: process.Env.NODE_ENV === "production",
		})
		.json({
			status: true,
			success: "SendData",
			token: token,
		});
};

export default router;
