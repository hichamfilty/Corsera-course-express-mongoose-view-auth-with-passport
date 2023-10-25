const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyparser.json());

const dishRouter = require('./routes/dishRouter');
app.use('/dishes', dishRouter);

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
connect
  .then((db) => console.log('connected to mongodb database'))
  .catch((err) => console.log(err));

const port = process.env.PORT || 5000;

//catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
//error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env');

  //render error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`express server running on ${port}`);
});
