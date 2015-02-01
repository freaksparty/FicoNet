var utils  = require("../utils"),
    consts = require("../utils/consts");

module.exports = {
    exposeUser : function (req, res, next) {
        var role = '', 
            username = '';

        if(req.user) {
            role = req.user.role;
            username = req.user.username;
        }

        res.cookie('user_data', JSON.stringify({
            'username': username,
            'role': role
        }));

        return next();
    }
}