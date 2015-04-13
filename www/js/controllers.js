angular.module('starter.controllers', [])

.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

//-----Login-----

  .controller("LoginController",function($scope, $firebaseAuth, $state) {

    var ref = new Firebase("https://esparrago-test.firebaseio.com");
    var auth = $firebaseAuth(ref);

    $scope.login = function (user){

      auth.$authWithOAuthPopup('facebook').then(function (authData) {
        console.log("Login/Logged in asss:" + authData.uid);
        console.log(authData);
        console.log(authData.facebook.displayName);
        $state.go('home.venues');
        //Agregar Usuario
        ref.child("users").child(authData.uid).set({
          email: authData.facebook.email,
          displayName: authData.facebook.displayName,
          friends: "",
        });
      })


    }

  })

//-----Home/Menu-----

  .controller("HomeCtrl", function($scope, Auth, $state) {
    $scope.auth = Auth;
    var userData = $scope.auth.$getAuth();

    if (userData) {
      console.log("Home/Logged in as:", userData.uid , userData.facebook.displayName);
      $scope.userData = userData;
    } else {
      console.log("Home/Logged out");
    }
  })

//-----Venues/Bares-----

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

//-----Single Venue/Bar-----

  .controller('PlaylistCtrl', function($scope, $stateParams) {

  })


//-----Chat-----

  .controller("ChatCtrl", ["$scope", "Auth", "$firebaseArray",
    function($scope, Auth, $firebaseArray) {

      var userData = $scope.auth.$getAuth();

      $scope.user = userData.uid;

      var ref = new Firebase("https://esparrago-test.firebaseio.com/messages");
      // create a synchronized array
      // click on `index.html` above to see it used in the DOM!
      $scope.messages = $firebaseArray(ref);
    }
  ])

//-----Camera-----

  .controller("CameraCtrl", function($scope, Camera, $http) {

      console.log("camera");
      $scope.getPhoto = function() {
        console.log('Getting camera');
        Camera.getPicture({
          quality: 75,
          targetWidth: 720,
          targetHeight: 720,
          saveToPhotoAlbum: false
        })
        .then(function(imageURI) {
          console.log(imageURI);
          $scope.lastPhoto = imageURI;

          //cloudinary
          var file = $scope.lastPhoto;
          var cloud_name = 'hazzleapp';

          var fd = new FormData();

          fd.append('upload_preset', 'seller');
          fd.append('file', file);

          $http
              .post('https://api.cloudinary.com/v1_1/' + cloud_name + '/image/upload', fd, {
                  headers: {
                      'Content-Type': undefined,
                      'X-Requested-With': 'XMLHttpRequest'
                  }
              })
              .success(function (cloudinaryResponse) {

                  // do stuff with cloudinary response
                  // cloudinaryResponse = { public_id: ..., etc. }

              })
              .error(function (reponse) {


              });
        },
        function(err) {
          console.err(err);
        });
      }
  });





