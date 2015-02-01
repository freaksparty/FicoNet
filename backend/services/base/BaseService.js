var consts = require("../../utils/consts"),
    BaseService;

BaseService = function () {
    var self  = this;

    this.cfg  = { data: {} };
    this.cbs  = {};
    this.fns  = [];
    this.stop = false;

    this.cfg.data.end = function (code, data) {
        self.stop = true;

        return self.cfg.data.done && self.cfg.data.done(code, data);
    };

    this.next = function (fn, args) {
        if(this.stop) return;
        if(fn)        return fn.apply(fn, args);

        do { fn = this.fns.shift(); } while (!fn && this.fns.length > 0);
        return fn && fn();
    };

    this.config    = function (fn) { this.cfg.config    = fn || undefined; return this; };
    this.onLoad    = function (fn) { this.cfg.onLoad    = fn || undefined; return this; };
    this.onSuccess = function (fn) { this.cfg.onSuccess = fn || undefined; return this; };
    this.onError   = function (fn) { this.cfg.onError   = fn || undefined; return this; };
    this.exec      = function ()   { this.next(); }

    this.cbs.runConfig = function () {
        self.cfg.config && self.cfg.config(self.cfg.data);
        return self.next();
    };

    this.cbs.runLoad = function () {
        self.cfg.onLoad  && self.cfg.onLoad(self.cfg.data);
        return self.next();
    };

    this.cbs.runService = function ()  { return; };

    this.cbs.runSuccess = function (r) {
        if(self.cfg.onSuccess) return self.cfg.onSuccess(r, self.cfg.data);

        if(r) self.cfg.data.end(200, r);
        else  self.cfg.data.end(500, consts.ERROR.UNKNOWN);
    };

    this.cbs.runError = function (e) {
        if(self.cfg.onError) return self.cfg.onError(e);

        self.cfg.data.end(500, consts.ERROR.DB);
    };

    this.loadFns = function () {
        self.fns.push.call(self.fns, 
            self.cbs.runConfig,
            self.cbs.runLoad,
            self.cbs.runService
        );
    }
    
}

module.exports = BaseService;