var config, set;


mailconfig = {
    "from"     : process.env.FN_MAIL_FROM     || '',
    'user'     : process.env.FN_MAIL_USER     || '',  
    'password' : process.env.FN_MAIL_PASSWORD || '',
    'service'  : process.env.FN_MAIL_SERVICE  || ''
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