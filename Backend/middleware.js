import jwt from "jsonwebtoken";
import Person from "./models/person.js";
import User from "./models/user.js";

export const isLoggedin = async (req, res, next) => {
	if (!req.headers.authorization) {
		return res.status(401).send('Unauthorized: Missing authorization header' );
	  }
	const token = req.headers.authorization.split(' ')[1];
	console.log(token)
  	if (!token) {
    	// No 'access_token' cookie found, throw an error
    	return res.status(401).send('No token, authorization denied');
  	}
	try {
		const data = jwt.verify(token, process.env.JWT_SECRET);
		try{
			const user = await User.findByPk(data.email);
			if(!user){
				return res.status(401).send('User not found');
			}
		}catch(err){
			return res.status(401).send('User not found');
		}
		req.email = data.email;
		return next();
	} catch (err) {
		return res.status(401).send('Error verifying token');
	}
};

export const isAdmin = async (req, res, next) => {
	console.log(1)
	if (!req.headers.authorization) {
		return res.status(401).send('Unauthorized: Missing authorization header' );
	}
	console.log(2)
	const token = req.headers.authorization.split(' ')[1];
	console.log(token)
  	if (!token) {
    	// No 'access_token' cookie found, throw an error
    	return res.status(401).send('No token, authorization denied');
  	}
	console.log(3)
	try{
		const data = jwt.verify(token, process.env.JWT_SECRET,{algorithms:'HS256'});
		console.log("SSSSSSSSSSSSUUUUUUUUUUUCCCCCCCCCCCCCCCCCEEEEEEEEEEEEESSSSSSSSSSSSSSs")
		console.log(data);
		try{
			const user = await User.findByPk(data.email);
			if(!user){
				return res.status(401).send('User not found');
			}
		}catch(err){
			return res.status(401).send('User not found');
		}
		req.email = data.email;
		console.log(data.role)
		if ((data.role != "ADMIN" && data.role != "admin")) {
			return res.status(401).send('Not an admin');
		}
		return next();
	} catch (err) {
		return res.status(401).send('Error verifying token');
	}
};
