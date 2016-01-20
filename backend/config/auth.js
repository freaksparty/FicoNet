var authconfig = {};

authconfig.salt = process.env.FN_AUTH_SALT || "patatola";

set = function (cfg) {
    if (!cfg) return authconfig;

    authconfig.salt = cfg.salt;
}



module.exports = {
    "config" : function () { return authconfig; },
    "set"    : set
}