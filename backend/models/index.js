var fs        = require("fs"),
    path      = require("path"),
    Sequelize = require("sequelize"),
    lodash    = require("lodash"),
    dbconfig  = require("../config/database").config(),
    utils     = require("../utils"),
    sequelize, db;

sequelize = new Sequelize (dbconfig.database, dbconfig.user, dbconfig.password, {
    logging : dbconfig.debug ? console.log : false,
    host    : dbconfig.host,
    dialect : dbconfig.protocol,
    port    : dbconfig.port,
    define  : {
        underscored : false,
        timestamps  : false
    }
});


db = utils.readModules(__dirname, {}, sequelize.import, sequelize, true);


Object.keys(db).forEach(function (name) {
    if("associate" in db[name]) db[name].associate(db);
});

module.exports = lodash.extend({
    sequelize: sequelize,
    Sequelize: Sequelize
}, db);