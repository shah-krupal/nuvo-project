import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import { Strategy as googleStrategy } from "passport-google-oauth20";
import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

passport.use(new localStrategy({usernameField: 'email'}, async (email, password, done) => { 
  console.log('local')
    try {
      const user = await User.findOne({ where: { email: email } });
      if (!user) return done(null, false,{message: 'User not found'});
      const validate = await bcrypt.compare(password, user.password);
      if (!validate) return done(null, false,{message: 'Wrong Password'});
      return done(null, user);
    } catch (error) {
        return done(error);
    }
}))



passport.use(new googleStrategy({
    clientID: '752847050713-jkg2478vae1245abgmc34m963s2uvg6l.apps.googleusercontent.com',  //process.env.GOOGLE_CLIENT_ID,
    clientSecret: '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',   //process.env.GOOGLE_CLIENT_SECRET,
    // callbackURL: "http://localhost:3000/auth/google/callback",
    callbackURL:"https://nuvo-project.vercel.app/auth/google/callback",
    scope: ['profile', 'email'],
  }, async function (accessToken, refreshToken, profile, done) {
    try {
      // Check if a user with the Google ID exists in your database
      let user = await User.findOne({ where:{googleId: profile.id }});
  
      if (!user) {
        // Create a new user with Google ID
        user = new User({
            email: profile.emails[0].value,
            role: 'user',
            googleId: profile.id
        });
        console.log(user)
        const newuser = await user.save();
        console.log('newuser' + newuser)
      }
      console.log(user)
      const token = generateJWTToken(user);
      return done(null, user,token);
    } catch (err) {
      console.log(err)
      return done(err);
    }
  }));
 

  // serialize the user for the session
passport.serializeUser((user, done) => {
    done(null, user.email)
})

  // deserialize the user
passport.deserializeUser((email, done) => {
    const user = users.find((user) => user.email === email);

    if (!user) {
      return done(new Error('User not found'));
    }

    done(null, user);
})
 


// passport.use(
//   new localStrategy(
//     {
//       usernameField: "email",

//       passwordField: "password",

//       passReqToCallback: true,
//     },
//     function (req, username, password, done) {
//       User.findOne({ email: username }, function (err, user) {
//         if (err) {
//           return done(err);
//         }
//         if (!user) {
//           return done(null, false, {
//             message: "Incorrect username.",
//           });
//         }
//         if (!user.validPassword(password)) {
//           return done(null, false, {
//             message: "Incorrect password.",
//           });
//         }
//         return done(null, user);
//       });
//     }
//   )
// );

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

  

export default passport;