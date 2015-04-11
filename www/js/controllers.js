angular.module('starter.controllers', [])

.controller('venuesCtrl', function($scope) {
  $scope.venues = [
    { title: 'Armando Records', checkins:'30', img: 'armando_records.jpg' , id: 1 },
    { title: 'Andres DC', checkins:'25', img: 'andres_dc.jpg' , id: 2 },
    { title: 'BBC 85', checkins:'20', img: 'bbc_85.jpg' , id: 3 },
    { title: 'El coq', checkins:'18', img: 'el_coq.jpg' , id: 4 },
    { title: 'The Irish Pub', checkins:'15', img: 'the_irish_pub.jpg' , id: 5 },
    { title: 'La Villa', checkins:'10', img: 'la_villa.jpg' , id: 6 }
  ];

})

.controller('PlaylistCtrl', function($scope, $stateParams) {

})

var esparrago = "https://esparrago-test.firebaseio.com"



angular.module('com.hazzle.starter.controllers',['com.hazzle.starter.services'])

.controller('LoginController',['$scope','https://esparrago-test.firebaseio.com','$firebaseSimpleLogin','userSession',function($scope,esparrago,$firebaseSimpleLogin,userSession){
    userSession.auth=$firebaseSimpleLogin(new Firebase(esparrago));

    $scope.login=function(provider){
        userSession.auth.$login(provider);

    }

}])

.controller('HomeCtrl',['$scope','userSession',function($scope,userSession){

$scope.user=userSession.user;

$scope.logout=function(){
    userSession.auth.$logout();
}

}])


.controller('ChatCtrl', ['$scope','userSession'],function ($scope, simpleLogin, fbutil, $timeout) {

    //$scope.user = user;

    // synchronize a read-only, synchronized array of messages, limit to most recent 10
    $scope.messages = fbutil.syncArray('messages', {limitToLast: 10});

    // display any errors
    $scope.messages.$loaded().catch(alert);

    // provide a method for adding a message
    $scope.addMessage = function(newMessage) {
      if( newMessage ) {
        // push a message to the end of the array
        $scope.messages.$add({text: newMessage})
          // display any errors
          .catch(alert);
      }
    };


    function alert(msg) {
      $scope.err = msg;
      $timeout(function() {
        $scope.err = null;
      }, 5000);
    }
  });




