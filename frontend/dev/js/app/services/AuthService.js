FICONET.factory('AuthServ', ['$rootScope', '$http', '$cookieStore', '$cookies','API_BASE_URI',
    function($rootScope, $http, $cookieStore, $cookies, API_BASE_URI){

        var userData, changeUser, resetUser, removeSid;

        userData = $cookieStore.get('user_data') || { username: null, role: null };

        changeUser = function (user) {
            userData = user;
        };

        resetUser = function () {
            changeUser({
                username  : null,
                role      : null
            });
        };

        removeSid = function () {
            $cookieStore.remove('connect.sid');
            console.log($cookieStore.get('connect.sid'));
        };

        $rootScope.$watch(function() { 
            return $cookies.user_data;
        }, function(newValue) {
            if(newValue) {
                changeUser(JSON.parse(newValue));
            }
        });

        return {
            login : function (user, success, error) {
                $http.post(API_BASE_URI+"auth/login", user).success(success).error(error);
            },

            logout : function (success, error) {
                $http.post(API_BASE_URI+"auth/logout").success(function(){
                    resetUser();
                    typeof success  === 'function' && success();
                    removeSid();
                }).error(error);
            },

            getUserData : function () {
                return userData;
            },

            isLogged : function () {
                return userData && !!userData.username
            },

            isAdmin : function () {
                return userData.role === "god" || userData.role === "admin";
            },

            isGod : function () {
                return userData.role === "god";
            }
        };
    }
]);