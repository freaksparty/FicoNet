var config, set;


dbconfig = {
    "protocol" : "mysql",
    "host"     : "localhost",
    "port"     : "3306",
    "database" : "ficonet-dev",
    "user"     : "ficonet-dev",
    "password" : "ficonet-dev",
    "debug"    : true
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