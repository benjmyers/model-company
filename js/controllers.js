'use strict';

/* Controllers */

angular.module('modelCo.controllers', []).
  controller('ChartCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.data;
    $scope.displayValue = "age";
    $scope.displayMode = false;
    $scope.showAbout = false;
    $scope.sets = {
      age: {
        x: 'name',
        y: 'age',
        key: 'age',
        dispkey: 'Age'
      },
      mess: {
        x: 'name',
        y: 'mess',
        key: 'mess',
        dispkey: 'Mess'
      },
      height: {
        x: 'name',
        y: 'height',
        key: 'height',
        dispkey: 'Height'
      },
    };
    d3.csv("data/formatted-messes.csv", function(error, data) {
      $scope.parseData(data);
      var categories = $scope.makeCategories(data);
      $scope.data = {
        'individuals': data,
        'categories' : categories
      }
      $scope.order();
      $scope.$digest();
    });
    $scope.order = function() {
      _.each(Object.keys($scope.data.categories), function(key) {
        var set = $scope.data.categories[key];
        var mergeSet = _.sortBy(_.zip(set.y, set.x), function(n) {return n[1]});
        set.x = _.map(mergeSet, function(e) {return e[1]});
        set.y = _.map(mergeSet, function(e) {return e[0]});
      });
    }
    $scope.makeCategories = function(data) {
      var categories = {
        mess: {x: [], y: [], dispkey: "Mess", key: "mess"},
        datein: {x: [], y: [], dispkey: "Enlistment", key: "datein"},
        dateout: {x: [], y: [], dispkey: "Date of exit", key: "dateout"},
        cause: {x: [], y: [], dispkey: "Exit Reason", key: "cause"},
        age: {x: [], y: [], dispkey: "Age", key: "age"},
        height: {x: [], y: [], dispkey: "Height", key: "height"},
        complexion: {x: [], y: [], dispkey: "Complexion", key: "complexion"},
        eyes: {x: [], y: [], dispkey: "Eye Color", key: "eyes"},
        hair: {x: [], y: [], dispkey: "Hair Color", key: "hair"},
        occupation: {x: [], y: [], dispkey: "Occupation", key: "occupation"},
        home: {x: [], y: [], dispkey: "Home", key: "home"}
      };
      $scope.categories = categories;
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
        d.height = +parseInt(d.heightin);
      });
    }
    $scope.setDisplay = function(displayValue) {
      $scope.displayValue = displayValue;
      $scope.$broadcast('updateDisplayValue', displayValue)
    }
    $scope.changeOrder = function() {
      $scope.$broadcast('changeOrder', $scope.displayValue);
    }
    $scope.toggle = function(attr) {
      var df = false;
      if(attr === 'ind') {
        if(Object.keys($scope.sets).indexOf($scope.displayValue) === -1) {
          df = true;
          $scope.setDisplay('age');
        }
        $scope.displayMode = true;
        $scope.categories = $scope.sets;
        $scope.$broadcast('changeDisplay', true, $scope.displayValue, df);
      }
      else {
        $scope.displayMode = false;
        $scope.categories = $scope.data.categories;
        $scope.$broadcast('changeDisplay', false, $scope.displayValue, df);
      }
    }
    $scope.about = function() {
      $scope.showAbout = !$scope.showAbout;
    }
}]);