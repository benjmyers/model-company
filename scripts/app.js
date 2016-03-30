'use strict';

/**
 * @ngdoc overview
 * @name modelCompanyApp
 * @description
 * # modelCompanyApp
 *
 * Main module of the application.
 */
angular
  .module('modelCompanyApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.checkbox',
    'smart-table'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
