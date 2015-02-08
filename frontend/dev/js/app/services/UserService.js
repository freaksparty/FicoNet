FICONET.factory("UserServ", ["$resource", "API_BASE_URI", function($resource, API_BASE_URI) {
    return $resource(API_BASE_URI + "users/:id", {}, {
        update            : {method: "PUT"},
        updatePassword    : {method: "PUT", url: API_BASE_URI + "users/:id/password"},
        retrieveUser      : {method: "PUT", url: API_BASE_URI + "users/:id/retrieve"},
        hardDelete        : {method: "DELETE", url: API_BASE_URI + "users/:id/delete" },
        updateRole        : {method: "PUT", url: API_BASE_URI + "users/:id/role" },
        sendPasswordEmail : {method: "POST", url: API_BASE_URI + "users/newpassword" },
        changePassword    : {method: "PUT", url: API_BASE_URI + "users/changepassword/:code" },
    });
}]);