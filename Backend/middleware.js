import jwt from "jsonwebtoken";

export const isLoggedin = (req, res, next) => {
	console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
	console.log(req.body)
	const token = req.cookies.access_token;
	console.log(token)
	try {
		if (!token) {
			throw new Error("No token, authorization denied");
		}
		const data = jwt.verify(token, process.env.JWT_SECRET);
		req.email = data.email;
		return next();
	} catch (err) {
		throw new Error("Error verifying token");
	}
};

export const isAdmin = (req, res, next) => {
	try {
		if (req.role != "ADMIN" && req.role != "admin") {
			throw new Error("Not an admin");
		}
		return next();
	} catch (err) {
		console.log(err);
		return res.status(500).send("Forbidden");
	}
};
