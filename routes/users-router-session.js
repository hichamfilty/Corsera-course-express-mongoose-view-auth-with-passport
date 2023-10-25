const express = require('express');
const bodyParser = 'body-parser';
const User = require('../models/user');

const router = express.Router();
app.use(bodyParser.json());

//get users listing
router.get('/', (req, res, next) => {
  res.send('responde with resourse');
});

////sign-up
router.post('/signup', (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user != null) {
        var err = new User('User ' + req.body.username + ' already exist');
        err.status = 403;
        next(err);
      } else {
        return User.create({
          username: req.body.username,
          password: req.body.password,
        });
      }
    })
    //when the user is signed up
    .then((user) => {
      res.setHeader('Content-Type', 'application/json');
      res
        .status(200)
        .json({ status: 'Registration Successful', user: user }, (err) =>
          next(err)
        );
    })
    .catch((err) => next(err));
});

//login
router.post('/login', (req, res, next) => {
  if (!req.session.user) {
    var authHeader = req.headers.authorization;
    if (!authHeader) {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err);
      return;
    }

    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64');

    var username = auth[0];
    var password = auth[1];

    User.findOne({ username: username })
      .then((user) => {
        if (user === null) {
          var err = new Error('User ' + username + ' do not exist');
          err.status = 403;
          next(err);
        } else if (user.password !== password) {
          var err = new Error('your password is incorrect');
          err.status = 401;
          next(err);
        } else if (user.username === username && user.password === password) {
          req.session.user = 'authenticated';
          // authorized
          res.setHeader(('Content-Type', 'text/plain'));
          res.status(200).end('you are authenticated!');
        }
      })
      .catch((err) => next(err));
  } else {
    //user session request do exist
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).end('you are already authenticated');
  }
});

/////logout
router.get('/logout', (req, res, next) => {
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

module.exports = router;
