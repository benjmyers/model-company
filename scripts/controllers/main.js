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
              {'label': 'misc', 'value': .04, 'percentage': 4}]
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
        'daterange': ['05/01/1863', '05/03/1863'],
        'type': 'battle'
    }, {
        'name': 'Gettysburg',
        'daterange': ['07/01/1863', '07/03/1863'],
        'type': 'battle'
    }, {
        'name': 'Peachtree Creek',
        'date': '07/20/1864',
        'type': 'battle'
    },{
        'name': 'Expiration of 3 years enlistment',
        'date': '09/18/1864',
        'type': 'event'
    },  {
        'name': 'Muster Out',
        'date': '07/16/1865',
        'type': 'event'
    }]

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
          // Dates
          // if (d.dateout !== "NA") {
          //   var date = moment(d.dateout.trim(), "MM/DD/YYYY");
          //   d.dateout = date.valueOf();
          // }

        })
        $scope.companyData = data;
        $scope.$apply();
      })
    })
  });
