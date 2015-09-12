'use strict';

angular.module('hophacksApp')
  .controller('MainCtrl', function ($rootScope, Modal, $modal, $scope, $http, $window, Auth) {
   var map; 
   var markers = [];
   var infowindow = new google.maps.InfoWindow();

  var marker = new google.maps.Marker({
    position: { lng: -76.62033677101135,
                lat: 39.3274509678524},
    map: map,
    name: 'test'
  });

   function createMarker(event) {

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
        $http.post('/api/things/', event).success(function(data) {
          console.log('Posted event to mongodb successfully');
        });
        markers.push(event)
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
      $scope.modal.close()
      $scope.modal = null;
      event.latLng = {
        lat: $scope.latLng.lat(),
        lng: $scope.latLng.lng()
      };
      if (Auth.isLoggedIn()) {
        console.log("Is logged in")

     // var location_timeout = setTimeout("geolocFail()", 10000);
        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( function(position) {
          console.log(google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(position.coords.latitude, position.coords.longitude), 
          new google.maps.LatLng(event.latLng.lat, event.latLng.lng)))

          if (google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(position.coords.latitude, position.coords.longitude), 
          new google.maps.LatLng(event.latLng.lat, event.latLng.lng)) < 150){
            createMarker(event)
          }
        else {
          console.log("Distance invalid")
          $window.alert("You must be closer to the location to create it.")
        }
        }, function error(err) {alert('Please enable your GPS.')}, {enableHighAccuracy: true});
      }
      else {
       console.log("No geolocation")
      }
    }
    else {
      console.log("Not logged in")
      $window.alert("You must be logged in to create an event.")
    }
      /*  $http.post('/api/things/', event).success(function(data) {
          console.log('Posted event to mongodb successfully');
        });
        markers.push(event) */
    }
  
   function makeMap(coords) {
     map = new google.maps.Map(document.getElementById('map'), {
      center: coords,
      zoom: 17
     });
      map.addListener('click', function(event) {
        $scope.latLng = event.latLng
        $scope.modal = $modal.open({
          templateUrl: 'components/modal/modal.html',
          windowClass: 'modal-primary',
          scope: $scope
        });
      })
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
        makeMap(coords)
      }, function() {
      });
  } else {
  }
});
