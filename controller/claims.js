const BlueBird = require('bluebird');

var getClaimsList = function () {
    return BlueBird.resolve(
        [
            {
                name: "claim1",
                id: "id1"
            },
            {
                name: "claim2",
                id: "id2"
            }
        ]
    );
};

var getClaimDetails = function () {
    return BlueBird.resolve(
        {
            name: "claim2",
            id: "id1"
        }
    );
};

module.exports = {
    getClaimDetails: getClaimDetails,
    getClaimsList: getClaimsList
};