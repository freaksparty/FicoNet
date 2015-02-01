var utils  = require("../utils"),
    consts = require("../utils/consts");

module.exports = {
    login : function (req, res, next) {
        req.passport.authenticate("local-login")(req, res, next);
    },

    isAuthenticated : function (req, res, next) {
        var authError;

        authError = utils.makeResponse(401, consts.ERROR.AUTH_REQ);

        if(!req.isAuthenticated || !req.isAuthenticated())
            return res.status(401).json(authError);

        return next();
    },

    hasRoleAdmin : function (req, res, next) {
        var authError;

        authError = utils.makeResponse(403, consts.ERROR.ADMIN_REQ);

        if(req.isAuthenticated && req.isAuthenticated() 
            && req.user && (req.user.role === "admin" || req.user.role === "god"))
            return next();

        res.status(403).json(authError);
    },

    hasRoleGod : function (req, res, next) {
        var authError;

        authError = utils.makeResponse(403, consts.ERROR.GOD_REQ);

        if(req.isAuthenticated && req.isAuthenticated() 
            && req.user && req.user.role === "god")
            return next();

        res.status(403).json(authError);
    }
}