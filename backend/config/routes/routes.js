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
        },

        {
            method      : "post", 
            middlewares : ["auth.isAuthenticated", "auth.hasRoleAdmin"], 
            controller  : "api.users.createUser" 
        }
    ],


    "/api/users/newpassword" : [
        { 
            method      : "post",
            controller  : "api.users.getNewPasswordHash" 
        }
    ],


    "/api/users/changepassword/:code([0-9a-fA-F]{128})" : [
        { 
            method      : "put",
            controller  : "api.users.changePasswordWithCode" 
        }
    ],

    "/api/users/:user" : [
        { 
            method      : "get", 
            middlewares : ["auth.isAuthenticated", "auth.hasRoleAdmin"], 
            controller  : "api.users.getUser" 
        },

        {
            method      : "put", 
            middlewares : ["auth.isAuthenticated", "auth.hasRoleAdmin"], 
            controller  : "api.users.updateUser" 
        },

        {
            method      : "delete", 
            middlewares : ["auth.isAuthenticated", "auth.hasRoleAdmin"], 
            controller  : "api.users.deleteUser" 
        }
    ],

    "/api/users/:user/password" : [
        { 
            method      : "put", 
            middlewares : ["auth.isAuthenticated", "auth.hasRoleAdmin"], 
            controller  : "api.users.changePassword"
        },
    ],

    "/api/users/:user/role" : [
        { 
            method      : "put", 
            middlewares : ["auth.isAuthenticated", "auth.hasRoleGod"], 
            controller  : "api.users.changeRole"
        },
    ],

    "/api/users/:user/retrieve" : [
        { 
            method      : "put", 
            middlewares : ["auth.isAuthenticated", "auth.hasRoleAdmin"], 
            controller  : "api.users.retrieveDeleteUser"
        },
    ],

    "/api/users/:user/delete" : [
        {
            method      : "delete", 
            middlewares : ["auth.isAuthenticated", "auth.hasRoleGod"], 
            controller  : "api.users.hardDeleteUser" 
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