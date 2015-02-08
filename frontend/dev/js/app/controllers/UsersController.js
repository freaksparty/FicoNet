FICONET.controller("UsersCtrl", ['$scope', '$filter', '$modal', 'UserServ', 
    function($scope, $filter, $modal, UserServ) {
        var orderBy = $filter('orderBy');

        $scope.LOADING = "loading";
        $scope.SUCCESS = "success";
        $scope.ERROR   = 'error';

        $scope.pageState   = $scope.LOADING;

        $scope.users = [];

        $scope.idReverse    = false;
        $scope.nameReverse  = false;
        $scope.placeReverse = false;
        $scope.roleReverse  = false;

        $scope.orderById = function () { 
            $scope.idReverse = !$scope.idReverse; 
            $scope.users = orderBy($scope.users, 'id', $scope.idReverse);
        };

        $scope.orderByName= function () { 
            $scope.nameReverse = !$scope.nameReverse; 
            $scope.users = orderBy($scope.users, 'username', $scope.nameReverse);
        };

        $scope.orderByPlace = function () { 
            $scope.placeReverse = !$scope.placeReverse; 
            $scope.users = orderBy($scope.users, 'place', $scope.placeReverse);
        };

        $scope.orderByRole = function () { 
            $scope.roleReverse = !$scope.roleReverse; 
            $scope.users = orderBy($scope.users, 'role', $scope.roleReverse);
        };

        $scope.loadUsers = function () {
            $scope.pageState = $scope.LOADING;

            UserServ.query({deleted: true}, function (data) {
                $scope.users     = data;
                $scope.pageState =  $scope.SUCCESS;
            }, function (err) {
                $scope.pageState = $scope.ERROR;
            });
        };

        $scope.deleteUser = function (userToDelete) {
            $scope.pageState = $scope.LOADING;

            UserServ.delete({ id: userToDelete.id }, function () {
                userToDelete.deleted = true;
                $scope.pageState =  $scope.SUCCESS;
                toastr.info("Usuario borrado correctamente", userToDelete.username);
            }, function (err) {
                $scope.pageState = $scope.SUCCESS;
                toastr.error("No se pudo borrar el usuario", userToDelete.username);
            });
        };

        $scope.retrieveUser = function (userToRetrieve) {
            $scope.pageState = $scope.LOADING;

            console.log(userToRetrieve);

            UserServ.retrieveUser({ id: userToRetrieve.id }, {}, function () {
                userToRetrieve.deleted = false;
                $scope.pageState =  $scope.SUCCESS;
                toastr.info("Usuario recuperado correctamente", userToRetrieve.username);
            }, function (err) {
                $scope.pageState = $scope.SUCCESS;
                toastr.error("No se pudo recuperar el usuario", userToRetrieve.username);
            });
        };

        $scope.hardDeleteUser = function (userToDelete) {
            $scope.pageState = $scope.LOADING;

            UserServ.hardDelete({ id: userToDelete.id }, function () {
                var pos = $scope.users.indexOf(userToDelete)

                $scope.users.splice(pos, 1);
                $scope.pageState =  $scope.SUCCESS;
                toastr.info("Usuario borrado definitivamente", userToDelete.username);
            }, function (err) {
                $scope.pageState = $scope.SUCCESS;
                toastr.error("No se pudo borrar el usuario", userToDelete.username);
            });
        };

        $scope.openDeleteDialog = function (user, size) {
            var modalInstance, userToDelete;

            userToDelete = user;

            modalInstance = $modal.open({
                templateUrl : 'deleteUserModal.html',
                controller  : 'DeleteUsersModalInstance',
                size        : size,
                resolve     : {
                    user : function () {
                        return user;
                    }
                }
            });

            modalInstance.result.then(function () {
                $scope.deleteUser(userToDelete);
            }, function () { });
        }

        $scope.openRetrieveDialog = function (user, size) {
            var modalInstance, userToRetrieve;

            userToRetrieve = user;

            modalInstance = $modal.open({
                templateUrl : 'retrieveUserModal.html',
                controller  : 'RetrieveUserModalInstance',
                size        : size,
                resolve     : {
                    user : function () {
                        return user;
                    }
                }
            });

            modalInstance.result.then(function () {
                $scope.retrieveUser(userToRetrieve);
            }, function () { });
        }

        $scope.openHardDeleteDialog = function (user, size) {
            var modalInstance, userToDelete;

            userToDelete = user;

            modalInstance = $modal.open({
                templateUrl : 'hardDeleteUserModal.html',
                controller  : 'HardDeleteUsersModalInstance',
                size        : size,
                resolve     : {
                    user : function () {
                        return user;
                    }
                }
            });

            modalInstance.result.then(function () {
                $scope.hardDeleteUser(userToDelete);
            }, function () { });
        }

        $scope.openShowDetailDialog = function (user, size) {
            var modalInstance;

            modalInstance = $modal.open({
                templateUrl : 'detailUserModal.html',
                controller  : 'DetailUserModalInstance',
                size        : size,
                resolve     : {
                    user : function () {
                        return user;
                    }
                }
            });
        }

        $scope.loadUsers();
    }
]);


FICONET.controller("DeleteUsersModalInstance", ['$scope', '$modalInstance', 'user',
    function($scope, $modalInstance, user, pos) {
        $scope.userToDelete = user;

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);

FICONET.controller("RetrieveUserModalInstance", ['$scope', '$modalInstance', 'user',
    function($scope, $modalInstance, user, pos) {
        $scope.userToRetrieve = user;

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);

FICONET.controller("HardDeleteUsersModalInstance", ['$scope', '$modalInstance', 'user',
    function($scope, $modalInstance, user, pos) {
        $scope.userToDelete = user;

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);


FICONET.controller("DetailUserModalInstance", ['$scope', '$modalInstance', 'user',
    function($scope, $modalInstance, user, pos) {
        $scope.userToShow = user;

        $scope.ok = function () {
            $modalInstance.close();
        }
    }
]);