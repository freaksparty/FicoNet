var utils    = require("../../utils");
    services = require("../../services");

module.exports = {

    getUsers : function (req, res) {
        utils.sendStandardResponse(res, services.users, "getUsers", req.query.deleted);
    },

    getUser : function (req, res) {
        var id = req.params['user'];

        utils.sendStandardResponse(res, services.users, "getUser", id)
    },

    createUser : function (req, res) {
        var user = req.body;

        utils.sendStandardResponse(res, services.users, "createUser", user);
    },

    updateUser : function (req, res) {
        var id   = req.params['user'],
            user = req.body;

        utils.sendStandardResponse(res, services.users, "updateUser", id, false, user);
    },

    retrieveDeleteUser : function (req, res) {
        var id   = req.params['user'];

        utils.sendStandardResponse(res, services.users, "retrieveDeleteUser", id);
    },

    deleteUser : function (req, res) {
        var id   = req.params['user'];

        utils.sendStandardResponse(res, services.users, "removeUser", id);
    },

    hardDeleteUser : function (req, res) {
        var id   = req.params['user'];

        utils.sendStandardResponse(res, services.users, "hardRemoveUser", id);
    },

    getNewPasswordHash : function (req, res) {
        var email = req.body.email,
            host  = req.headers.host;

        utils.sendStandardResponse(res, services.users, "generateNewPasswordHash", email, host);
    },

    changePasswordWithCode : function (req, res) {
        var code     = req.params['code'],
            password = req.body.password;

        utils.sendStandardResponse(res, services.users, "changePassword", code, password, true);
    },

    changePassword : function (req, res) {
        var user     = req.params['user'],
            password = req.body.password;

        utils.sendStandardResponse(res, services.users, "changePassword", user, password, false);
    },

    changeRole : function (req, res) {
        var user = req.params['user'],
            role = req.body;

        utils.sendStandardResponse(res, services.users, "updateUser", user, true, role);
    }

};