import express from "express";
import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import { Strategy as googleStrategy } from "passport-google-oauth20";

const router = express.Router();

router.post("/login", (req, res, next) => {
	passport.use(
		new localStrategy(
			{
				usernameField: "email",

				passwordField: "password",

				passReqToCallback: true,
			},
			function (req, username, password, done) {
				User.findOne({ email: username }, function (err, user) {
					if (err) {
						return done(err);
					}
					if (!user) {
						return done(null, false, {
							message: "Incorrect username.",
						});
					}
					if (!user.validPassword(password)) {
						return done(null, false, {
							message: "Incorrect password.",
						});
					}
					return done(null, user);
				});
			}
		)
	);
});

router.get("/logout", (req, res) => {
	req.logout();
	res.send("Successfully logged out");
});

router.get("/google",passport.authenticate("googleStrategy", { scope: ["profile", "email"] })
);

router.get(
	"/google/callback",
	passport.authenticate("googleStrategy", { failureRedirect: "/login-failed" }),
	(req, res) => {
		const token = generateJWTToken(req.user);
		res.status(200).json({ token });
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
