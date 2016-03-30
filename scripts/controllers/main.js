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
    
    // if ( $(window).width() < 786) {
    //   $(window).bind("load", function() {
    //     var timeout = setTimeout(function() {
    //         $("img.lazy").trigger("sporty")
    //     }, 2000);
    //   });
    // }
    // else {
    //   $("img.lazy").lazyload({threshold : 200});
    // }


    $scope.nationalAverages = {
      'age': 25,
      'height': 68,
      'hair': [{'label': 'black', 'value': .13, 'percentage': 13},
              {'label': 'brown', 'value': .55, 'percentage': 55},
              {'label': 'light', 'value': .24, 'percentage': 24},
              {'label': 'sandy', 'value': .04, 'percentage': 4},
              {'label': 'red', 'value': .03, 'percentage': 3},
              {'label': 'gray', 'value': .01, 'percentage': 1},
              {'label': 'NA', 'value': 0, 'percentage': 0 }],
      'eyes': [{'label': 'blue', 'value': .45, 'percentage': 45},
              {'label': 'gray', 'value': .24, 'percentage': 24},
              {'label': 'hazel', 'value': .13, 'percentage': 13},
              {'label': 'brown', 'value': .1, 'percentage': 10},
              {'label': 'black', 'value': .08, 'percentage': 8},
              {'label': 'NA', 'value': 0, 'percentage': 0 }],
      'complexion': [{'label': 'light', 'value': .6, 'percentage':  60},
              {'label': 'dark', 'value': .33, 'percentage': 33},
              {'label': 'medium', 'value': .07, 'percentage': 7},
              {'label': 'NA', 'value': 0, 'percentage': 0 }],
      'occupation': [{'label': 'farmer', 'value': .48, 'percentage': 48},
              {'label': 'mechanic', 'value': .24, 'percentage': 24},
              {'label': 'laborer', 'value': .16, 'percentage': 16},
              {'label': 'commercial', 'value': .05, 'percentage': 5},
              {'label': 'professional', 'value': .03, 'percentage': 3},
              {'label': 'misc', 'value': .04, 'percentage': 4},
              {'label': 'NA', 'value': 0, 'percentage': 0 }],
      'casualties': [
              {'label': 'Mustered Out', 'value': 0.44, 'percentage': 44.0, 'order': 1},
              {'label': 'Transferred', 'value': 0.06, 'percentage': 6.0, 'order': 0},
              {'label': 'Discharged', 'value': 0.07, 'percentage': 7.0, 'order': 2},
              {'label': 'Deserted', 'value':0.06, 'percentage': 6.0, 'order': 3},
              {'label': 'Wounded', 'value': 0.20, 'percentage': 20.0, 'order': 7},
              {'label': 'MIA', 'value': 0.21, 'percentage': 21.0, 'order': 5},
              {'label': 'Died', 'value': 0.06, 'percentage': 6.0, 'order': 4},
              {'label': 'KIA/Died Wounds', 'value': 0.03, 'percentage': 3.0, 'order': 6},
              {'label': 'NA', 'value': 0, 'percentage': 0 }]
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

    $scope.messes = ['Company', "Mess 1", "Mess 2", "Mess 3", "Mess 4", "Mess 5", "Mess 6", "Officers"];

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
        case "MIA":
          return "missing";
      }
    }

    var root = angular.copy($scope.nationalAverages.occupation);

    d3.csv('data/formatted-messes-0316.csv', function(err, data) {
      d3.csv('data/locations.csv', function(err, locations) {
        _.each(data, function(d) {
          // GeoCode homes
          var geocode = _.find(locations, function(e) { return e.town === d.home;});
          if (geocode) {
            d.latitude = geocode.lat;
            d.longitude = geocode.lon;
          }
        })
        $scope.geocoder = locations;
        $scope.companyData = data;
        $scope.disaplyedData = angular.copy(data);
        $scope.$apply();
      })
    })
  });
