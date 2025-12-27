const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { userModel } = require('../models/user.model');
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/user/auth/google/callback" 
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user exists
        let user = await userModel.findOne({ email: profile.emails[0].value });
        
        if (!user) {
            // Create new user if not exists
            user = await userModel.create({
                username: profile.displayName,
                email: profile.emails[0].value,
                password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8), // Search-resistant random password
                googleId: profile.id,
                googleAccessToken: accessToken,
                googleRefreshToken: refreshToken
            });
        } else {
            // Update existing user tokens
            user.googleAccessToken = accessToken;
            if (refreshToken) {
                user.googleRefreshToken = refreshToken;
            }
            await user.save();
        }
        
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));
module.exports = passport;