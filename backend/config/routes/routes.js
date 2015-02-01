module.exports = {
    "/api/auth/login" : [
        { 
            method      : "post", 
            middlewares : "auth.login", 
            controller  : "api.auth.login" 
        }
    ],

    "/api/auth/logout" : [
        { 
            method      : "post", 
            middlewares : "auth.isAuthenticated", 
            controller  : "api.auth.logout" 
        }
    ],

    "/api/users/" : [
        { 
            method      : "get", 
            middlewares : ["auth.isAuthenticated", "auth.hasRoleAdmin"], 
            controller  : "api.users.getUsers" 
        }
    ],
    
    "/partials/admin/:view" : [
        { 
            method      : "get",
            middlewares : ["usersession.exposeUser", "auth.isAuthenticated", "auth.hasRoleAdmin"],
            controller  : "frontend.partials.admin" 
        }
    ],

    "/partials/god/:view" : [
        { 
            method      : "get",
            middlewares : ["usersession.exposeUser", "auth.isAuthenticated", "auth.hasRoleGod"],
            controller  : "frontend.partials.god" 
        }
    ],

    "/partials/:view" : [
        { 
            method      : "get",
            middlewares : "usersession.exposeUser",
            controller  : "frontend.partials.anon" 
        }
    ],

    "/*" : [
        { 
            method      : "get",
            middlewares : "usersession.exposeUser",
            controller  : "frontend.home" 
        }
    ]
}