'use strict';

angular.module('hophacksApp')
  .controller('ThingsCtrl', function ($rootScope, Modal, $modal, $scope, $http) {
  	$scope.things;
  	$http.get('/api/things/').success(function(data) {
      $scope.things = data;
      console.log('Got all the things!');
    })
	});
