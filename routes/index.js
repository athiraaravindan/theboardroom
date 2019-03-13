
var express = require('express');
var router = express.Router();
const app = express(),
    passport = require('passport'),
    auth = require('./../auth'),
    fbAuth = require('./../auth');
const userService = require('../service/user.service')
const hostPinService = require('../service/host_pin.service')
const jwt = require('jsonwebtoken');

var TOKENSECRET = process.env.TOKENSECRET;
var BR_JWTSECRET = process.env.BR_JWTSECRET;
var APP_URL = process.env.APP_URL;

var FB_ID = process.env.FB_ID;
var FB_SECRET = process.env.FB_SECRET;
var FB_CALLBACK_URL = process.env.FB_CALLBACK_URL;

var IN_ID = process.env.IN_ID
var IN_SECRET = process.env.IN_SECRET
var IN_CALLBACK_URL = process.env.IN_CALLBACK_URL


const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

router.get('/test', function(req, res, next) {
    res.json({"testing":"success"})
})
router.get('/generateToken', async function(req, res, next) {
    var user ={
      app:'theboardroom'
    }
  console.log(user,"fgfgfgfgffgfffgf")
    let token = await generateToken(user)
      res.status(200).json({token:token})
      function generateToken(user) {
      return new Promise((resolve, reject) => {
        let payload = {  
          aud:1,
          name: TOKENSECRET, 
          role: 1,
        };
        jwt.sign(payload, BR_JWTSECRET, function (err, token) {
          if(err) reject(err);
          let response = { token: token};
          resolve(response);
        });
      });
    }
  });
// ........................siginin with google start.......................//
auth(passport);
router.use(passport.initialize());

router.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email']
}));

router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/'
    }),
    async function (req, res) {
        // console.log(req.user)
        var user = req.user.profile;
        let GmailUsers = {
            socialID: user.id,
            name: user.displayName,
            profilePictureUrl: user.photos[0].value,
            emailAddress: user.emails[0].value,
            login_type: "google"
        }
        console.log(GmailUsers);
        let oldUser = await userService.getUser({ socialID: GmailUsers.socialID });
        let checkGmail = await userService.getUser({ emailAddress: GmailUsers.emailAddress });
        if (checkGmail != null) {
            res.redirect(APP_URL + checkGmail._id );
        }
        else if (oldUser) {
            res.redirect(APP_URL + oldUser._id );
        }
        else {
            let host = await hostPinService.getHost()
            if (host) {
                let hostPin = host.hostPin;
                // let newUser = await userService.createUser(inUsers)
                GmailUsers.hostPin = hostPin + 1
                await hostPinService.updateHost({
                    $set:
                    {
                        hostPin: hostPin + 1
                    }
                })
            }
            else if (host == null) {
                host = await hostPinService.createHost()
            }
            let newUser = await userService.createUser(GmailUsers)
            if (newUser) {
                console.log("successfully saved to db")
                res.redirect(APP_URL + newUser._id);
            }
        }
        res.status(200).json({ success: 1, response: GmailUsers })
        req.session.token = req.user.token;
    }
);
// ........................siginin with google end.......................//
// ........................siginin with fb begin.......................//

var FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: FB_ID,
    clientSecret: FB_SECRET,
    callbackURL: FB_CALLBACK_URL
},
    async function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));
fbAuth(passport);
router.use(passport.initialize());

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/users'
    }),
    async function (req, res) {
        console.log(req,"facebook")
        let fbUsers = {
            socialID: req.user.id,
            name: req.user.displayName,
            profilePictureUrl: 'https://graph.facebook.com/' + req.user.id + '/picture?type=square',
            login_type: "fb"

        }
        console.log(fbUsers, "fbUsers");
        let oldUser = await userService.getUser({ socialID: fbUsers.socialID });
        if (oldUser)
            res.redirect(APP_URL + oldUser._id );
        if (!oldUser) {
            let host = await hostPinService.getHost()
            if (host) {
                let hostPin = host.hostPin;
                // let newUser = await userService.createUser(inUsers)
                fbUsers.hostPin = hostPin + 1
                await hostPinService.updateHost({
                    $set:
                    {
                        hostPin: hostPin + 1
                    }
                })
            }
            else if (host == null) {
                host = await hostPinService.createHost()
            }
            let newUser = await userService.createUser(fbUsers)
            if (newUser) {
                res.redirect(APP_URL + newUser._id);
                console.log("successfully saved to db")
            }
        }
        res.status(200).json({ success: 1, response: fbUsers })

    })
// ........................siginin with fb end.......................//
// ........................siginin with linkedin start.......................//

var LinkedInStrategy = require('passport-linkedin').Strategy;
const session = require('express-session');
// After you declare "app"
router.use(session({ secret: 'abcde', resave: false, saveUninitialized: true, }));
router.use(passport.initialize());
router.use(passport.session());
passport.use(new LinkedInStrategy({
    consumerKey: IN_ID,
    consumerSecret: IN_SECRET,
    callbackURL: IN_CALLBACK_URL,
    profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline', 'picture-url'],
    scope: ['r_emailaddress', 'r_basicprofile', 'rw_nus']
},
    function (token, tokenSecret, profile, done) {
        return done(null, profile);
    }

));

router.get('/auth/linkedin',
    passport.authenticate('linkedin', { scope: ['r_basicprofile', 'r_emailaddress'] }));

router.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', { failureRedirect: '/login' }),
    async function (req, res) {
        //   console.log(req.user._json)
        let inUsers = {
            emailAddress: req.user._json.emailAddress,
            socialID: req.user._json.id,
            name: req.user._json.firstName + ' ' + req.user._json.lastName,
            profilePictureUrl: req.user._json.pictureUrl,
            login_type: "linkedin"

        }
        // console.log(inUsers,"inUsers");
        let oldUser = await userService.getUser({ socialID: inUsers.socialID });
        let checkGmail = await userService.getUser({ emailAddress: inUsers.emailAddress });
        console.log(checkGmail)
        if (checkGmail != null) {
            res.redirect(APP_URL + checkGmail._id );
        } else if (oldUser)
            res.redirect(APP_URL + oldUser._id );
        else if (!oldUser) {
            let host = await hostPinService.getHost()
            if (host) {
                let hostPin = host.hostPin;
                // let newUser = await userService.createUser(inUsers)
                inUsers.hostPin = hostPin + 1
                await hostPinService.updateHost({
                    $set:
                    {
                        hostPin: hostPin + 1
                    }
                })
            }
            else if (host == null) {
                host = await hostPinService.createHost()
            }
            let newUser = await userService.createUser(inUsers)
            res.redirect(APP_URL + newUser._id );
            if (newUser) {
                console.log("successfully saved to db")
            }
        }
        res.status(200).json({ success: 1, response: inUsers })
    });
// ........................siginin with linkedin end.......................//






router.post('/add_to_calender', async function(req, res, next) {
   
})


module.exports = router;
