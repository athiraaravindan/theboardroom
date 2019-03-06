
var express = require('express');
var router = express.Router();
const app = express(),
    passport = require('passport'),
    auth = require('./../auth'),
    fbAuth = require('./../auth');
const userService = require('../service/user.service')
const jwt = require('jsonwebtoken');

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

router.get('/test', function(req, res, next) {
    res.json({"testing":"success"})
})
router.get('/generateToken', async function(req, res, next) {
    var user ={
      role:req.body.role,
      firstName:req.body.firstName,
      lastName:req.body.lastName
    }
  
    let token = await generateToken(user)
      res.status(200).json({token:token})
      function generateToken(user) {
      return new Promise((resolve, reject) => {
        let payload = {  
          aud:1,
          name: "(req.body.firstName + ' ' + req.body.lastName)", 
          role: 1,
        };
        jwt.sign(payload, "TW_JWTSECRET", function (err, token) {
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
            res.redirect('http://localhost:4200/dashboard/' + checkGmail._id + '/index');
        }
        else if (oldUser) {
            res.redirect('http://localhost:4200/dashboard/' + oldUser._id + '/index');
        }
        else {
            let newUser = await userService.createUser(GmailUsers)
            if (newUser) {
                console.log("successfully saved to db")
                res.redirect('http://localhost:4200/dashboard/' + newUser._id+ '/index');
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
    clientID: '390004128233317',
    clientSecret: 'dbea2f40a7c1233519e065eeb04b1adf',
    callbackURL: "https://localhost:3000/auth/facebook/callback"
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
        console.log(req,"pppppppppppppppppppppppppppppppppppp")
        let fbUsers = {
            socialID: req.user.id,
            name: req.user.displayName,
            profilePictureUrl: 'https://graph.facebook.com/' + req.user.id + '/picture?type=square',
            login_type: "fb"

        }
        console.log(fbUsers, "fbUsers");
        let oldUser = await userService.getUser({ socialID: fbUsers.socialID });
        if (oldUser)
            res.redirect('http://localhost:4200/dashboard/' + oldUser._id + '/index');
        if (!oldUser) {
            let newUser = await userService.createUser(fbUsers)
            if (newUser) {
                res.redirect('http://localhost:4200/dashboard/' + newUser._id + '/index');
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
    consumerKey: '86d1qf2ws4ccb4',
    consumerSecret: '7fFnoXLXmVTFbpDT',
    callbackURL: 'https://localhost:3000/auth/linkedin/callback',
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
            res.redirect('http://localhost:4200/dashboard/' + checkGmail._id + '/index');
        } else if (oldUser)
            res.redirect('http://localhost:4200/dashboard/' + oldUser._id + '/index');
        else if (!oldUser) {
            let newUser = await userService.createUser(inUsers)
            res.redirect('http://localhost:4200/dashboard/' + newUser._id + '/index');
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
