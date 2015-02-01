var crypto = require("crypto"),
    consts = require("../utils/consts");

module.exports = function (sequelize, DataTypes) {
    var User;

    User = sequelize.define("User", {
        
        "username" : { 
            type      : DataTypes.STRING(15),
            allowNull : false, 
            unique    : true,
            validate  : {
                is  : { args: ["^[a-z0-9_\-]+$", "i"], msg: consts.VALIDATES.USER.USERNAME.IS  },
                len : { args: [3,15], msg: consts.VALIDATES.USER.USERNAME.LEN }
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

        "role" : { 
            type: DataTypes.ENUM("user", "admin", "god"), 
            allowNull    : false, 
            defaultValue : "user",
            validate     : {
                isIn : { args: [["user", "admin", "god"]], msg: consts.VALIDATES.USER.ROLE.IS_IN }
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
        }

    }, {
        classMethods: {
            associate: function (models) { },
            generateHash: function (password, email) {
                //keylen = 64 but return length = 128 because "hex" dup output length
                return crypto.pbkdf2Sync(password, email, 10, 64).toString("hex");
            }
        }
    });

    return User;
}