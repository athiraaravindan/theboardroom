var express = require('express');
var router = express.Router();
// const app = express();
// var passport = require('passport');
// // var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// var GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
// // Use the GoogleStrategy within Passport.
// //   Strategies in Passport require a `verify` function, which accept
// //   credentials (in this case, an accessToken, refreshToken, and Google
// //   profile), and invoke a callback with a user object.
// app.use(passport.initialize());
// passport.use(new GoogleStrategy({
//   consumerKey: '256423486245-locbq95ajcodjqeles2dlsr85d5n5nho.apps.googleusercontent.com',
//   consumerSecret: 'iAGFP5ejDrRpboBm4RTMJKRY',
//   callbackURL: "http://localhost:3000/auth/google/callback"
// },
//   function (token, tokenSecret, profile, done) {
//     return done(null, {
//       profile: profile,
//       token: token
//   });
//   }
// ));
// router.get('/auth/google',
//   passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile'] }));

//   router.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function (req, res) {
//     console.log("gereeeeeeeee")
//     res.redirect('/');
//   });



module.exports = router;
