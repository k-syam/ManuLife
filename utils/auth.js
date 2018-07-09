'use strict';
const BlueBird = require('bluebird');
const logger = require("./logging");
const error_codes = require('./error_codes');

//checking for user authentication
var authorize = function(req, res, next) {
  logger.info("this is authorize");
  //res.send(error_codes.SERVER.UNAUTHORIZED_ACCESS);
  next();
};

module.exports = (req, res, next) => authorize(req, res, next);