FICONET.factory("UserServ", ["$resource", "API_BASE_URI", function($resource, API_BASE_URI) {
    return $resource(API_BASE_URI + "users/:id", {}, {
        query: {method: "GET", isArray: true},
        update: {method:"PUT"}
    });
}]);