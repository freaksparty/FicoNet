FICONET.controller("ModifyUserCtrl", ['$scope', '$routeParams', '$modal', 'UserServ', 
    function($scope, $routeParams, $modal, UserServ) {
        var userId = $routeParams.id;

        if(userId == 'create') {
            $scope.create = true;
            userId = undefined;
        }


        $scope.LOADING = "loading";
        $scope.SUCCESS = "success";
        $scope.ERROR   = 'error';

        $scope.pageState   = $scope.LOADING;

        $scope.newpass = { password : ''};

        $scope.modifying = false;
        $scope.creating  = false;

        $scope.roles = ["user", "admin"];
        $scope.types = ["normal", "stuff", "collaborator"];

        $scope.newrole = {};

        $scope.getUser = function () {
            $scope.pageState = $scope.LOADING;

            UserServ.get({id: userId}, function (user) {
                $scope.user         = user;
                $scope.newrole.role = user.role;
                $scope.pageState    =  $scope.SUCCESS;
            }, function (err) {
                $scope.pageState = $scope.ERROR;
            });
        };

        $scope.createUser = function () {
            $scope.creating = true;

            UserServ.save($scope.user, function (user) {
                console.log(user);
                $scope.user = user;
                $scope.creating = false;
                $scope.create = false;
                userId = user.id;
                delete $scope.user.password;
                toastr.success("Usuario creado", user.username);
            }, function (err) {
                $scope.creating = false;
                toastr.error(JSON.stringify(err.data), "Error creando usuario");
            });
        };

        $scope.updateUser = function () {
            $scope.modifying = true;

            UserServ.update({id: userId}, $scope.user, function (user) {
                $scope.user = user;
                $scope.modifying = false;
                toastr.success("Usuario modificado", user.username);
            }, function (err) {
                $scope.modifying = false;
                toastr.error(err.data, "Error modificando usuario");
            });
        };

        $scope.updatePassword = function () {
            $scope.modifying = true;

            UserServ.updatePassword({id: userId}, $scope.newpass, 
                function (data) {
                    $scope.password = '';
                    $scope.modifying = false;
                    toastr.success("Contraseña cambiada", $scope.user.username);
                }, function (err) {
                    $scope.modifying = false;
                    toastr.error(err.data, "Error cambiando contraseña");
                }
            );
        };

        $scope.updateRole = function () {
            $scope.modifying = true;

            UserServ.updateRole({id: userId}, $scope.newrole, 
                function (data) {
                    $scope.modifying = false;
                    toastr.success("Rol cambiado", $scope.user.username);
                }, function (err) {
                    $scope.modifying = false;
                    $scope.newrole.role = $scope.user.role;
                    toastr.error(err.data, "Error cambiando rol");
                }
            );
        };


        !$scope.create && $scope.getUser();
        $scope.pageState = $scope.create ? $scope.SUCCESS : $scope.pageState;

        $scope.user = $scope.create ? {} : { username : "Usuario"};

    }
]);