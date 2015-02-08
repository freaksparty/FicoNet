FICONET.controller("LoginCtrl", ['$scope', '$location', 'AuthServ', 
    function($scope, $location, AuthServ) {
        if(AuthServ.isLogged()) $location.path('/');

        $scope.login = {};
        
        $scope.login.data    = {};
        $scope.login.logging = false;

        $scope.login.sendLogin = function () {
            $scope.login.logging = true;

            AuthServ.login($scope.login.data, function (user) {
                $location.path('/');
                $scope.login.logging = false;
            }, function (error) {
                $scope.login.logging = false;
                toastr.error("Usuario y/o contraseña incorrectos", "Login");
            });
        }
    }
]);