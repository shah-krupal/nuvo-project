import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import { Strategy as googleStrategy } from "passport-google-oauth20";
import User from "../models/user.js";
import session from "express-session";



passport.use(new localStrategy((username, password, done) => {
    usernamefield = email;
},async (username, password, done) => {
    try {
        const user = await User.findOne({ where: { email: username } });
        if (!user) return done(null, false);
        const validate = await bcrypt.compare(password, user.password);
        if (!validate) return done(null, false);
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));


passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if a user with the Google ID exists in your database
      let user = await User.findOne({ googleId: profile.id });
  
      if (!user) {
        // Create a new user with Google ID
        user = new User({
            email: profile.emails[0].value,
            username: profile.name.givenName,
            role: 'user',
            googleId: profile.id
        });
        await user.save();
      }
  
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  // serialize the user for the session
passport.serializeUser((user, done) => {
    done(null, user.id)
})

  // deserialize the user
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
})
 