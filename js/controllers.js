'use strict';

/* Controllers */

angular.module('modelCo.controllers', []).
  controller('ChartCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.data;
    $scope.displayValue;
    d3.csv("data/formatted-messes.csv", function(error, data) {
      $scope.parseData(data);
      var categories = $scope.makeCategories(data);
      $scope.data = {
        'individuals': data,
        'categories' : categories
      }
      $scope.$digest();
    });
    $scope.makeCategories = function(data) {
      var categories = {
        datein: {x: [], y: []},
        dateout: {x: [], y: []},
        mess: {x: [], y: []},
        cause: {x: [], y: []},
        age: {x: [], y: []},
        height: {x: [], y: []},
        complexion: {x: [], y: []},
        eyes: {x: [], y: []},
        hair: {x: [], y: []},
        occupation: {x: [], y: []},
        home: {x: [], y: []}
      };
      _.each(data, function(d) {
        _.each(Object.keys(categories), function(key){
          var item = d[key];
          if(typeof item === "string")
            item = item.toLowerCase();
          var object = categories[key];
          var index = object.x.indexOf(item);
          if(index === -1) {
            object.x.push(item);
            object.y.push(1);
          }
          else {
            object.y[index]++;
          }
        })
      });
      return categories;
    }
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
        // parse integer attrs
        d.mess = +parseInt(d.mess);
        d.age = +parseInt(d.age);
        d.heightin = +parseInt(d.heightin);
      });
    }
    $scope.setDisplay = function(displayValue) {
      $scope.displayValue = displayValue;
      $scope.$broadcast('updateDisplayValue', displayValue)
    }
    $scope.changeOrder = function() {
      $scope.$broadcast('changeOrder', $scope.displayValue);
    }
}]);