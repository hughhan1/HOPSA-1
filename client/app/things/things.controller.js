'use strict';

angular.module('hophacksApp')
  .controller('ThingsCtrl', function ($rootScope, Modal, $modal, $scope, $http, Auth) {

		$scope.things = [];
  	$http.get('/api/things/').success(function(data) {
  		data.forEach(function(thing) {
  			$scope.things.push(thing);
  		});
      console.log('Got all the things!');
    });

    $scope.upvote = function(thing) {
    	thing.votes++;
    	$http.put('/api/things/' + thing._id, thing).success(function(data) {
    		// Refresh the page
    		console.log('Upvoted event successfully');
    	});
    }

    $scope.downvote = function(thing) {
    	thing.votes--;
    	$http.put('/api/things/' + thing._id, thing).success(function(data) {
    		// Refresh the page
    		console.log('Upvoted event successfully');
    	});
    }

    $scope.delete = function(thing) {
    	if (thing.user == Auth.currentUser()) {
    		$http.delete('/api/things/' + thing._id).success(function(data) {
    		// Refresh the page
    		console.log('Deleted event successfully');
    	});
    }

	});
