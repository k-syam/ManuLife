'use strict';

const express       = require('express');
const app           = express();
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
const logger        = require('./utils/logging');
const SERVER_ERROR  = require('./utils/error_codes').SERVER;
const fileUpload    = require('express-fileupload');
const config        = require('./config');
const app_util      = require('./utils/app_util');
const authorize     = require('./utils/auth');
//Routes Path configuration
var home            = require('./routes/home');
var claims          = require('./routes/claims');

app.use(bodyParser.json({limit:'5000kb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());

// Allow CORS
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    //res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    //res.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, OPTIONS, PUT, PATCH, DELETE');
//'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'
    // Request headers you wish to allow
    //res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, X-Requested-With, Content-Type, Authorization, x-api-key, x-pkyg-signature, x-pkyg-options');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);

    // logger.info('Request URL :'+( req.protocol + '://' + req.get('host') + req.originalUrl));
    // logger.info('Request Header :'+ JSON.stringify(req.headers));
    // Pass to next layer of middleware
    res.setHeader("Content-Type",'application/json');
    next();
});

app.use(authorize);

app.use('/', home);
app.use('/claims', claims);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  logger.error('app ===> URL is not found.');
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // set the error message
  app_util.setErrorDetails(res, err);
  next();
});

//start node server only if not in TEST environments
//for testing environment, new server instance will be created seperately
if (process.env.NODE_ENV !== 'TEST') {
  var server = app.listen(config.PORT);
  //logger.info('Server is started on '+ config.PORT);
  server.on('error', function(err){
    if (err.code == 'EADDRINUSE') {
      logger.info('Server is already running on  http://localhost:' + config.PORT);
    }
  });

  server.on('listening', function() {
      logger.info('Server is listening on http://localhost:' + config.PORT);
  });
}

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHTEXCEPTION : ', err.stack);
  //logger.error(err.stack);
  process.exit(1);
});

module.exports = app;
