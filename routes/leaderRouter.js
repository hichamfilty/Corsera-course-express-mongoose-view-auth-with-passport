const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

const Leaders = require('../models/leaders');

const authenticate = require('../authenticate');

const leaderRouter = express.Router();

leaderRouter.use(bodyparser.json());

leaderRouter
  .route('/')
  .get((req, res, next) => {
    Leaders.find({})
      .then(
        (Leaders) => {
          res.statusCode = 200;
          res.setHeader('Content-type', 'application/json');
          res.json(Leaders);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Leaders.create(req.body)
      .then(
        (leader) => {
          console.log('Leader Created', leader);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('put operation not supported');
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Leaders.remove({})
      .then(
        (response) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(response);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

leaderRouter
  .route('/:leaderId')
  .get(authenticate.verifyUser, (req, res, next) => {
    Leaders.findById(req.params.leaderId)
      .then(
        (leader) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end('Post operation is not supported');
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Leaders.findByIdAndUpdate(
      req.params.leaderId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (leader) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(leader);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
      .then(
        (response) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(response);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
module.exports = leaderRouter;
