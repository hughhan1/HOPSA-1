'use strict';

angular.module('hophacksApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .when('/things', {
        templateUrl: 'app/things/things-list.html',
        controller: 'ThingsCtrl'
      })
      .when('things/:thingId', {
        templateUrl: 'app/things/things-view.html',
        controller: 'ThingsCtrl'
      });
  });