'use strict';

/**
 * @ngdoc function
 * @name modelCompanyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the modelCompanyApp
 */
angular.module('modelCompanyApp')
  .controller('MainCtrl', function ($scope, $http, ColorService) {
    $scope.defaultColors = ColorService.defaultColors.slice(0,6);
    $scope.getBorderStyle = function(mess) {
      return "m" + mess;
    }
    $scope.nationalAverages = {
      'age': 25,
      'height': 68,
      'hair': [{'label': 'black', 'value': .13, 'percentage': 13},
              {'label': 'brown', 'value': .55, 'percentage': 55},
              {'label': 'light', 'value': .24, 'percentage': 24},
              {'label': 'sandy', 'value': .04, 'percentage': 4},
              {'label': 'red', 'value': .03, 'percentage': 3},
              {'label': 'gray', 'value': .01, 'percentage': 1}],
      'eyes': [{'label': 'blue', 'value': .45, 'percentage': 45},
              {'label': 'gray', 'value': .24, 'percentage': 24},
              {'label': 'hazel', 'value': .13, 'percentage': 13},
              {'label': 'brown', 'value': .1, 'percentage': 10},
              {'label': 'black', 'value': .08, 'percentage': 8}],
      'complexion': [{'label': 'light', 'value': .6, 'percentage':  60},
              {'label': 'dark', 'value': .33, 'percentage': 33},
              {'label': 'medium', 'value': .7, 'percentage': 70}],
      'occupation': [{'label': 'farmer', 'value': .48, 'percentage': 48},
              {'label': 'mechanic', 'value': .24, 'percentage': 24},
              {'label': 'laborer', 'value': .16, 'percentage': 16},
              {'label': 'commercial', 'value': .05, 'percentage': 5},
              {'label': 'professional', 'value': .03, 'percentage': 3},
              {'label': 'misc', 'value': .04, 'percentage': 4}],
      'casualties': [
              {'label': 'Mustered Out', 'value': 0.4436, 'percentage': 44.36, 'order': 1},
              {'label': 'Transferred', 'value': 0.0587, 'percentage': 5.87, 'order': 0},
              {'label': 'Discharged', 'value': 0.0712, 'percentage': 7.12, 'order': 2},
              {'label': 'Deserted', 'value':0.0579, 'percentage': 5.79, 'order': 3},
              {'label': 'Wounded', 'value': 0.1967, 'percentage': 19.67, 'order': 7},
              {'label': 'MIA/Unknown', 'value': 0.2089, 'percentage': 20.89, 'order': 5},
              {'label': 'Died', 'value': 0.0612, 'percentage': 6.12, 'order': 4},
              {'label': 'KIA/Died Wounds', 'value': 0.0287, 'percentage': 2.87, 'order': 6}]
    }
    $scope.events = [{
        'name': 'Winchester',
        'date': '05/25/1862',
        'type': 'battle'
    }, {
        'name': 'Cedar Mountain',
        'date': '08/09/1862',
        'type': 'battle'
    },
    {
        'name': 'Antietam',
        'date': '09/16/1862',
        'type': 'battle'
    }, {
        'name': 'Chancellorsville',
        'date': '05/01/1863',
        'type': 'battle'
    }, {
        'name': 'Gettysburg',
        'date': '07/01/1863',
        'type': 'battle'
    }, {
        'name': 'Peachtree Creek',
        'date': '07/20/1864',
        'type': 'battle'
    },{
        'name': 'Exp. of 3 yrs enlistment',
        'date': '09/18/1864',
        'type': 'event'
    },  {
        'name': 'Muster Out',
        'date': '07/16/1865',
        'type': 'event'
    }]

    $scope.messes = ['Company', "Mess 1", "Mess 2", "Mess 3", "Mess 4", "Mess 5", "Mess 6"];

    $scope.timeseriesDisplay = {
      'value': 'Company'
    };

    $scope.occupationDisplay = {
      'value': 'Company'
    }

    $scope.mapDisplay = {
      'value': 'Company'
    }


    $scope.getMess = function(messNo) {
      return _.reject($scope.companyData, function(d) {
        return d.mess != messNo;
      })
    }
    $scope.getOutClass = function(outMethod) {
      switch (outMethod) {
        case "KIA/Died Wounds":
          return "kia";
        case "Died":
          return "died";
        case "Wounded":
          return "wounded";
        case "MIA/Unknown":
          return "missing";
      }
    }

    var root = angular.copy($scope.nationalAverages.occupation);

    d3.csv('data/formatted-messes.csv', function(err, data) {
      d3.csv('data/locations.csv', function(err, locations) {
        var dataObj = {};
        _.each(data, function(d) {
          // GeoCode homes
          var geocode = _.find(locations, function(e) { return e.town === d.home;});
          if (geocode) {
            d.latitude = geocode.lat;
            d.longitude = geocode.lon;
          }
        })
        $scope.companyData = data;
        $scope.$apply();
      })
    })
  });
