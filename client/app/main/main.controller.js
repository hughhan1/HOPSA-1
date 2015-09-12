'use strict';

angular.module('hophacksApp')
  .controller('MainCtrl', function ($rootScope, Modal, $modal, $scope, $http, Auth) {
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
          size: 'sm',
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

    $scope.add = function(event) {
      event.latLng = {
        lat: $scope.latLng.lat(),
        lng: $scope.latLng.lng()
      };
      $http.post('/api/things/', event).success(function(data) {
        event._id = data._id;
        createMarker(event);
        console.log(event)
      });
      markers.push(event)
    }
  
   function makeMap(coords) {
     map = new google.maps.Map(document.getElementById('map'), {
      center: coords,
      zoom: 17
     });
      map.addListener('click', function(event) {
        $scope.latLng = event.latLng
        var addModal = $modal.open({
          templateUrl: 'components/modal/modal.html',
          windowClass: 'modal-primary',
          controller: 'ModalAddCtrl',
          size: 'sm'
        });

        addModal.result.then(function(data) {
          $scope.add(data)
        })
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