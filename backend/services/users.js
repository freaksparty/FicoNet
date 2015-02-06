var dbServices = require("./base"),
    db         = require("../models"),
    utils      = require("../utils"),
    consts     = require("../utils/consts"),
    makePassword, makeHash, changePassword, sendEmail, ATTRS, model;


ATTRS = ["id", "username", "password", "email", "place", "role", "created_at", "last_modified"];

model = db.User;


makePassword = function (user, end) {
    utils.tryThrowableFunction(function () { 
        if(user.password) {
            user.password = model.generateHash(user.password, user.email);
        }
    }, end); 
};

makeHash = function (user, end) {
    utils.tryThrowableFunction(function () { 
        user.newpassword = model.generateHash(user.email, ""+Math.random());
    }, end);
}; 

sendEmail = function (user, end) {
    utils.tryThrowableFunction(function () { 
        utils.sendEmail(user.email, "Change Password", user.newpassword, end);
    }, end);
};

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
            delete user.id;
            delete user.newpassword;

            return makePassword(user, !!user.password, cfg.end);
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


    updateUser : function (id, roleChanged, updatePassword, data, done) {
        var userPass;

        dbServices.update({
            model : model, 
            id    : id,
            obj   : data,
            attrs : ATTRS,
            done  : done
        }).config(function (cfg) {
            cfg.deleted = false;
        }).onLoad(function (user, cfg) {
            if(!roleChanged) {
                delete user.role;
            } else if(user.role === "god"){
                return cfg.end(403, consts.ERROR.FORBIDDEN);
            }

            if(updatePassword) userPass = user.password;

            delete user.id;
            delete user.password;
            delete user.created_at;
            delete user.newpassword;

            user.last_modified = new Date();
        }).onSearch(function (user, cfg) {
            if(updatePassword) {
                user.password = userPass;
                makePassword(user, cfg.end);
            }
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

    generateNewPasswordHash : function (email, done) {
        var userPass;

        dbServices.update({
            model : model, 
            field : "email",
            value : email,
            obj   : {email : email},
            attrs : ATTRS,
            done  : done
        }).config(function (cfg) {
            cfg.deleted = false;
        }).onLoad(function (user, cfg) {
            delete user.role;
            delete user.id;
            delete user.password;
            delete user.created_at;
            delete user.username;
            delete user.newpassword;
            delete user.email

            user.last_modified = new Date();
        }).onSearch(function (user, cfg) {
            makeHash(user, cfg.end);
        }).onSuccess (function (user, cfg) {
            if(user){
                return sendEmail(user, cfg.end);
            } else {
                return cfg.end(500, consts.ERROR.UNKNOWN);
            }
        }).exec();
    },

    changePassword : function (code, password, isCode, done) {
        var field = isCode ? 'newpassword' : 'id';

        dbServices.update({
            model : model, 
            field : field,
            value : code,
            obj   : { password : password },
            attrs : ATTRS,
            done  : done
        }).config(function (cfg) {
            cfg.deleted = false;
        }).onLoad(function (user, cfg) {
            user.last_modified = new Date();
        }).onSearch(function (user, cfg) {
            user.newpassword = null;
            makePassword(user, cfg.end);
        }).onSuccess (function (user, cfg) {
            if(user){
                return cfg.end(200, "");
            } else {
                return cfg.end(500, consts.ERROR.UNKNOWN);
            }
        }).exec();
    },


    getUsers : function (done) {
        var attrs = ["id", "username", "email", "place", "role", "created_at", "last_modified"];

        dbServices.findAll({
            model : model,
            done  : done
        }).config(function (cfg) {
            cfg.options = {
                where      : utils.makeBaseWhere({}, false),
                attributes : attrs
            }

            cfg.raw = true;
        }).exec();
    },


    getUser : function (id, done) {
        var attrs = ["id", "username", "email", "place", "role", "created_at", "last_modified"];

        dbServices.find({
            model : model,
            done  : done
        }).config(function (cfg) {
            cfg.options = {
                where      : utils.makeBaseWhere({id : id}, false),
                attributes : attrs
            }

            cfg.raw = true;
        }).exec();
    }
}