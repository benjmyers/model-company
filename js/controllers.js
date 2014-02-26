'use strict';

/* Controllers */

angular.module('modelCo.controllers', []).
  controller('ChartCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.data;
    d3.csv("data/formatted-messes.csv", function(error, data) {
      $scope.parseData(data);
      $scope.data = data;
      $scope.$digest();
    });
    $scope.parseData = function(data) {
      _.each(data, function(d) {
        // Dates are 100 years off, correct
        var dateIn = new Date(d.datein);
        var dateOut = new Date(d.dateout);
        var correctedIn = dateIn.getFullYear() - 100;
        var correctedOut = dateOut.getFullYear() - 100;
        var cDateIn = dateIn.setFullYear(correctedIn);
        var cDateOut = dateOut.setFullYear(correctedOut);
        d.datein = new Date(cDateIn).toDateString();
        d.dateout = new Date(cDateOut).toDateString();
        d.mess = +parseInt(d.mess);
        d.age = +parseInt(d.age);
        d.heightin = +parseInt(d.heightin);
      });
    }
    $scope.setDisplay = function(displayValue) {
      $scope.$broadcast('updateDisplayValue', displayValue)
    }
}]);