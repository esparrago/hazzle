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

angular.module('com.htmlxprs.starter.controllers',[])

.controller('LoginController',['$scope','https://esparrago-test.firebaseio.com','$firebaseSimpleLogin','userSession',function($scope,esparrago,$firebaseSimpleLogin,userSession){
    userSession.auth=$firebaseSimpleLogin(new Firebase(esparrago));

    $scope.login=function(provider){
        userSession.auth.$login(provider);
    }

}])

.controller('AppCtrl',['$scope','https://esparrago-test.firebaseio.com', '$firebaseSimpleLogin', 'userSession',function($scope,$firebaseSimpleLogin,userSession){

  $scope.user=userSession.user;

  $scope.logout=function(){
    userSession.auth.$logout();
  }

}]);

