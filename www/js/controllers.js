angular.module('starter.controllers', [])

.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

//-----Login-----

  .controller("LoginController", function($scope, $firebaseAuth, $state) {

    var ref = new Firebase("https://esparrago-test.firebaseio.com");
    var auth = $firebaseAuth(ref);

    $scope.login = function (user){

      auth.$authWithOAuthPopup('facebook').then(function (authData) {
        console.log("Login/Logged in as:" + authData.uid);
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

  .controller("ChatCtrl", function($scope, Auth, $firebaseArray) {

    var userData = $scope.auth.$getAuth();
    $scope.user = userData.facebook.id;
    console.log('chat/' + $scope.user);
    $scope.userName = userData.facebook.displayName;


    var ref = new Firebase("https://esparrago-test.firebaseio.com/messages");
    // create a synchronized array
    // click on `index.html` above to see it used in the DOM!
    $scope.messages = $firebaseArray(ref);

    
    $scope.chatModel = {
      userid: $scope.user,
      text: '',
      name: $scope.userName,
    };

    $scope.$watch(function () { 
      return $scope.chatModel.text; 
    }, function (newValue, oldValue) {
      if (newValue === oldValue || !newValue) return;
      //console.log('text: ' + newValue);
    });

    $scope.addMessage = function() {
      console.log($scope.messageText);
      // $add on a synchronized array is like Array.push() except it saves to Firebase!
      $scope.messages.$add($scope.chatModel);
    };
  })



//-----Camera-----

  .controller("CameraCtrl", function($scope, Camera, $http, Cloudinary) {

      console.log($scope.imageUrl);

      console.log("camera");
      $scope.getPhoto = function() {
        console.log('Getting camera');
        Camera.getPicture({
          destinationType: navigator.camera.DestinationType.DATA_URL,
          quality: 75,
          targetWidth: 720,
          targetHeight: 720,
          saveToPhotoAlbum: false
        })

        .then(function(imageURI) {
          //console.log(imageURI),
          $scope.lastPhoto = imageURI,


        //cloudinary

          (function () {
            console.log('subiendo');
            //console.log('subiendo'+imageURI);
            Cloudinary.uploadImage(imageURI)

              .success(function (response) {
                console.log('SUCCESSFUL POST TO CLOUDINARY');
                console.log(response.url);
                console.log(response.secure_url);
                $scope.imageUrl=response.secure_url;
                var imageBytes=response.bytes;
                $scope.imageBytes = Math.ceil(imageBytes / 1000);
              })

              .error(function(error) {
                console.log('ERROR POSTING TO CLOUDINARY');
                console.error('getPhoto error', error);
              })
          })(),



          function (error) {
            console.error('getPhoto error', error);
          };

        }); //.then
      }; //getPhoto
  });//cameraCtrl





