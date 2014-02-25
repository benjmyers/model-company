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
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);
