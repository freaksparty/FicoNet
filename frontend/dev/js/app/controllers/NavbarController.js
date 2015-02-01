FICONET.controller("NavbarCtrl", ["$scope", "$location", "AuthServ", function($scope, $location, AuthServ) {
    $scope.navbar = {};
    $scope.navbar.collapsed = true;

    $scope.navbar.toggleCollapsed = function () {
        $scope.navbar.collapsed = !$scope.navbar.collapsed;
    };

    $scope.navbar.collapseIfNotCollapsed = function () {
        if(!$scope.navbar.collapsed) 
            $scope.navbar.collapsed = true;
    }

    $scope.navbar.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    $scope.logout = function() {
        AuthServ.logout(function(res) {
            $location.path('/');
        }, function(err) {});
    };
}]);