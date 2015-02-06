var consts      = require("../../utils/consts"),
    BaseService = require("./BaseService");

module.exports = function (options) {
    var service, cfg;

    service = new BaseService();
    cfg     = service.cfg;

    cfg.data.done = options.done || undefined;  
    
    service.cbs.runService = function (fn, args) {
        process.nextTick(function () {
            try {
                options.model.find(cfg.data.options, { raw: cfg.data.raw })
                    .success( function (result) {
                        return service.next(service.cbs.runSuccess, [result]);
                    }).error(function (err) {
                        return service.next(service.cbs.runError, [err]);
                    }
                );
            } catch (e) {
                return cfg.data.end(500, consts.ERROR.SERVER);
            }
        });
    };

    service.cbs.runSuccess = function (r) {
        if(cfg.onSuccess) return cfg.onSuccess(r, cfg.data);

        if(r) cfg.data.end(200, r);
        else  cfg.data.end(404, consts.ERROR.NOT_FOUND);
    };

    service.loadFns();

    return service;
}