var utils       = require("../../utils"),
    consts      = require("../../utils/consts"),
    BaseService = require("./BaseService");

module.exports = function (options) {
    var service, cfg, updatedData, objToUpdate;

    service = new BaseService();
    cfg     = service.cfg;

    cfg.data.done = options.done || undefined;

    service.onSearch = function (fn) { cfg.onSearch = fn || undefined; return service; }

    service.cbs.runLoad = function () {
        updatedData = utils.makeModel(options.obj, options.attrs);

        if(!updatedData) return cfg.data.end(400, consts.ERROR.BAD_REQUEST);

        delete updatedData.deleted;

        cfg.onLoad && cfg.onLoad(updatedData, cfg.data);
        return service.next();
    };

    service.cbs.runSearch = function () {
        var filterKey, filterValue, where;

        filterKey   = "id";
        filterValue = options.id;

        if(!filterValue) {
            if(options.field) {
                filterKey   = options.field;
                filterValue = options.value;
            }
        }

        where = {};

        where[filterKey] = filterValue;


        process.nextTick(function () {
            options.model.find({ 
                where: utils.makeBaseWhere(where, cfg.data.deleted)
            }).success(function (result) {
                if(result) {
                    utils.copyObject(updatedData, result);
                    objToUpdate = result;

                    cfg.onSearch && cfg.onSearch(objToUpdate, cfg.data);

                    return service.next();
                } else {
                    return cfg.data.end(404, consts.ERROR.NOT_FOUND);
                }
            }).error(function (err) {
                cfg.data.end(500, consts.ERROR.DB);
            });
        });
                
    };

    service.cbs.runService = function () {
        try {
            objToUpdate.save().success( function (result) {
                    return service.next(service.cbs.runSuccess, [result]);
                }).error(function (err) {
                    return service.next(service.cbs.runError, [objToUpdate, err]);
                }
            );
        } catch (e) {
            return cfg.data.end(500, consts.ERROR.SERVER);
        }
    };

    service.cbs.runError = function (r, e) {
        if(service.cfg.onError) return service.cfg.onError(e);

        utils.manageSQLServiceError(r, e, cfg.data.end);
    };

    service.loadFns = function () {
        service.fns.push.call(service.fns, 
            service.cbs.runConfig,
            service.cbs.runLoad,
            service.cbs.runSearch,
            service.cbs.runService
        );
    };

    service.loadFns();

    return service;
}