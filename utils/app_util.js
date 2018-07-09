'use strict'

const _ = require('lodash');

const GENERAL_ERROR = {'code': 'SER000', 'message': 'Internal server errror.'};
const CST_DATE_CONVERT = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'America/Chicago', timeZoneName: 'short'};
const US_TIME_ZONE = 'en-US';
const CHICAGO_TIME = { timeZone: "America/Chicago"};
 // The number of milliseconds in one day
const ONE_DAY = 1000 * 60 * 60 * 24;
// The number of milliseconds in one hour
const ONE_HOUR = 1000 * 60 * 60;
const ONE_MINUTE = 1000 * 60;

//get header value be key
function getHeaderValueByKey(headers, key) {
    if (!headers || !key)   return null;
    //convert key to lower case
    const keyName = _.toLower(key);

    return headers[keyName];
}

// function set the error details into the response
function  setErrorDetailsInResponse (res, err) {
    res.set('Content-Type', 'application/json');
    if ( err.status ) {
        res.status(err.status);
        
        var errObj = {'code': err.code, 'message': err.message};
        // set error details
        if ( err.details )  errObj.details = err.details;
        
        res.json(errObj);
    } else {
        res.status(500);
        res.json(GENERAL_ERROR);
    }
}

// construct error object
function buildErrorDetails (errCode, err ) {
    var error = errCode;
    error.details = err;
    return error;
}

// transform mongodb cursor reference object to JSON object
// function transformRefCursorObjectToJson (objRef) {
//     if (!objRef)   return '';
//     if (objRef['_bsontype'] && objRef['_bsontype'] === 'DBRef') {
//         //Since DBRef object, mongo db value should as follows as:
//         //objRef._bsontype - Mongodb object type, objRef.namespace - Collection name,
//         //objRef.oid - ID of refrence object, objRef.db - DB name
//         return {'$ref': objRef.namespace, '$id': objRef.oid, '$db': objRef.$db};
//     }

//     return objRef;
// }

function convertUtcDateToLocaleDateStringValue(date) {
    var dateStr = '';

    if ( date && _.isDate(date)) {
        dateStr = date.toLocaleDateString(US_TIME_ZONE, CST_DATE_CONVERT);
        dateStr = dateStr.replace(/, /g, '(') + ')';
    }

    return dateStr;
}

function removeExtraSpacesToSingleSpace(value) {
    if( _.isString(value))  return value.replace(/ +(?= )/g,'');
    return value;
}

function convertUtcDate(date) {
    var today;
    if (date) today = new Date(date);
    else    today = new Date();
    return new Date(today.toUTCString());
}

function getUtcDateByValues(date, year, month, dt, hours, mins, secs) {
    var today;

    if (date) today = new Date(date);
    else    today = new Date();
    //set given values
    if (year)   today.setFullYear(_.parseInt(year));
    if (month)   today.setMonth(_.parseInt(month));
    if (dt)   today.setDate(_.parseInt(dt));

    today.setHours(_.parseInt(hours || 0));
    today.setMinutes(_.parseInt(mins || 0));
    today.setSeconds(_.parseInt(secs || 0));

    return new Date(today.toUTCString());
}

function calculateDaysBetweenTwoDates(date1, date2) {
    // Calculate the difference in milliseconds
    var difference_ms = calculateTimeBetweenTwoDates(date1, date2)
    // Convert back to days and return
    return Math.round(difference_ms/ONE_DAY)+1;
}

function calculateMonthsBetweenTwoDates(date1, date2) {
    const dt1 = convertUtcDate(date1);
    const dt2 = convertUtcDate(date2);
    //calclulate the months irrespective of signs
    return Math.abs((dt1.getUTCMonth() - dt2.getUTCMonth()) + (12 * (dt1.getUTCFullYear() - dt2.getUTCFullYear())));
}

function formatDateToString(date, format) {
    const dt = date || new Date();
    var fmtDt = new Intl.DateTimeFormat(US_TIME_ZONE, format).format(dt);
    //replace , with space
    if(fmtDt)    fmtDt = fmtDt.replace(/[,]/, '');
    //return  dt.toLocaleDateString(US_TIME_ZONE, format);
    return  fmtDt;
}

function calculateHoursBetweenTwoDates(date1, date2) {
    var difference_ms = calculateTimeBetweenTwoDates(date1, date2)
     // Convert back to days and return
     return Math.round(difference_ms/ONE_HOUR);
}

function calculateMinutesBetweenTwoDates(date1, date2) {
    var difference_ms = calculateTimeBetweenTwoDates(date1, date2)
     // Convert back to days and return
     return Math.round(difference_ms/ONE_MINUTE);
}

function calculateTimeBetweenTwoDates(date1, date2) {
    var date1_ms = new Date(date1).getTime();
    var date2_ms = new Date(date2).getTime();
    // Calculate the difference in milliseconds
    return Math.abs(date1_ms - date2_ms);
}


module.exports = {
    getHeaderValue : (headers, key) => getHeaderValueByKey(headers, key),
    // function set the error details into the response
    setErrorDetails: function(res, err) {
        setErrorDetailsInResponse(res, err);
    },
    getErrorDetails : function(errCode, err) {
       return buildErrorDetails(errCode, err);
    },
    // get utc date
    getUtcDate: function (date) {
        return convertUtcDate(date);
    },
    getUtcDateWithCustomValues : function(date, year, month, dt, hours, mins, secs) {
        return getUtcDateByValues(date, year, month, dt, hours, mins, secs);
    },
    calculateMonthsBetweenDates : function(date1, date2) {
        return calculateMonthsBetweenTwoDates(date1, date2);
    },
    calculateHoursBetweenDates : function(date1, date2) {
        return calculateHoursBetweenTwoDates(date1, date2);
    },
    calculateMinutesBetweenDates : function(date1, date2) {
        return calculateMinutesBetweenTwoDates(date1, date2);
    },
    setTimeExpiration: function(hrs){
        let ttl = parseInt(hrs, 10);
        var today = new Date();
        var hour = (new Date(today.toUTCString())).getHours();
        var retval=new Date(new Date().setHours(hour + ttl));
        return retval;
    },
    calculateDayBetweenDates: function(date1, date2){
        return calculateDaysBetweenTwoDates(date1, date2);
    }, 
    convertUtcDateToLocaleDateString: function(date) {
        return convertUtcDateToLocaleDateStringValue(date);
    },
    removeExtraSpaces: function (value) {
        return removeExtraSpacesToSingleSpace(value);
    },
    formatDate: function(date, format) {
        return formatDateToString(date, format);
    },
    getLocaleTimeZoneDate(date) {
        return new Date(date.toLocaleString(US_TIME_ZONE, CHICAGO_TIME));
    }
};