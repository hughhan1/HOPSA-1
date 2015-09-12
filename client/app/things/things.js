'use strict';

angular.module('hophacksApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/things', {
        templateUrl: 'app/things/things.html',
        controller: 'ThingsCtrl'
      });
  });