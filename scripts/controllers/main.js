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
    d3.csv('data/formatted-messes.csv', function(err, data) {
      d3.csv('data/locations.csv', function(err, locations) {
        _.each(data, function(d) {
          var geocode = _.find(locations, function(e) { return e.town === d.home;});
          if (geocode) {
            d.latitude = geocode.lat;
            d.longitude = geocode.lon;
          }
          else
            console.log(d.home)
        })
        $scope.data = data;
        $scope.$apply();
      })
    })
  });
