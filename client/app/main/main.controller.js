'use strict';

angular.module('hophacksApp')
  .controller('MainCtrl', function ($rootScope, Modal, $modal, $scope, $http, $window, Auth) {
   var map; 
   var markers = [];
   var infowindow = new google.maps.InfoWindow();

   function createMarker(event) {
      var marker = new google.maps.Marker({
        position: event.latLng,
        map: map,
        _id: event._id,
        name: event.name,
        desc: event.desc,
        host: event.host,
        votes: 0,
        user: Auth.getCurrentUser()
      });
      marker.addListener('click', function() {
        var that = this;
        var infoModal = $modal.open({
          templateUrl: 'components/modal/infomodal.html',
          windowClass: 'modal-success',
          controller: 'ModalInfoCtrl',
          backdrop: 'static',
          size: 'sm',
          scope:$scope,
          resolve: {
            event: function() {
              return that._id
            }
          }
        });

        infoModal.result.then(function(data) {
          $scope.add(data)
        })

        infowindow.setContent(marker.name + '\n' + marker.desc);
        infowindow.open(map, this); 
      });
   }

  /*    if (google.maps.geometry.spherical.computeDistanceBetween(event.latLng, navigator.geolocation.getCurrentPosition($scope.showPosition,$scope.showError,{timeout:10000}).latLng) < 300){
        console.log("Distance valid")
        var marker = new google.maps.Marker({
        position: event.latLng,
        map: map,
        name: event.name,
        desc: event.desc,
        host: event.host,
        votes: 0,
        user: Auth.getCurrentUser(),
        votedUsers: []
      });
      marker.addListener('click', function() {
      infowindow.setContent(marker.name + '\n' + marker.desc);
      infowindow.open(map, this);
      });
      return true
      }
      else {
        console.log("Distance invalid")
        $window.alert("You must be closer to the location to create it.")
        return false;
      }
   }
   else {
      console.log("Not logged in")
      $window.alert("You must be logged in to create an event.")
      return false;
   }
   return false
  }*/

    $scope.add = function(event) {
      event.latLng = {
        lat: $scope.latLng.lat(),
        lng: $scope.latLng.lng()
      };
        $http.post('/api/things/', event).success(function(data) {
        event._id = data._id;
        createMarker(event)
        console.log(event)
        });
        markers.push(event)
    }
      /*  $http.post('/api/things/', event).success(function(data) {
          console.log('Posted event to mongodb successfully');
        });
        markers.push(event) */
   /*   $http.post('/api/things/', event).success(function(data) {
        event._id = data._id;
        createMarker(event);
        console.log(event)
      });
      markers.push(event)
    }*/
  
   function makeMap(coords) {
     map = new google.maps.Map(document.getElementById('map'), {
      center: coords,
      zoom: 17
     });
      map.addListener('click', function(event) {
        $scope.latLng = event.latLng
        if (Auth.isLoggedIn()) {
          console.log("Is logged in")
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition( function(position) {
              
              console.log(google.maps.geometry.spherical.computeDistanceBetween(
              new google.maps.LatLng(position.coords.latitude, position.coords.longitude), 
              $scope.latLng))

            if (google.maps.geometry.spherical.computeDistanceBetween(
              new google.maps.LatLng(position.coords.latitude, position.coords.longitude), 
              $scope.latLng) < 50) {
              
              var addModal = $modal.open({
            templateUrl: 'components/modal/modal.html',
            windowClass: 'modal-primary',
            controller: 'ModalAddCtrl',
            size: 'sm'
            });

            addModal.result.then(function(data) {
            $scope.add(data)
            
            
            });
            }
            else {
              console.log("Distance invalid")
              $window.alert("You must be closer to the location to create it.")
            }}, function error(err) {alert('Please enable your GPS.')}, {enableHighAccuracy: true});
          }
          else {
            console.log("No geolocation")
          }
        }
        else {
          console.log("Not logged in")
          $window.alert("You must be logged in to create an event.")
        }
      });
     $http.get('/api/things/').success(function(data) {
      data.forEach(function(mark) {
        markers.push(mark)
        createMarker(mark)
      })
     })
   }
  if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

     /*   console.log("MAKING CIRCLE")
        var marker = new google.maps.Marker({
        map: map,
        position: coords,
        title: 'Current Location'
        });


        // Add circle overlay and bind to marker
        var circle = new google.maps.Circle({
        map: map,
        radius: 50,    
        fillColor: '#AA0000'
        });
        circle.bindTo('center', marker, 'position'); */

        makeMap(coords)
      }, function() {
      });
  } else {
  }
});


angular.module('hophacksApp').controller('ModalAddCtrl', function ($scope, $modalInstance) {
  $scope.modalEvent = {};
  $scope.send = function () {
    $modalInstance.close($scope.modalEvent);
    
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

angular.module('hophacksApp').controller('ModalInfoCtrl', function ($http, event, $scope, $modalInstance) {
  $http.get('/api/things/' + event).success(function(data) {
    $scope.modalEvent = data
  })
  $scope.send = function () {
    $modalInstance.close($scope.modalEvent);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
