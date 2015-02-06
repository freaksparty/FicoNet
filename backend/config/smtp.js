var config, set;


mailconfig = {
    "from"     : '',
    'password' : '' ,
    'service'  : '',
    'user'     : ''  
}; 


set = function (cfg) {
    if (!cfg) return mailconfig;

    mailconfig.from     = cfg.from     || mailconfig.from;
    mailconfig.password = cfg.password || mailconfig.password;
    mailconfig.service  = cfg.service  || mailconfig.service;
    mailconfig.user     = cfg.user     || mailconfig.user;
}



module.exports = {
    "config" : function () { return mailconfig; },
    "set"    : set
}