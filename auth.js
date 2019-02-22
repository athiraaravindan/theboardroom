const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function (passport) {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    passport.use(new GoogleStrategy({
        clientID: '256423486245-locbq95ajcodjqeles2dlsr85d5n5nho.apps.googleusercontent.com',
        clientSecret: 'iAGFP5ejDrRpboBm4RTMJKRY',
        callbackURL: 'https://localhost:3000/auth/google/callback'
    }, (token, refreshToken, profile, done) => {
        // console.log(profile.id,profile.displayName,profile.name,profile.photos)
        // console.log(profile,".................................................................profile")
        // console.log(token,".................................................................token")

        return done(null, {
            profile: profile,
            token: token
        });
    }));
};
