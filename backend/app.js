var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
var authRouter = require('./routes/auth');
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api/index');
const fileUpload = require('express-fileupload');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});


app.use(bodyParser.urlencoded({
  limit: "50mb",
  extended: true,
  parameterLimit: 10000,
}));
app.use(bodyParser.json({ limit: "50mb" }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

app.use(cors({
  origin: '*'
}));


app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //UnauthorizedError
  if (err.name === "UnauthorizedError") {
    return res.status(401).send({ message: "WRONG_TOKEN" });
  }

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
