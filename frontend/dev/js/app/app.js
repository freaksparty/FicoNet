"use strict";

var FICONET = angular.module("FICONET", ['ngResource', 'ngRoute', 'ngCookies', 'ui.bootstrap']);

FICONET.constant("API_BASE_URI", "api/");

FICONET.config(['$interpolateProvider', '$routeProvider', '$locationProvider',
    function($interpolateProvider, $routeProvider, $locationProvider) {

        //Routes
        $routeProvider.when('/', {
            templateUrl : 'partials/home'
        }).when('/login', {
            templateUrl : 'partials/login',
            controller  : 'LoginCtrl'
        }).when('/admin', {
            templateUrl : 'partials/admin/home'
        }).when('/admin/users', {
            templateUrl : 'partials/admin/users',
            controller  : 'UsersCtrl'
        }).when('/403', {
            templateUrl : 'partials/403'
        }).when('/404', {
            templateUrl : 'partials/404'
        }).when('/500', {
            templateUrl : 'partials/500'
        }).otherwise({
            redirectTo: "/404"
        });

        $locationProvider.html5Mode(true);
    }
]);

FICONET.run(['$rootScope', '$location', 'AuthServ', function($rootScope, $location, AuthServ) {
    $rootScope.$watch(function () { 
        return AuthServ.getUserData(); 
    }, function (newUserData) {
        $rootScope.user = newUserData;
    });

    $rootScope.$on("$routeChangeError", function (event, current, previous, rejection) {
        switch(rejection.status) {
            case 401 : $location.path("/login"); break;
            case 403 : $location.path("/403");   break;
            case 500 : $location.path("/500");   break;
            default  : $rootScope.mainPageState = "error";
        }
    });

    $rootScope.isAdmin = function () {
        return AuthServ.isAdmin();
    };

    $rootScope.isGod = function () {
        return AuthServ.isGod();
    };
}]);