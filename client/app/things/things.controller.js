'use strict';

angular.module('hophacksApp')
.controller('ThingsCtrl', function ($rootScope, Modal, $modal, $scope, $http, Auth) {

	$scope.things = [];
  	$http.get('/api/things/').success(function(data) {
  		data.forEach(function(thing) {
  			$scope.things.push(thing);
  			$scope.things.sort(function(x, y) {
			    if (x.votes < y.votes) return 1;
			    if (x.votes > y.votes) return -1;
			    return 0;
  			});
  		});
    });

    /**
     * Checks if the current user is the creator of a thing.
     * @param thing the thing to be checked
     * @return if the current user is the creator of the thing
     */
    $scope.isCreator = function(thing) {
        return thing.user._id == Auth.getCurrentUser()._id;
    }

  	/**
  	 * parseDate converts an ISODate String into a Date.
  	 * @param dateString an ISODate in String format
  	 * @return a Date representing a the ISODate String
  	 */
    $scope.parseDate = function(dateString) {
    	return new Date(dateString);
    }

  	/**
  	 * parseDate converts an ISODate String into a formatted String.
  	 * @param dateString an ISODate in String format
  	 * @return a String that is formatted, representing a the ISODate String
  	 */    
    $scope.prettyDate = function(dateString) {
    	var date = new Date(dateString);
    	var month = date.getMonth() + 1;
    	var day = date.getDate();
    	var hours = date.getHours();
    	var minutes = date.getMinutes() + "";
    	var ampm;

    	if (hours < 12) {
    		ampm = "AM";
    		if (hours == 0) {
    			hours = 12;
    		}
    	} else {
    		ampm = "PM"
    		hours -= 12;
    	}

        while (minutes.length < 2) {
            minutes = "0" + minutes;
        }
    	return month + '/' + day + ' ' + hours + ':' + minutes + ' ' + ampm;
    }

    /**
     * Gets the URL associated with a thing object.
     * @param thing
     * @return a String associated with the route for a controller
     */
    $scope.getUrl = function(thing) {
    	console.log('things/' + thing._id);
    	return 'things/' + thing._id;
    }

    $scope.upvote = function(thing) {
    	if (Auth.isLoggedIn()) {
    		var userAlreadyVoted = false;
    		thing.voted.forEach(function(userVote) {
    			if (userVote.userId == Auth.getCurrentUser()._id) {
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
    				userId: Auth.getCurrentUser()._id, 
    				vote: 1
    			});
    			thing.votes++
    		}
    		$http.put('/api/things/' + thing._id, thing).success(function(data) {
	    		console.log('Upvoted event with id ' + thing._id + ' successfully');
	    	});
    	} else {
    		$scope.error = "Please log in to continue.";
    	}
    }

    $scope.downvote = function(thing) {
    	if (Auth.isLoggedIn()) {
    		var userAlreadyVoted = false;
    		thing.voted.forEach(function(userVote) {
    			if (userVote.userId == Auth.getCurrentUser()._id) {
    				if (userVote.vote == -1) {
    					console.log("You cannot downvote twice.");
    				} else {
    					userVote.vote--;
    					thing.votes--;
    					if (thing.votes <= -5) {
    				        $http.delete('/api/things/' + thing._id).success(function(data) {
    						    console.log('Deleted event successfully');
    						});
    					}
    				}
    				userAlreadyVoted = true;
    			}
    		});
    		if (!userAlreadyVoted) {
    			thing.voted.push({
    				userId: Auth.getCurrentUser()._id, 
    				vote: -1
    			});
    			thing.votes--
    		}
    		$http.put('/api/things/' + thing._id, thing).success(function(data) {
	    		console.log('Downvoted event with id ' + thing._id + ' successfully');
	    	});
    	} else {
            $scope.error = "Please log in to continue.";
    	}
    }

    $scope.delete = function(thing) {
    	if (thing.user._id == Auth.getCurrentUser()._id) {
    		$http.delete('/api/things/' + thing._id).success(function(data) {
    			console.log('Deleted event successfully');
    		});
    	} else {
    		console.log('You are not the creator of this event.');
    	}

        for (var i = 0; i < $scope.things.length; ++i) {
            if ($scope.things[i]._id === thing._id) {
                $scope.things.splice(i--, 1);
            }
        }
  	}
});
