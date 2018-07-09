'use strict'

module.exports = {
    // error code should be as the following
    // ERR_NAME : {'status': HttpStatus, 'code': 'Error Code', 'message': 'Error Message Details'}
    // server error code details
    SERVER : {
        GENERIC_ERROR : {'status': 500, 'code': 'SER001', 'message': 'Internal server error.'},
        DB_NOT_CONNECTED : {'status': 500, 'code': 'SER002', 'message': 'Unable to connect to the database.'},
        QUERY_ERROR : {'status': 500, 'code': 'SER004', 'message': 'Internal server error.'},
        INVALID_ACCESS_TOKEN : {'status': 401, 'code': 'SER006', 'message': 'Invalid or no access token.'},
        TOKEN_EXPIRED : {'status': 400, 'code': 'SER007', 'message': 'Authorization token has expired.'},
        UNAUTHORIZED_ACCESS : {'status': 401, 'code': 'SER008', 'message': 'Unauthorized'},
        PERMISSION_DENIED : {'status': 403, 'code': 'SER013', 'message': 'Access is denied.'},
        PROFILE_CHANGED : {'status': 401, 'code': 'SER017', 'message': 'You have been logged out, please login again.'}
    },
    // function set the error details into the response
    setErrorDetails: function(res, err) {
        res.status(err.status);
        res.json({'code': err.code, 'message': err.message});
    }
};
