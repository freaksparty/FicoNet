var fs         = require("fs"),
    path       = require("path"),
    lodash     = require("lodash"),
    nodemailer = require('nodemailer'),
    mailconfig = require('../config/smtp'),
    consts     = require("./consts");

module.exports = {
    
    normalizeFunctionPath : function (functionPath, base) {
        var functionResult = base;

        if(!functionPath || !functionResult) return;

        functionPath = functionPath.split(".");

        if (functionPath.length > 1) {
            lodash.reduce(functionPath, function (cn, fn) {
                if (cn) functionResult = functionResult[cn];
                if (fn) functionResult = functionResult[fn];
            });
        } else {
            functionResult = functionResult[functionPath];
        }

        return functionResult;

    },

    normalizeMiddlewaresPath : function (middlewares, base) {
        var paths, self;

        paths = [];
        self  = this;

        if(!middlewares) return;

        if (!lodash.isArray(middlewares)) middlewares = [middlewares]

        middlewares.forEach(function (functionPath) {
            paths.push(self.normalizeFunctionPath(functionPath, base));
        });

        return paths;
    },

    readModules : function (dir, baseObject, requirefn, context, capitalize, exclude) {
        var module, self;

        module = baseObject;
        self = this;

        capitalize = !!capitalize;

        if(!requirefn) requirefn = require;
        if(!context)   context   = requirefn;

        fs.readdirSync(dir).filter(function (file) {
            return (file.indexOf(".") !== 0) && (file !== "index.js") 
                && (exclude ? exclude.indexOf(file) < 0 : true);
        }).forEach(function (file) {
            var filePath, submodule, name;

            filePath = path.join(dir, file);

            if(fs.lstatSync(filePath).isDirectory()){
                module[file] = {};
                self.readModules(filePath, module[file]);
            } else {
                name = file.split(".")[0]
                if(capitalize) name = name.charAt(0).toUpperCase() + name.slice(1)
                submodule = requirefn.call(context, filePath);
                module[name] = submodule;
            }
        });

        return module;
    },

    reqJSONFile : function (file) {
        var json;

        if (!file) return undefined;

        try {
            json = require("../../"+file);
        } catch (e) {
            return undefined;
        }

        return json;
    },

    copyObject : function (from, to) {
        var element;
        
        for(var element in from) {
            if(from[element]){
                to[element] = from[element];
            }
        }
    },


    makeResponse : function (code, data) {
        return data;
    },

    sendStandardResponse : function (res, service, fn) {
        var args, self;

        self = this;

        args = Array.prototype.slice.call(arguments);
        args = args.slice(3);

        args.push(function (code, data) {
            var response = self.makeResponse(code, data);
            res.status(code).json(response);
        });
        
        service[fn].apply(service, args);
    },

    manageSQLServiceError : function (data, err, done) {
        var dupKey, key;

        if(err.sql){
            if(err.code === "ER_DUP_ENTRY") {
                dupKey = consts.RE.DUP_ENTRY.exec(err.toString());

                if (dupKey && dupKey[1]){
                    return done(409, dupKey[1]);
                } else {
                    return done(500, consts.ERROR.DB);
                }
            }

            if(err.code === "ER_BAD_NULL_ERROR") {
                return done(400, consts.ERROR.MISSING_FIELDS);
            }

            if(err.code === "ER_NO_REFERENCED_ROW_") {
                return done(400, consts.ERROR.FOREIGN_KEY)
            }
        }
        
        try {
            for(key in err) {
                if(!lodash.has(data, key)) {
                    return done(500, consts.ERROR.DB);
                }
            }
        } catch (e) {
            return done(500, consts.ERROR.BAD_DB);
        }

        return done(400, err);
    },

    makeModel : function (data, attrs) {
        var model, key, attr;

        model = {};

        if(!data) return;

        for(key in attrs) {
            attr =  attrs[key];
            model[attr] = data[attr] || undefined;
        }

        return model;
    },

    makeBaseWhere : function (data, deleted, onlyDeleted) {
        var where = {};


        if(!deleted)
            where.deleted = false;

        if(onlyDeleted) 
            where.deleted = true;


        this.copyObject(data, where);

        return where;
    },

    tryThrowableFunction : function (fn, end, options) {
        try {
            fn();
        } catch (e) {  
            return typeof end === 'function' && end(
                (options && options.code) || 500, 
                (options && options.code && options.message) || consts.ERROR.SERVER
            );
        }
    },

    sendEmail : function (to, subject, body, end) {
        var transporter, mailOptions, config;

        config = mailconfig.config();

        transporter = nodemailer.createTransport({
            service : config.service,
            auth    : {
                user : config.user,
                pass : config.password
            }
        });

        mailOptions = {
            from    : config.from,
            to      : to,
            subject : subject,
            html    : body
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if(err) {
                console.log(err);
                end(500, consts.ERROR.SERVER);
            } else {
                end(200, info);
            }
        });
    }
}