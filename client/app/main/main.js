'use strict';

angular.module('hophacksApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .when('/things', {
        templateUrl: 'app/things/things.html',
        controller: 'ThingsCtrl'
      })
      .when('things/:thingId', {
        templateUrl: 'app/things/thing.html',
        controller: 'ThingsCtrl'
      });
  });