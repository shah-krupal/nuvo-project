// import express from "express";
// import { Strategy as localStrategy } from "passport-local";
// import { Strategy as googleStrategy } from "passport-google-oauth20";
// import User from "../models/user.js";
// import jwt from 'jsonwebtoken';
// import passport from '../config/passport-auth.js'

// const router = express.Router();

// router.post('/signup/local', async (req, res) => {  // signup for non-admin users
//     const {email, username, password} = req.body;
//     try{
//         const user = await User.create({
//             email: email,
//             username: username,
//             password: password,
//             role: process.env.USER || "user"
//         })
// 		let tokenData = {
// 			email: user.email,
// 			role: user.role
// 		}
// 		console.log(tokenData)
// 		const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});

// 		return res
// 			.status(200)
// 			// .cookie("access_token", token, {
// 			// 	httpOnly: true,
// 			// 	secure: process.env.NODE_ENV === "production",
// 			// })
// 			.json({
// 				status: true,
// 				success: "SendData",
// 				token: token
// 			})
//     }
//     catch(err){
//         return res
// 		.status(400)
// 		.json({message: err.message + err.stack})
//     }
// }) ;

// router.post('/signupadmin/local', async (req, res) => {  // signup for admin
//     const {email, username, password} = req.body;
//     try{
//         user = await User.create({
//             email: email,
//             username: username,
//             password: password,
//             role: process.env.ADMIN
//         })
//     }
//     catch(err){
//         throw new Error('Error creating user');
//     }

//     let tokenData = {
//         email: user.email,
//         role: user.role
//     }

//     const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});

//     return res
//     .status(200)
//         .cookie("access_token", token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//         })
//         .json({
//             status: true,
//             success: "SendData",
//             token: token
//         })
// }) ;

// // router.post('login/local',passport.authenticate('local',{session:false}),
// // (req,res)=>{
// // 	const token = generateJWTToken(user)
// // 	return res
// // 		.status(200)
// // 		.cookie("access_token", token, {
// // 			httpOnly: true,
// // 			secure: process.Env.NODE_ENV === "production",
// // 		})
// // 		.json({
// // 			status: true,
// // 			success: "SendData",
// // 			token: token,
// // 		})
// // 	}) ;

// router.post("/login/local", (req, res, next) => {
// 	console.log('local')
// 	passport.authenticate('local', (err, user) => {
// 	  if (err) {
// 		return next(err);
// 	  }
// 	  if (!user) {
// 		return res.status(400).json({ message: 'Invalid credentials' });
// 	  }
// 	  console.log('here')
// 	  const token = generateJWTToken(user);
// 	  console.log(token)
// 	  return res
// 		.status(200)
// 		.cookie("access_token", token, {
// 		  httpOnly: true,
// 		  secure: process.env.NODE_ENV === "production",
// 		})
// 		.json({
// 		  status: true,
// 		  success: "SendData",
// 		  token: token,
// 		});
// 	})(req, res, next); // <-- Wrap passport.authenticate with (req, res, next)
//   });

// router.post('/logout', (req, res) => {
// 	req.logout((err) => {
// 	  if (err) {
// 		console.error('Error during logout:', err);
// 		return res.status(500).json({ message: 'Logout error' });
// 	  }
// 	  res.status(200).json({ message: 'Logout successful' });
// 	});
//   });

// router.get("/google",passport.authenticate('google', { scope: ["profile", "email"] })
// );

// router.get(
// 	"/google/callback",
// 	passport.authenticate('google', { failureRedirect: "/login-failed" }),
// 	(req, res) => {
// 		console.log('here')
// 		const token = generateJWTToken(req.user);
// 		console.log(token)
// 		res.redirect('/')
// 		return res
// 		.status(200)
// 		.cookie("access_token", token, {
// 			httpOnly: true,
// 			secure: process.env.NODE_ENV === "production",
// 		})
// 		.json({
// 			status: true,
// 			success: "SendData",
// 			token: token,
// 		})
// 	}
// );

// router.get("/login-failed", (req, res) => {
// 	res.status(401).json({ message: "Login failed" });
// });

// const generateJWTToken = (user) => {
// 	let tokenData = {
// 		email: user.email,
// 		role: process.env.USER, // google signup only for users Not Admin
// 	};
// 	console.log(tokenData)
// 	const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
// 		expiresIn: process.env.JWT_EXPIRES_IN,
// 	});
// 	console.log(token)
// 	return token;
// 	// return res
// 	// 	.status(200)
// 	// 	.cookie("access_token", token, {
// 	// 		httpOnly: true,
// 	// 		secure: process.Env.NODE_ENV === "production",
// 	// 	})
// 	// 	.json({
// 	// 		status: true,
// 	// 		success: "SendData",
// 	// 		token: token,
// 	// 	});
// };

// export default router;

import express from "express";
import { Strategy as localStrategy } from "passport-local";
import { Strategy as googleStrategy } from "passport-google-oauth20";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import passport from "../config/passport-auth.js";
import { serialize } from "cookie";
import Cookies from "js-cookie";

const router = express.Router();

router.get(
	"/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
	})
);

router.get("/login/successful", (req, res) => {
	console.log("here");
	res.send('111')
});

router.get("/login/failed", (req, res) => {
	console.log("failure");
	console.log(req.user);
	res.cookie('access',"hello")
	res.send("2" + req.user);
});

// router.get('/google/callback',
// 	passport.authenticate('google', {
// 		session: false,
// 		successRedirect:'/auth/login/successful',
// 		failureRedirect: '/login/failed' }),
// 		function(req,res){
// 			console.log('here')
// 			console.log(req.user)
// 			res.send('3' + req)
// 		}
// );

router.get(
	"/google/callback",
	passport.authenticate("google", {
		session: false,
	}),
	function (req, res) {
		const token = generateJWTToken(req.user);
		console.log(token);

		// const obj = res
		// 	.status(200)
		// 	.cookie("access_token", token, {
		// 		httpOnly: true,
		// 		secure: process.env.NODE_ENV === "production",
		// 	})
		// 	.json({
		// 		status: true,
		// 		success: "SendData",
		// 		token: token,
		// 	});
		console.log('helo');
		// res.cookie("access_token", token)
		
		// const tmp = serialize("access_token", token, {
		// 	domain: ".vercel.app",
		// 	sameSite: "None",
		// 	httpOnly: true,
		// });
		res.cookie("access_token", token, {
			sameSite: "Lax",
			httpOnly: true,
		})
		// // res.setHeader("access_token", token);S
		// Cookies.set("access_token", token, {
		// 	domain: ".vercel.app",
		// 	path: "/",
		// 	sameSite: "None",
		// 	httpOnly: false,
		// });
		res.setHeader('access_token', token)
		// res.redirect('http://localhost:3000/success')
		// res.redirect('/auth/login/successful')
		res.redirect("https://producthunt-frontend.vercel.app/success");
	}
);

router.post("/signup/local", async (req, res) => {
	// signup for non-admin users
	const { email, password } = req.body;
	try {
		const user = await User.create({
			email: email,
			password: password,
			role: process.env.USER || "user",
		});
		let tokenData = {
			email: user.email,
			role: user.role,
		};
		console.log(tokenData);
		const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES_IN,
		});

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
			});
		// res.cookie("access_token", token, {
		// 	httpOnly: true,
		// 	secure: process.env.NODE_ENV === "production",
		// })
		// // res.redirect('https://producthunt-frontend.vercel.app/success')
		// res.redirect('http://localhost:3000/success')
	} catch (err) {
		return res.status(400).json({ message: err.message + err.stack });
	}
});

router.post("/signupadmin/local", async (req, res) => {
	// signup for admin
	const { email, password } = req.body;
	try {
		user = await User.create({
			email: email,
			password: password,
			role: process.env.ADMIN,
		});
	} catch (err) {
		throw new Error("Error creating user");
	}

	let tokenData = {
		email: user.email,
		role: user.role,
	};

	const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

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
		});
});

router.post("/login/local", (req, res, next) => {
	console.log("local");
	passport.authenticate("local", (err, user) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}
		console.log("here");
		const token = generateJWTToken(user);
		console.log(token);
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
			});
		// res.cookie("access_token", token, {
		// 	httpOnly: true,
		// 	secure: process.env.NODE_ENV === "production",
		// })
		// // res.redirect('https://producthunt-frontend.vercel.app/success')
		// res.redirect('http://localhost:3000/success')
	})(req, res, next); // <-- Wrap passport.authenticate with (req, res, next)
});

const generateJWTToken = (user) => {
	let tokenData = {
		email: user.email,
		role: process.env.USER, // google signup only for users Not Admin
	};
	console.log(tokenData);
	const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
	console.log(token);
	return token;
};

export default router;
