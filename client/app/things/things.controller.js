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

    $scope.getUrl = function(thing) {
    	console.log('things/' + thing._id);
    	return 'things/' + thing._id;
    }

    $scope.upvote = function(thing) {
    	if (Auth.isLoggedIn()) {
	    	var currVotes = thing[Auth.getCurrentUser()];
	    	if (currVotes == -1) {
	    		thing.votes = thing.votes + 1;
	    		thing[Auth.getCurrentUser()] = 0; 
	    	}
	    	else if (currVotes == 0 || currVotes == null) {
	    		thing.votes++;
	    		thing[Auth.getCurrentUser()] = 1
	    	} 	
	    	else {
	    		console.log("You cannot upvote twice.")
	    	}
	    	$http.put('/api/things/' + thing._id, thing).success(function(data) {
	    		// TODO: Refresh the page
	    		console.log('Upvoted event successfully');
	    	});
	    } else {
	    	console.log('User must be logged in.');
	    }
    }

    $scope.downvote = function(thing) {
    	if (Auth.isLoggedIn()) {
	    	var currVotes = thing[Auth.getCurrentUser()];
	    	if (currVotes == 1) {
	    		thing.votes = thing.votes - 1;
	    		thing[Auth.getCurrentUser()] = 0; 
	    	}
	    	else if (currVotes == 0 || currVotes == null) {
	    		thing.votes--;
	    		thing[Auth.getCurrentUser()] = -1
	    	} 	
	    	else {
	    		console.log("You cannot downvote twice.")
	    	}
	    	$http.put('/api/things/' + thing._id, thing).success(function(data) {
	    		// TODO: Refresh the page
	    		console.log('Downvote event successfully');
	    	});
	    } else {
	    	console.log('User must be logged in.');
	    }
    }

    $scope.delete = function(thing) {
    	if (thing.user == Auth.getCurrentUser()) {
    		$http.delete('/api/things/' + thing._id).success(function(data) {
    			// Refresh the page
    			console.log('Deleted event successfully');
    		});
    	} else {
    		console.log('You are not the creator of this event.');
    	}
  	}
  });
