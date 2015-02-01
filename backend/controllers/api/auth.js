var utils  = require("../../utils");
    consts = require("../../utils/consts");

module.exports = {

    login  : function (req, res) {
        var error, response;

        error    = utils.makeResponse(500, consts.ERROR.UNKNOWN);
        response = utils.makeResponse(200, {
            username : req.user && req.user.username, 
            role     : req.user && req.user.role
        });

        if (req.loginError)
            res.status(req.loginError.code).json(req.loginError);
        else if (req.user)
            res.status(200).json(response);
        else
            res.status(500).json(error);
    },

    logout : function (req, res) {
        try {
            req.logout();
            res.status(200).json(utils.makeResponse(200, consts.SUCCESS.LOGOUT));
        } catch (e) {
            res.status(500).json(utils.makeResponse(500, consts.ERROR.SERVER));
        }
    }

};