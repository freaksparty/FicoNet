var path   = require("path"),
    config = require("../config/frontend"),
    doPartialResponse, basepath;

basepath = config["views-dev"]; 

doPartialResponse = function (res, pPath, view) {
    res.sendFile(path.join(basepath, "partials", pPath, view+".html"), {root: "./"});
}

module.exports = {
    home : function (req, res) {
        res.sendFile(path.join(basepath, "index.html"), {root: "./"});
    },

    partials : {
        anon : function (req, res) {
            doPartialResponse(res, "", req.param("view"));
            
        },

        admin : function (req, res) {
            doPartialResponse(res, "admin", req.param("view"));
        },

        god : function (req, res) {
            doPartialResponse(res, "god", req.param("view"));
        }
    }
}