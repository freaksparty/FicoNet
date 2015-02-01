var lodash      = require("lodash"),
    routes      = require("./routes"),
    controllers = require("../../controllers"),
    middlewares = require("../../middlewares"),
    utils       = require("../../utils"),
    validMethods;


validMethods = ["get", "post", "delete", "put"];


module.exports = function (app) {
    lodash.forIn(routes, function (params, route) {

        lodash.forEach(params, function (param) {
            var controller, middleware;

            if (lodash.indexOf(validMethods, param.method) == -1)
                throw Error("ROUTER: Route " + route + " has an incorrect method '" + param.method + "'");
            
            controller = utils.normalizeFunctionPath(param.controller, controllers)     || [];
            middleware = utils.normalizeMiddlewaresPath(param.middlewares, middlewares) || [];
            
            app[param.method].call(app, route, middleware, controller);

        });

    });
}