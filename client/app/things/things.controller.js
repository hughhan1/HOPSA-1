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
    		var userAlreadyVoted = false;
    		thing.voted.forEach(function(userVote) {
    			if (userVote.user == Auth.getCurrentUser()) {
    				if (userVote.vote == 1) {
    					console.log("You cannot upvote twice.");
    				} else {
    					userVote.vote++;
    					thing.votes++;
    				}
    				userAlreadyVoted = true;
    			}
    		});
    		if (!userAlreadyVoted) {
    			thing.voted.push({
    				user: Auth.getCurrentUser(), 
    				vote: 1
    			});
    			thing.votes++
    		}
    		$http.put('/api/things/' + thing._id, thing).success(function(data) {
	    		console.log('Upvoted event with id' + thing._id + 'successfully');
	    	});
    	} else {
    		console.log("User must be logged in.");
    	}
    }

    $scope.downvote = function(thing) {
    	if (Auth.isLoggedIn()) {
    		var userAlreadyVoted = false;
    		thing.voted.forEach(function(userVote) {
    			if (userVote.user == Auth.getCurrentUser()) {
    				if (userVote.vote == -1) {
    					console.log("You cannot downvote twice.");
    				} else {
    					userVote.vote--;
    					thing.votes--;
    				}
    				userAlreadyVoted = true;
    			}
    		});
    		if (!userAlreadyVoted) {
    			thing.voted.push({
    				user: Auth.getCurrentUser(), 
    				vote: -1
    			});
    			thing.votes--
    		}
    		$http.put('/api/things/' + thing._id, thing).success(function(data) {
	    		console.log('Downvoted event with id' + thing._id + 'successfully');
	    	});
    	} else {
    		console.log("User must be logged in.");
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
