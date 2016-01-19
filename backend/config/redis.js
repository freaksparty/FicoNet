var redisConfig, set;


redisConfig = {
    "host"     : process.env.FN_REDIS_HOST     || "localhost",
    "port"     : process.env.FN_REDIS_PORT     || "6379",
    "password" : process.env.FN_REDIS_PASSWORD || "fol-test",
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