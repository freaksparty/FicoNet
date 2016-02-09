var consts     = require("../../utils/consts"),
    errors     = require("../errors/errors.js"),
    checkBadRequestError, crashfn;

checkBadRequestError = function (error, done) {
    if(!error || !error.name || (error.name !== consts.VALIDATION_ERROR.NAME 
        && error.name !== consts.VALIDATION_ERROR.UNIQUE_NAME)) {
        return false;
    }

    for(i in error.errors) {
        var e = error.errors[i];

        if(e.type === consts.VALIDATION_ERROR.TYPES.NOT_NULL.NAME) {
            e.message = consts.VALIDATION_ERROR.TYPES.NOT_NULL.DESCRIPTION;
        } else if (e.type === consts.VALIDATION_ERROR.TYPES.DUPLICATE.NAME) {
            e.message = consts.VALIDATION_ERROR.TYPES.DUPLICATE.DESCRIPTION;
        }
    }

    done(400, error.errors)

    return true;
};

crashfn = function (error, data, done) {
    if(error && error(err)) {
        return;
    } else if(!checkBadRequestError (error, done)) {
        return done(500, consts.ERROR.UNKNOWN);
    }
};

module.exports = {
    create: function (model, data, options, success, error, done) {
        model.create(data, options).then(function (result) {
            if(!result) { throw new Error(); }

            success && sucess(result);

            return done(200, result.dataValues);
        }).catch(function (err) {
            crashfn(error, err, done);
        });
    },

    update : function (model, data, options, successfn, error, done) {
        model.update(data, options).spread(function (count) {
            if (count != 1) { throw new errors.ElementNotFoundError() }

            return success && success(count) || done(200, "OK");
        }).catch(function (err) {
            crashfn(error, err, done);
        });
    },

    findAndUpdate: function (model, data, options, searchfn, updatefn, error, done) {
        model.findOne(options).then(function (result) {
            if(!result) { throw new errors.ElementNotFoundError() }

            searchfn && searchfn(result);

            if(data) {
                data.last_modified = new Date();
            }

            result.update(data).then(function (updateResult) {
                if(!updateResult) { throw new Error(); }

                updatefn && updatefn(updateResult);

                return done(200, updateResult.dataValues);
            }).catch(function (err) {
                crashfn(error, err, done);
            });
        }).catch(errors.ElementNotFoundError, function (err) {
            return done(404, consts.ERROR.NOT_FOUND); 
        }).catch(errors.ForbiddenActionError, function (err) {
            return done(403, consts.ERROR.FORBIDDEN); 
        }).catch(function (err) {
            crashfn(error, err, done);
        });
    },

    remove: function (model, options, searchfn, updatefn, error, done) {
        this.findAndUpdate(model, {
            deleted: true
        }, options, searchfn, updatefn, error, done);
    },

    hardRemove :  function (model, options, searchfn, error, done) {
        model.findOne(options).then(function (result) {
            if(!result) { throw new errors.ElementNotFoundError() }

            searchfn && searchfn(result);

            result.destroy().then(function (destroyResult) {
                if(!destroyResult) { throw new Error(); }

                return done(200, "OK");
            }).catch(function (err) {
                crashfn(error, err, done);
            });
        }).catch(errors.ElementNotFoundError, function (err) {
            return done(404, consts.ERROR.NOT_FOUND); 
        }).catch(errors.ForbiddenActionError, function (err) {
            return done(403, consts.ERROR.FORBIDDEN); 
        }).catch(function (err) {
            crashfn(error, err, done);
        });
    },

    getById : function (model, id, options, successfn, error, done) {
        model.findById(id, options).then(function (result) {
            if(!result) { throw new errors.ElementNotFoundError() }

            successfn && successfn(result);

            return done(200, result);
        }).catch(errors.ElementNotFoundError, function (err) {
            return done(404, consts.ERROR.NOT_FOUND); 
        }).catch(function (err) {
            crashfn(error, err, done);
        });
    },

    getAll : function (model, options, successfn, error, done) {
        model.findAll(options).then(function (result) {
            successfn && successfn(result);

            return done(200, result);
        }).catch(function (err) {
            crashfn(error, err, done);
        });
    }
}