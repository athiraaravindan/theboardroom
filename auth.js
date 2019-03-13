const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var GOOGLE_ID = process.env.GOOGLE_ID;
var GOOGLE_SECRET = process.env.GOOGLE_SECRET;
var GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

module.exports = function (passport) {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_ID,
        clientSecret: GOOGLE_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL
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
