const bodyParser = require('body-parser');

const express = require('express');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Dishes = require('../models/dishes');
const dishRouter = express.Router();

dishRouter.use(bodyParser.json());
//read all
dishRouter.get('/', (req, res, next) => {
  Dishes.find({})
    .then(
      (dishes) => {
        res.status(200).json(dishes);
        res.setHeader('Content-Type', 'application/json');
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

//read one by id
dishRouter.get('/:dishId', (req, res) => {
  Dishes.findById(req.params.dishId)
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(400).json('Error: ' + err));
});

//create
dishRouter.post('/', authenticate.verifyUser, (req, res) => {
  const newDish = new Dishes(req.body);
  newDish
    .save()
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(400).json('Error: ' + err));
});

//create second method

// dishRouter.post('/add', (req,res)=>{
//   Dishes.create(req.body)
//   .then(
//     (dish) => {
//       console.log('Dish Created ', dish);
//       res.statusCode = 200;
//       res.setHeader('Content-Type', 'application/json');
//       res.json(dish);
//     },
//     (err) => next(err)
//   )
//   .catch((err) => next(err));
// })

//Delete
dishRouter.delete('/:dishId', authenticate.verifyUser, (req, res) => {
  Dishes.findByIdAndDelete(req.params.dishId, (err) => {
    if (err) {
      res.status(400).json('Error: ' + err);
    } else {
      res.status(200).json('response is deleted successfully');
    }
  });
});
// //delete second method
// dishRouter.delete('/:id', (req, res) => {
//   Dishes.findByIdAndDelete(req.params.id)
//     .then((response) => res.status(200).json(response))
//     .catch((err) => res.status(400).json('Error: ' + err));
// });

// //update good but fiha mochkil
// dishRouter.put('/:id', (req, res) => {
//   Dishes.findByIdAndUpdate(
//     { _id: req.params.id },
//     req.body,
//     {
//       runValidators: true,
//     },
//     (err, res) => {
//       if (err) {
//         res.status(400).json('Error: ' + err);
//       } else {
//         res.status(200).json('response is updated successfully');
//       }
//     }
//   );
// });

// //update second method
dishRouter.put('/:dishId', authenticate.verifyUser, (req, res) => {
  Dishes.findByIdAndUpdate(
    req.params.dishId,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(400).json('Error: ' + err));
});
////////////////////////////////////////////////
// now the sub comment CRUD

//read comments
dishRouter
  .route('/:dishId/comments')
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
          } else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null) {
            dish.comments.push(req.body);
            dish.save().then(
              (dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
              },
              (err) => next(err)
            );
          } else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      'PUT operation not supported on /dishes/' +
        req.params.dishId +
        '/comments'
    );
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null) {
            for (var i = dish.comments.length - 1; i >= 0; i--) {
              dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save().then(
              (dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
              },
              (err) => next(err)
            );
          } else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

dishRouter
  .route('/:dishId/comments/:commentId')
  .get((req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
          } else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
          } else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      'POST operation not supported on /dishes/' +
        req.params.dishId +
        '/comments/' +
        req.params.commentId
    );
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if (req.body.rating) {
              dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
              dish.comments.id(req.params.commentId).comment = req.body.comment;
            }
            dish.save().then(
              (dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
              },
              (err) => next(err)
            );
          } else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
          } else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        (dish) => {
          if (dish != null && dish.comments.id(req.params.commentId) != null) {
            dish.comments.id(req.params.commentId).remove();
            dish.save().then(
              (dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
              },
              (err) => next(err)
            );
          } else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
          } else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = dishRouter;
