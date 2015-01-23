'use strict';

/**
 * @ngdoc function
 * @name modelCompanyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the modelCompanyApp
 */
angular.module('modelCompanyApp')
  .controller('MainCtrl', function ($scope, $http) {

    $scope.nationalAverages = {
      'age': 25,
      'height': "5'8",
      'hair': [{'label': 'black', 'value': .13},
              {'label': 'dark', 'value': .25},
              {'label': 'brown', 'value': .3},
              {'label': 'light', 'value': .24},
              {'label': 'sandy', 'value': .04},
              {'label': 'red', 'value': .03},
              {'label': 'gray', 'value': .01}],
      'eyes': [{'label': 'blue', 'value': .45},
              {'label': 'gray', 'value': .24},
              {'label': 'hazel', 'value': .13},
              {'label': 'brown', 'value': .1},
              {'label': 'black', 'value': .08}],
      'complexion': [{'label': 'light', 'value': .6},
              {'label': 'dark', 'value': .33},
              {'label': 'medium', 'value': .7}],
      'occupation': [{'label': 'farmer', 'value': .48},
              {'label': 'mechanic', 'value': .24},
              {'label': 'laborer', 'value': .16},
              {'label': 'commercial', 'value': .05},
              {'label': 'professional', 'value': .03},
              {'label': 'misc', 'value': .04}]
    }
    d3.csv('data/formatted-messes.csv', function(err, data) {
      d3.csv('data/locations.csv', function(err, locations) {
        _.each(data, function(d) {
          var geocode = _.find(locations, function(e) { return e.town === d.home;});
          if (geocode) {
            d.latitude = geocode.lat;
            d.longitude = geocode.lon;
          }
        })
        $scope.data = data;
        $scope.$apply();
      })
    })
  });
