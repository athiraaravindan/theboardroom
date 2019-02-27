var createError = require('http-errors');
const debug = require('debug')('boardroom:app');
var path = require('path');
var logger = require('morgan');
const cors = require('cors');
const ejwt = require('express-jwt');
const userService = require('./service/user.service')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/BoardRooM')
  .then(() => { debug("Successfully connected to MongoDB") })
  .catch((err) => { console.error(err) });

//gapi*****************************************************************
const express = require('express');
  const app = express();
//     passport = require('passport'),
//     auth = require('./auth'),
//     cookieParser = require('cookie-parser'),
//     cookieSession = require('cookie-session');

// auth(passport);
// app.use(passport.initialize());

// app.use(cookieSession({
//     name: 'session',
//     keys: ['SECRECT KEY'],
//     maxAge: 24 * 60 * 60 * 1000
// }));
// app.use(cookieParser());

// app.get('/', (req, res) => {
//     if (req.session.token) {
//         res.cookie('token', req.session.token);
//         res.json({
//             status: 'session cookie set'
//         });
//     } else {
//         res.cookie('token', '')
//         res.json({
//             status: 'session cookie not set'
//         });
//     }
// });

// app.get('/logout', (req, res) => {
//     req.logout();
//     req.session = null;
//     res.redirect('/');
// });

// app.get('/auth/google', passport.authenticate('google', {
//     scope: ['https://www.googleapis.com/auth/userinfo.profile']
// }));

// app.get('/auth/google/callback',
//     passport.authenticate('google', {
//         failureRedirect: '/'
//     }),
//     (req, res) => {
//       var user = req.user.profile;
//       let GmailUsers ={
//         socialID    : user.id,
//         name : user.displayName,
//         profilePictureUrl : user.photos[0].value
//       }
//       console.log(GmailUsers);
//         let gg = userService.createUser(GmailUsers)
//         if(gg){
//           console.log("successfully saved to db")
//           res.redirect('http://localhost:4200/dashboard');
//         }
//         req.session.token = req.user.token;
//     }
// );
//gapi***************************************************************************
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var meetingRouter = require('./routes/meetings');

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors(corsOptions));
// app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', ejwt({ 
  secret: "TW_JWTSECRET",
  audience: [1,2,3],
  algorithm: 'HS256'
  // issuer: 'https://localhost:3000/'
}).unless({path: ['/generateToken']}), usersRouter);
app.use('/', indexRouter);
app.use('/meeting', meetingRouter);
// app.use('/users', usersRouter);

// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
