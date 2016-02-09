var db         = require("../models"),
    utils      = require("../utils"),
    authconfig = require("../config/auth.js"),
    errors     = require("./errors/errors.js"),
    dbHelper   = require("./helpers/general.js"),
    userHelper = require("./helpers/users.js"),
    User;

User = db.User;

module.exports = {
    createUser: function (data, done) {
        var now   = new Date(),
            attrs = ["username", "password", "email", "type", "place", "created_at", "last_modified"];

        data.created_at    = now;
        data.last_modified = now;
        data.password      = userHelper.makePassword(data.password);

        dbHelper.create(User, data, {
            raw    : true,
            fields : attrs 
        }, function (user) {
            delete user.dataValues.password;
            delete user.dataValues.newpassword;
            delete user.dataValues.deleted;
        }, null, done);
    },


    updateUser : function (id, roleChanged, data, done) {
        dbHelper.findAndUpdate(User, data, {
            where : utils.makeBaseWhere({id: id}, false),
        }, function (user) {
            delete data.id;
            delete data.password;
            delete data.created_at;
            delete data.newpassword;
            delete data.deleted;

            if(!roleChanged) {
                delete data.role;
            } else if(data.role === "god" || user.role === "god"){
                throw new errors.ForbiddenActionError();
            }
        }, function (user) {
            delete user.dataValues.password;
            delete user.dataValues.newpassword;
            delete user.dataValues.deleted;
        }, null, done);
    },


    removeUser : function (id, done) {
        dbHelper.remove(User, {
            where : utils.makeBaseWhere({id: id}, false),
        }, function (user) {
            if(user.role === "god") { throw new errors.ForbiddenActionError() }
        }, null, null, done);
    },


    hardRemoveUser : function (id, done) {
        dbHelper.hardRemove(User, {
            where : utils.makeBaseWhere({id: id}, true, true),
        }, function (user) {
            if(user.role === "god") { throw new errors.ForbiddenActionError() }
        }, null, done);
    },

    generateNewPasswordHash : function (email, host, done) {
        var newpassword = userHelper.makeHash(email);

        dbHelper.update(User, {
            newpassword   : newpassword,
            last_modified : new Date()
        },{
            where    : utils.makeBaseWhere({email: email}, false),
            validate : true,
            raw      : true
        }, function (count) {
            userHelper.sendEmail(email, host, newpassword, done);

            return true;
        }, null, done);
    },


    changePassword : function (code, password, isCode, done) {
        var field = isCode ? 'newpassword' : 'id',
            where = utils.makeBaseWhere({}, false)
            data  = {};

        where[field] = code;

        dbHelper.findAndUpdate(User, data, {
            where : where,
        }, function (user) {
            data.newpassword   = null;
            data.password      = userHelper.makePassword(password);
            data.last_modified = new Date();
        }, function (user) {
            user.dataValues = "OK";
        }, null, done);
    },


    retrieveDeleteUser : function (id, done) {
        var data = { deleted: false };

        dbHelper.findAndUpdate(User, data, {
            where : utils.makeBaseWhere({id: id}, true),
        }, null, function (user) {
            user.dataValues = "OK";
        }, null, done);
    },


    getUsers : function (deleted, done) {
        var attrs = ["id", "username", "email", "place", "role", "type", "created_at", "last_modified", "deleted"];

        dbHelper.getAll(User, {
            where: utils.makeBaseWhere({}, deleted),
            attributes: attrs,
            raw: true
        }, null, null, done);
    },


    getUser : function (id, done) {
        var attrs = ["id", "username", "email", "place", "role", "type", "created_at", "last_modified"];

        dbHelper.getById(User, id, {
            raw: true, 
            attributes: attrs,
            where: utils.makeBaseWhere({}, false)
        }, null, null, done);
    }
}