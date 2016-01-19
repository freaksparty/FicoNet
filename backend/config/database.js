var config, set;


dbconfig = {
    "protocol" : process.env.FN_MYSQL_PROTOCOL || "mysql",
    "host"     : process.env.FN_MYSQL_HOST     || "localhost",
    "port"     : process.env.FN_MYSQL_PORT     || "3306",
    "database" : process.env.FN_MYSQL_DATABASE || "ficonet-dev",
    "user"     : process.env.FN_MYSQL_USER     || "ficonet-dev",
    "password" : process.env.FN_MYSQL_PASSWORD || "ficonet-dev",
    "debug"    : process.env.FN_ENVIRONMENT    != "pro"
}; 


set = function (cfg) {
    if (!cfg) return dbconfig;

    dbconfig.protocol = cfg.protocol || dbconfig.protocol;
    dbconfig.host     = cfg.host     || dbconfig.host;
    dbconfig.port     = cfg.port     || dbconfig.port;
    dbconfig.database = cfg.database || dbconfig.database;
    dbconfig.user     = cfg.user     || dbconfig.user;
    dbconfig.password = cfg.password || dbconfig.password;
    dbconfig.debug    = cfg.debug    || dbconfig.debug;

    dbconfig.url = dbconfig.protocol + "://" + dbconfig.user + ":" + dbconfig.password + 
                    "@" + dbconfig.host + ":" + dbconfig.port + "/" + dbconfig.database;
}



module.exports = {
    "config" : function () { return dbconfig; },
    "set"    : set
}