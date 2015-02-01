var redisConfig, set;


redisConfig = {
    "host"     : "localhost",
    "port"     : "6379",
    "password" : "fol-test",
};


set = function (cfg) {
    if (!cfg) return;

    redisConfig.host     = cfg.host     || redisConfig.host;
    redisConfig.port     = cfg.port     || redisConfig.port;
    redisConfig.password = cfg.password || redisConfig.password;
}


module.exports = {
    config : function () { return redisConfig; },
    set    : set
}