const express = require('express');
const bodyParser = 'body-parser';
const User = require('../models/user');
const passport = require('passport');

const usersRouter = express.Router();

//get users listing
usersRouter.get('/', (req, res, next) => {
  res.send('responde with resourse');
});

////sign-up or register

usersRouter.post('/signup', (req, res, next) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      } else {
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: true, status: 'Registration Successful!' });
        });
      }
    }
  );
});
//login
usersRouter.post('/login', passport.authenticate('local'), (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, status: 'You are successfully logged in!' });
});

/////logout
usersRouter.get('/logout', (req, res, next) => {
  if (req.session) {
    //if loggin in
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    //if no logging in
    var err = new Error('you are not logged in');
    res.status(403);
    next(err);
  }
});

module.exports = usersRouter;
