var utils    = require("../../utils");
    services = require("../../services");

module.exports = {

    getUsers : function (req, res) {
        utils.sendStandardResponse(res, services.users, "getUsers");
    },

};