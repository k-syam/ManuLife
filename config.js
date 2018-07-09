'use strict';

module.exports = {
    // application server port
    PORT : ( process.env.NODE_ENV === 'PROD' || process.env.NODE_ENV === 'DEV' ) ? (process.env.API_PORT || 8080) : 9080,
    // Database constants
    DB : {
        URL :  process.env.MONGODB_URL || ''
    }
};