import jwt from "jsonwebtoken";
import Person from "./models/person.js";
import User from "./models/user.js";

export const isLoggedin = async (req, res, next) => {
	if (!req.headers.authorization) {
		return res.status(401).send('Unauthorized: Missing authorization header' );
	  }
	const token = req.headers.authorization.split(' ')[1];
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
	if (!req.headers.authorization) {
		return res.status(401).send('Unauthorized: Missing authorization header' );
	  }
	const token = req.headers.authorization.split(' ')[1];
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
		if (req.role != "ADMIN" && req.role != "admin") {
			return res.status(401).send('Not an admin');
		}
		return next();
	} catch (err) {
		return res.status(401).send('Error verifying token');
	}
};
