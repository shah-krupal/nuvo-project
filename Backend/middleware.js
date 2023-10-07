import jwt from "jsonwebtoken";
import Person from "./models/person.js";

export const isLoggedin = async (req, res, next) => {
	const token = req.headers.authorization.split(' ')[1];
  	if (!token) {
    	// No 'access_token' cookie found, throw an error
    	return res.status(401).send('No token, authorization denied');
  	}
	try {
		const data = jwt.verify(token, process.env.JWT_SECRET);
		try{
			const person = await Person.findByPk(data.email);
			if(!person){
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

export const isAdmin = (req, res, next) => {
	try {
		if (req.role != "ADMIN" && req.role != "admin") {
			return res.status(401).send('Not an admin');
		}
		return next();
	} catch (err) {
		return res.status(500).send("Forbidden");
	}
};
