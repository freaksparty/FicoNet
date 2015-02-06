FICONET.controller("UsersCtrl", ['$scope', '$filter', 'UserServ', 
    function($scope, $filter, UserServ) {
        var orderBy = $filter('orderBy');

        $scope.users = {};

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


        UserServ.query(function (data) {
            $scope.users = data;
        }, function (err) {
            console.log("ERROR : " + err);
        });
    }
]);