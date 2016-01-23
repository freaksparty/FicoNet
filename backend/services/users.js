var db         = require("../models"),
    utils      = require("../utils"),
    consts     = require("../utils/consts"),
    authconfig = require("../config/auth.js"),
    errors     = require("./errors/errors.js"),
    makePassword, makeHash, changePassword, sendEmail, model, User;

User = db.User;

makePassword = function (password) {
    return User.generateHash(password, authconfig.config().salt);
};

makeHash = function (email) {
    return User.generateHash(email, ""+Math.random());
}; 

sendEmail = function (email, host, newpassword, end) {
    utils.tryThrowableFunction(function () { 
        utils.sendEmail(
            email, 
            "FICONET: Cambio de contraseña", 
            "Acceda al siguiente enlace para cambiar la contraseña: <a href='http://"+host+"/changepassword/"+newpassword+"'>Cambiar contraseña</a><br>Consulte con alguien de la organización si tiene algún problema", 
            end);
    }, end);
};

module.exports = {
    createUser: function (data, done) {
        var now   = new Date(),
            attrs = ["username", "password", "email", "type", "place", "created_at", "last_modified"];

        data.created_at    = now;
        data.last_modified = now;
        data.password      = makePassword(data.password)

        User.create(data, {
            raw    : true,
            fields : attrs 
        }).then(function (user) {
            if(!user) { throw new Error(); }

            delete user.dataValues.password;
            delete user.dataValues.newpassword;
            delete user.dataValues.deleted;

            return done(200, user.dataValues);
        }).catch(function (error) {
            console.log(error);
            return done(500, consts.ERROR.UNKNOWN);
        });
    },


    updateUser : function (id, roleChanged, data, done) {
        User.findOne({
            where : utils.makeBaseWhere({id: id}, false),
        }).then(function (user) {
            if(!user) { throw new errors.ElementNotFoundError() }

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

            data.last_modified = new Date();

            user.update(data).then(function (user) {
                if(!user) { throw new Error(); }

                delete user.dataValues.password;
                delete user.dataValues.newpassword;
                delete user.dataValues.deleted;

                return done(200, user.dataValues);
            }).catch(function (error) {
                return done(500, consts.ERROR.UNKNOWN);
            });
        }).catch(errors.ElementNotFoundError, function (err) {
            return done(404, consts.ERROR.NOT_FOUND); 
        }).catch(errors.ForbiddenActionError, function (err) {
            return done(403, consts.ERROR.FORBIDDEN); 
        }).catch(function (err) {
            console.log(err);
            return done(500, consts.ERROR.UNKNOWN);
        });
    },


    removeUser : function (id, done) {
        User.findOne({
            where : utils.makeBaseWhere({id: id}, false),
        }).then(function (user) {
            if(!user)               { throw new errors.ElementNotFoundError() }
            if(user.role === "god") { throw new errors.ForbiddenActionError() }

            user.update({
                deleted: true,
                last_modified : new Date()
            }).then(function (user) {
                if(!user) { throw new Error(); }

                return done(200, "OK");
            }).catch(function (error) {
                return done(500, consts.ERROR.UNKNOWN);
            });
        }).catch(errors.ElementNotFoundError, function (err) {
            return done(404, consts.ERROR.NOT_FOUND); 
        }).catch(errors.ForbiddenActionError, function (err) {
            return done(403, consts.ERROR.FORBIDDEN); 
        }).catch(function (err) {
            return done(500, consts.ERROR.UNKNOWN);
        });
    },


    hardRemoveUser : function (id, done) {
        User.findOne({
            where : utils.makeBaseWhere({id: id}, true, true),
        }).then(function (user) {
            if(!user)               { throw new errors.ElementNotFoundError() }
            if(user.role === "god") { throw new errors.ForbiddenActionError() }

            user.destroy().then(function (user) {
                if(!user) { throw new Error(); }

                return done(200, "OK");
            }).catch(function (error) {
                return done(500, consts.ERROR.UNKNOWN);
            });
        }).catch(errors.ElementNotFoundError, function (err) {
            return done(404, consts.ERROR.NOT_FOUND); 
        }).catch(errors.ForbiddenActionError, function (err) {
            return done(403, consts.ERROR.FORBIDDEN); 
        }).catch(function (err) {
            return done(500, consts.ERROR.UNKNOWN);
        });
    },

    generateNewPasswordHash : function (email, host, done) {
        var newpassword = makeHash(email);
        User.update({
            newpassword   : newpassword,
            last_modified : new Date()
        },{
            where    : utils.makeBaseWhere({email: email}, false),
            validate : true,
            raw      : true
        }).spread(function (count) {
            if (count != 1) { throw new errors.ElementNotFoundError() }
            sendEmail(email, host, newpassword, done);
        }).catch(errors.ElementNotFoundError, function (err) {
            return done(404, consts.ERROR.NOT_FOUND);
        }).catch(function (err) {
            return done(500, consts.ERROR.UNKNOWN);
        });
    },


    changePassword : function (code, password, isCode, done) {
        var field = isCode ? 'newpassword' : 'id',
            where = utils.makeBaseWhere({}, false);

        where[field] = code; 

        User.findOne({
            where : where,
        }).then(function (user) {
            if(!user) { throw new errors.ElementNotFoundError() }

            user.update({
                newpassword   : null, 
                password      : makePassword(password),
                last_modified : new Date()
            }).then(function (user) {
                if(!user) { throw new Error(); }

                return done(200, "OK");
            }).catch(function (error) {
                return done(500, consts.ERROR.UNKNOWN);
            });
        }).catch(errors.ElementNotFoundError, function (err) {
            return done(404, consts.ERROR.NOT_FOUND); 
        }).catch(function (err) {
            return done(500, consts.ERROR.UNKNOWN);
        });
    },


    retrieveDeleteUser : function (id, done) {
        User.findOne({
            where : utils.makeBaseWhere({id: id}, true)
        }).then(function (user) {
            if(!user) { throw new errors.ElementNotFoundError() }

            user.update({
                deleted       : false,
                last_modified : new Date()
            }).then(function (user) {
                if(!user) { throw new Error(); }

                return done(200, "OK");
            }).catch(function (error) {
                return done(500, consts.ERROR.UNKNOWN);
            });
        }).catch(errors.ElementNotFoundError, function (err) {
            return done(404, consts.ERROR.NOT_FOUND); 
        }).catch(function (err) {
            return done(500, consts.ERROR.UNKNOWN);
        });
    },


    getUsers : function (deleted, done) {
        var attrs = ["id", "username", "email", "place", "role", "type", "created_at", "last_modified", "deleted"];

        User.findAll({
            where: utils.makeBaseWhere({}, deleted),
            attributes: attrs,
            raw: true
        }).then(function (users) {
            return done(200, users);
        }).catch(function (error) {
            return done(500, error);
        });
    },


    getUser : function (id, done) {
        var attrs = ["id", "username", "email", "place", "role", "type", "created_at", "last_modified"];

        User.findById(id, {
            raw: true, 
            attributes: attrs,
            where: utils.makeBaseWhere({}, false)
        }).then(function (user) {
            if(!user) { throw new errors.ElementNotFoundError() }
                
            return done(200, user);
        }).catch(errors.ElementNotFoundError, function (err) {
            return done(404, consts,ERROR.NOT_FOUND);
        }).catch(function (err) {
            return done(500, consts.ERROR.UNKNOWN);
        });
    }
}