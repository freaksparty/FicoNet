var utils       = require("../../utils"),
    consts      = require("../../utils/consts"),
    BaseService = require("./BaseService");

module.exports = function (options) {
    var service, cfg, objToDelete;

    service = new BaseService();
    cfg     = service.cfg;
    cfg.data.done = options.done;


    service.onSearch = function (fn) { cfg.onSearch = fn || undefined; return service; }

    service.cbs.runSearch = function () {
        process.nextTick(function () {
            options.model.find({ 
                where: utils.makeBaseWhere({id: options.id}, false) 
            }).success(function (result) {
                if(result) {
                    result.deleted = true;
                    objToDelete    = result;

                    cfg.onSearch && cfg.onSearch(objToDelete, cfg.data);

                    return service.next();
                } else {
                    return cfg.data.end(404, consts.ERROR.NOT_FOUND);
                }
            }).error(function (err) {
                cfg.data.end(500, consts.ERROR.DB);
            });
        });          
    }

    service.cbs.runService = function () {
        try {
            objToDelete.save().success( function (result) {
                    return service.next(service.cbs.runSuccess, [result]);
                }).error(function (err) {
                    return service.next(service.cbs.runError, [objToDelete, err]);
                }
            );
        } catch (e) {
            return cfg.data.end(500, consts.ERROR.SERVER);
        }
    }

    service.loadFns = function () {
        service.fns.push.call(service.fns, 
            service.cbs.runConfig,
            service.cbs.runLoad,
            service.cbs.runSearch,
            service.cbs.runService
        );
    }

    service.loadFns();

    return service;
}