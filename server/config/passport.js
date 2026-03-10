import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import passport from "passport";

// Ek function banayein jo app.js se call hoga
const configurePassport = () => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/user/google/back" // Route check karlein (app.js mein /user prefix hai)
      },
      async ( accessToken, refreshToken,profile, done) => {
        try {
            let user = await User.findOne({ email: profile.emails[0].value });
    
            if (user) {
                if (!user.googleId) {
                    user.googleId = profile.id;
                    user.avatar = profile.photos[0].value;
                    user.isEmailVerified = true;
                    await user.save({ validateBeforeSave: false });
                }
                return done(null, user);
            }
    
            user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                avatar: profile.photos[0].value,
                isEmailVerified: true,
            });
    
            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
      }
    ));
}

export default configurePassport;