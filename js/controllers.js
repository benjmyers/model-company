'use strict';

/* Controllers */

angular.module('modelCo.controllers', []).
  controller('ChartCtrl', ['$scope', function($scope) {
    $scope.age = function() {
      console.log("set age")
    }
    $scope.height = function() {
      console.log("set height")
    }
}]);