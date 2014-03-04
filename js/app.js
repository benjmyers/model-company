'use strict';


// Declare app level module which depends on filters, and services
angular.module('modelCo', [
  'ngRoute',
  'modelCo.filters',
  'modelCo.services',
  'modelCo.directives',
  'modelCo.controllers',
  'modelCo.d3'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: 'views/chart.html', controller: 'ChartCtrl'});
  $routeProvider.when('/about', {templateUrl: 'views/about.html'})
  $routeProvider.otherwise({redirectTo: '/'});
}]);

