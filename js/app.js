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

window.isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};
