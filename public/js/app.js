var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            controller: 'MainController',
            templateUrl: 'views/home.html',
        });
});

app.controller('MainController', ['$scope', '$http', function($scope, $http) {

    $scope.endDate = new Date();
    $scope.startDate = new Date();
    $scope.startDate.setDate($scope.startDate.getDate() - 7);
    $scope.subId = "";

    $scope.entries = [];

    $scope.generate = function() {

        if ($scope.subId == "" || $scope.startDate == "" || $scope.endDate == "") {
            alert("Complete all fields");
        } else {

            var startDateMonth = (($scope.startDate.getMonth() + 1) >= 10) ? ($scope.startDate.getMonth() + 1) : "0" + ($scope.startDate.getMonth() + 1)
            var endDateMonth = (($scope.endDate.getMonth() + 1) >= 10) ? ($scope.endDate.getMonth() + 1) : "0" + ($scope.endDate.getMonth() + 1)

            var startDateDay = ($scope.startDate.getDate() >= 10) ? $scope.startDate.getDate() : "0" + $scope.startDate.getDate()
            var endDateDay = ($scope.endDate.getDate() >= 10) ? $scope.endDate.getDate() : "0" + $scope.endDate.getDate()

            var startDate = $scope.startDate.getUTCFullYear() + "_" + startDateMonth + "_" + startDateDay;
            var endDate = $scope.endDate.getUTCFullYear() + "_" + endDateMonth + "_" + endDateDay;

            var url = "/api/" + $scope.subId + "/" + startDate + "/" + endDate;
            console.log(url);
            $http.get(url)
                .then(function(response) {
                    console.log(response);
                    $scope.entries = response.data.entries;
                });
        }
    }

}]);