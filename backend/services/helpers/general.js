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

crashfn = function (error, done) {
    if(error && error()) {
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
            crashfn(err, done);
        });
    },

    update: function (model, data, options, searchfn, updatefn, error, done) {
        model.findOne(options).then(function (result) {
            if(!result) { throw new errors.ElementNotFoundError() }

            searchfn && searchfn(result);

            result.update(data).then(function (updateResult) {
                if(!updateResult) { throw new Error(); }

                updatefn && updatefn(updateResult);

                return done(200, updateResult.dataValues);
            }).catch(function (err) {
                crashfn(err, done);
            });
        }).catch(errors.ElementNotFoundError, function (err) {
            return done(404, consts.ERROR.NOT_FOUND); 
        }).catch(errors.ForbiddenActionError, function (err) {
            return done(403, consts.ERROR.FORBIDDEN); 
        }).catch(function (err) {
            return done(500, consts.ERROR.UNKNOWN);
        });
    },

    remove: function (model, options, searchfn, updatefn, error, done) {
        this.update(model, {
            deleted: true,
            last_modified : new Date()
        }, searchfn, updatefn, error, done);
    },

    hardRemove :  function (model, options, searchfn, error, done) {
        model.findOne(options).then(function (result) {
            if(!result) { throw new errors.ElementNotFoundError() }

            searchfn && searchfn(result);

            result.destroy().then(function (destroyResult) {
                if(!destroyResult) { throw new Error(); }

                return done(200, "OK");
            }).catch(function (err) {
                return (error && error(err)) ||done(500, consts.ERROR.UNKNOWN);
            });
        }).catch(errors.ElementNotFoundError, function (err) {
            return done(404, consts.ERROR.NOT_FOUND); 
        }).catch(errors.ForbiddenActionError, function (err) {
            return done(403, consts.ERROR.FORBIDDEN); 
        }).catch(function (err) {
            return done(500, consts.ERROR.UNKNOWN);
        });
    }
}