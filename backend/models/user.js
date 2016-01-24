var crypto = require("crypto"),
    consts = require("../utils/consts");

module.exports = function (sequelize, DataTypes) {
    var User;

    User = sequelize.define("User", {
        
        "username" : { 
            type      : DataTypes.STRING(25),
            allowNull : false, 
            unique    : true,
            validate  : {
                is  : { args: ["^[a-z0-9_\-]+$", "i"], msg: consts.VALIDATES.USER.USERNAME.IS  },
                len : { args: [3,25], msg: consts.VALIDATES.USER.USERNAME.LEN }
            } 
        },

        "password" : { 
            type      : DataTypes.STRING(128), 
            allowNull : false,
            validate  : {
                notEmpty : { args: true, msg: consts.VALIDATES.USER.PASSWORD.NOT_EMPTY },
            }
        },

        "email" : { 
            type      : DataTypes.STRING(100), 
            allowNull : false, 
            unique    : true,
            validate  : {
                notEmpty : { args: true, msg: consts.VALIDATES.USER.EMAIL.NOT_EMPTY },
                isEmail  : { args: true, msg: consts.VALIDATES.USER.EMAIL.IS_EMAIL }
            }
        },

        "place" : { 
            type      : DataTypes.INTEGER, 
            allowNull : false, 
            unique    : true,
            validate  : {
                notEmpty : { args: true, msg: consts.VALIDATES.USER.PLACE.NOT_EMPTY },
                min      : { args: 1,    msg: consts.VALIDATES.USER.PLACE.MIN }
            }
        },

        "role" : { 
            type: DataTypes.ENUM("user", "admin", "god"), 
            allowNull    : false, 
            defaultValue : "user",
            validate     : {
                isIn : { args: [["user", "admin", "god"]], msg: consts.VALIDATES.USER.ROLE.IS_IN }
            } 
        },

        "type" : {
            type: DataTypes.ENUM("normal", "stuff", "collaborator"),
            allowNull    : false, 
            defaultValue : "normal",
            validate     : {
                isIn : { args: [["normal", "stuff", "collaborator"]], msg: consts.VALIDATES.USER.TYPE.IS_IN }
            } 
        },

        "created_at" : { 
            type      : DataTypes.DATE, 
            allowNull : false,
            validate  : {
                isDate : { args: true, msg: consts.VALIDATES.USER.CREATED_AT.IS_DATE}
            } 
        },

        "last_modified" : { 
            type      : DataTypes.DATE, 
            allowNull : false,
            validate  : {
                isDate : { args: true, msg: consts.VALIDATES.USER.LAST_MODIFIED.IS_DATE}
            }  
        },

        "deleted" : {
           type         : DataTypes.BOOLEAN, 
           allowNull    : false,
           defaultValue : false
        },

        "newpassword" : {
            type      : DataTypes.STRING(128), 
            allowNull : true,
            unique    : true,
        }

    }, {
        classMethods: {
            associate: function (models) { },
            generateHash: function (password, salt) {
                //keylen = 64 but return length = 128 because "hex" dup output length
                return crypto.pbkdf2Sync(password, salt, 10, 64).toString("hex");
            },
        }
    });

    return User;
}