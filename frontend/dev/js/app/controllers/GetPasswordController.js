FICONET.controller("GetPasswordCtrl", ['$scope', 'UserServ', 
    function($scope, UserServ) {
        $scope.newpassword = { email : ''};

        $scope.sending = false;

        $scope.sendEmail = function () {
            $scope.sending = true;

            UserServ.sendPasswordEmail($scope.newpassword, function () {
                toastr.success("Te hemos enviado un correo con los datos para cambiar la contraseña", "Correo enviado");
                $scope.sending = false;
            }, function (err) {
                toastr.error("No hemos podido enviar el correo a esa dirección", "Error enviando correo");
                $scope.sending = false;
            });
        };

    }
]);