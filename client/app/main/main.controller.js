'use strict';

angular.module('hophacksApp')
  .controller('MainCtrl', function ($rootScope, Modal, $modal, $scope, $http) {
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
        host: event.host
      });
      marker.addListener('click', function() {
        infowindow.setContent(marker.name + '\n' + marker.desc);
        infowindow.open(map, this);
      });
   }

    $scope.add = function(event) {
      $scope.modal.close()
      $scope.modal = null;
      event.latLng = {
        lat: $scope.latLng.lat(),
        lng: $scope.latLng.lng()

      }
      createMarker(event)
      $http.post('/api/things/', event).success(function(data) {
        console.log('Posted event to mongodb successfully')
      })
      markers.push(event)
    }
  
   function makeMap(coords) {
     map = new google.maps.Map(document.getElementById('map'), {
      center: coords,
      zoom: 17
     });
      map.addListener('click', function(event) {
        $scope.latLng = event.latLng
        var modal = $modal.open({
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
