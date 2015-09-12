'use strict';

angular.module('hophacksApp')
  .controller('ThingsCtrl', function ($rootScope, Modal, $modal, $scope, $http) {
  	$scope.list = function() {
      $http.get('/api/things/', event).success(function(data) {
        console.log('Got all the things!');
      })
  	}
});
