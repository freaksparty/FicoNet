var utils       = require("../../utils"),
    consts      = require("../../utils/consts"),
    BaseService = require("./BaseService");

module.exports = function (options) {
    var service, cfg, newData;

    service = new BaseService();
    cfg     = service.cfg;

    cfg.data.done = options.done || undefined;

    service.cbs.runLoad = function () {
        newData = utils.makeModel(options.obj, options.attrs);

        if(newData === undefined || newData === null) return cfg.data.end(400, consts.ERROR.BAD_REQUEST);

        cfg.onLoad && cfg.onLoad(newData, cfg.data);
        return service.next();
    };

    service.cbs.runService = function () {
        process.nextTick(function () {
            try {
                options.model.create(newData)
                    .success( function (result) {
                        return service.next(service.cbs.runSuccess, [result]);
                    }).error(function (err) {
                        return service.next(service.cbs.runError, [newData, err]);
                    }
                );
            } catch (e) {
                return cfg.data.end(500, consts.ERROR.SERVER);
            }
        });
    };

    service.cbs.runError = function (r, e) {
        if(cfg.onError) return cfg.onError(e);
        
        utils.manageSQLServiceError(r, e, cfg.data.end);
    };

    service.loadFns();

    return service;
}