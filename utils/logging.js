'use strict'

const winston = require('winston');

const winstonLogger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'manuLife.log' })
  ]
});

module.exports = {
  error: winstonLogger.error,
  warn: winstonLogger.warn,
  info: winstonLogger.info,
  debug: winstonLogger.debug
};