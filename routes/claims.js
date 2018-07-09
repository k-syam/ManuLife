var express = require('express');
var router = express.Router();

var claimsController = require('../controller/claims');

/* GET claims list. */
router.get('/list', function(req, res, next) {
    claimsController.getClaimsList()
        .then((resDocs) => {
            if (resDocs) {
                res.json(resDocs)
            } else {
                res.send("No claims found");
            }
        })
        .catch((err) => {
            console.log("err:", err);
            res.send("No claims found");
        });
});
/* GET claim details. */
router.get('/details', function(req, res, next) {
    claimsController.getClaimDetails()
        .then((resDocs) => {
            if (resDocs) {
                res.json(resDocs)
            } else {
                res.send("No claim found");
            }
        })
        .catch((err) => {
            console.log("err:", err);
            res.send("No claim found");
        });
});

module.exports = router;