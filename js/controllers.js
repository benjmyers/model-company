'use strict';

/* Controllers */

angular.module('modelCo.controllers', []).
  controller('ChartCtrl', ['$scope', '$http', '$q', '$timeout', '$location', function($scope, $http, $q, $timeout, $location) {
    // Holds all soldier data
    $scope.data;
    // Currently displated attribute
    $scope.displayValue = "age";
    // true = individuals, false = categories
    $scope.displayMode = false;
    // Labels and keys for individual display attributes
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
    // National average soldier attributes
    $scope.averages = {
      age: 25,
      height: 68.5,
      hair: {
        black: .13,
        dark: .25,
        brown: .3,
        light: .24,
        sandy: .04,
        red: .03,
        gray: .01
      },
      eyes: {
        blue: .45,
        gray: .24,
        hazel: .13,
        dark: .1,
        black: .08
      },
      complexion: {
        light: .6,
        dark: .33,
        medium: .7
      },
      occupation: {
        farmer: .48,
        mechanic: .24,
        laborer: .16,
        commercial: .05,
        professional: .03,
        misc: .04
      }
    };

    /* --------------------------------- */
    /* -------- Data Functions  --------*/
    /* --------------------------------- */

    // Returns all data from the soldier csv
    $scope.getData = function() {
      var report = $q.defer();
      var fileLoc = "data/formatted-messes.csv";
      if(window.testing){
        fileLoc = "base/data/formatted-messes.csv";
      }
      $timeout(function() {
        d3.csv(fileLoc, function(error, data) {
          report.resolve(data);
        });
      }, 1000);
      return report.promise;      
    }
    // Iterages through each data point and performs necessary parsing and adjustments
    $scope.parseData = function(data) {
      _.each(data, function(d) {
        // Dates are 100 years off, correct
        var dateIn = new Date(d.datein.trim());
        var dateOut = new Date(d.dateout.trim());
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
    // Creates the object containing categorical information
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
            item = item.trim();
          var object = categories[key];
          var index = object.x.indexOf(item);
          if(index === -1) {
            object.x.push(item);
            object.y.push(1);
          }
          else
            object.y[index]++;
        })
      });
      return categories;
    }
    // Calculates averages (overall for height & age, by category for all others)
    $scope.calculateAverages = function(categories) {
      _.each(Object.keys(categories), function(key) {
        var cat = categories[key];
        cat['average'] = {};
        var total = _.reduce(cat.y, function(a, b){ return a + b; }, 0);
        
        // Age and height should be overall averages
        if(key === 'age' || key === 'height'){
          var sum = 0;
          _.each(cat.x, function(xCat, index) {
            if(cat.y[index] === 0)
              total -= 1;
            else
              sum += xCat*cat.y[index];
          });
          cat.average[key] = sum/total;
        }
        else {
          _.each(cat.x, function(xCat, index) {
            if(cat.y[index] === 0)
              total -= 1;
            else
              cat.average[xCat] = cat.y[index]/total;
          });
        }
        cat['total'] = total;
      });
    }
    // Orders categorical data of the form cat={x: [], y: []}
    $scope.order = function() {
      _.each(Object.keys($scope.data.categories), function(key) {
        var set = $scope.data.categories[key];
        var mergeSet = _.sortBy(_.zip(set.y, set.x), function(n) {return n[1]});
        set.x = _.map(mergeSet, function(e) {return e[1]});
        set.y = _.map(mergeSet, function(e) {return e[0]});
      });
    }

    // Initiate load sequence
    $scope.getData().then(function(data){
      $scope.parseData(data);
      var categories = $scope.makeCategories(data);
      $scope.calculateAverages(categories);
      $scope.data = {
        'individuals': data,
        'categories' : categories
      }
      $scope.order();
    });

    /* --------------------------------- */
    /* -------- Event Functions  --------*/
    /* --------------------------------- */

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
      $location.path("#/about");
    }
}]);