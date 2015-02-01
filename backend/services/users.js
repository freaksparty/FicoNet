var dbServices = require("./base"),
    db         = require("../models"),
    utils      = require("../utils"),
    consts     = require("../utils/consts"),
    makePassword, changePassword, ATTRS, model;


ATTRS = ["id", "username", "password", "email", "role", "created_at", "last_modified"];

model = db.User;


makePassword = function (user, end) {
    tryThrowableFunction(function () { 
        if(user.password && user.email) {
            user.password = model.generateHash(user.password, user.email);
        }
    }, end); 
}


changePassword = function (user, end) {
    tryThrowableFunction(function () { 
        
    }, end); 
} 


module.exports = {
    createUser: function (data, done) {
        
        dbServices.create({
            model : model, 
            obj   : data, 
            attrs : ATTRS, 
            done  : done
        }).onLoad(function (user, cfg) {
            var now = new Date();

            user.created_at    = now;
            user.last_modified = now;

            delete user.role;

            return makePassword(user, cfg.end);
        }).onSuccess (function (user, cfg) {
            if(user){
                return cfg.end(200, { 
                    username : user.username
                });
            } else {
                return cfg.end(500, consts.ERROR.UNKNOWN);
            }
        }).exec();
    },


    updateUser : function (id, roleChanged, data, done) {
        dbServices.update({
            model : model, 
            id    : id,
            obj   : data,
            attrs : ATTRS,
            done  : done
        }).config(function (cfg) {
            cfg.deleted = true;
        }).onLoad(function (user, cfg) {
            if(!roleChanged) delete user.role;

            user.last_modified = new Date();

            return makePassword(user, cfg.end);
        }).onSuccess (function (user, cfg) {
            if(user){
                return cfg.end(200, {
                    username : user.username
                });
            } else {
                return cfg.end(500, consts.ERROR.UNKNOWN);
            }
        }).exec();
    },


    removeUser : function (id, done) {
        dbServices.remove({
            model : model, 
            id    : id,
            done  : done
        }).onSuccess (function (user, cfg) {
            if(user){
                return cfg.end(200, user.id);
            } else {
                return cfg.end(500, consts.ERROR.UNKNOWN);
            }
        }).exec();
    },


    hardRemoveUser : function (id, done) {
        dbServices.hardRemove({
            model : model, 
            id    : id,
            done  : done
        }).onSuccess (function (user, cfg) {
            if(user){
                return cfg.end(200, user.id);
            } else {
                return cfg.end(500, consts.ERROR.UNKNOWN);
            }
        }).exec();
    },


    getUsers : function (done) {
        var attrs = ["id", "username", "email", "role", "created_at", "last_modified"];

        dbServices.findAll({
            model : model,
            done  : done
        }).config(function (cfg) {
            cfg.options = {
                where      : utils.makeBaseWhere({}, true),
                attributes : attrs
            }

            cfg.raw = true;
        }).exec();
    },


    getUser : function (id, done) {
        var attrs = ["id", "username", "email", "role", "created_at", "last_modified"];

        dbServices.find({
            model : model, 
            id    : id,
            done  : done
        }).config(function (cfg) {
            cfg.options = {
                where      : utils.makeBaseWhere({id: id}, true),
                attributes : attrs
            }

            cfg.raw = true;
        }).exec();
    }
}