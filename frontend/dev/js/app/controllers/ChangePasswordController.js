FICONET.controller("ChangePasswordCtrl", ['$scope', '$location', '$routeParams', 'UserServ', 
    function($scope, $location, $routeParams, UserServ) {
        var code = $routeParams.code;

        if(!code.match(/^([0-9a-fA-F]{128})$/)) $location.path('/login');

        $scope.newpassword = { password : ''};

        $scope.sending = false;

        $scope.changePassword = function () {
            $scope.sending = true;

            UserServ.changePassword({code: code}, $scope.newpassword, function () {
                $location.path('/login');
                $scope.sending = false;
            }, function (err) {
                toastr.error("No se ha podido cambiar la contraseña", "Error cambiando password");
                $scope.sending = false;
            });
        };

    }
]);