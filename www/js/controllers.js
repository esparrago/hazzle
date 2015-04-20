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

  .controller("HomeCtrl", function($scope, Auth, $state, $ionicHistory) {
    $scope.auth = Auth;
    var userData = $scope.auth.$getAuth();

    if (userData) {
      console.log("Home/Logged in as:", userData.uid , userData.facebook.displayName);
      $scope.userData = userData;
    } else {
      console.log("Home/Logged out");
    }

    $scope.myGoBack = function() {
      $ionicHistory.goBack();
    };

    document.addEventListener("backbutton", function () {
        myGoBack();
        console.log("hola");
    });

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

<<<<<<< Updated upstream
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


=======
  // .controller("CameraCtrl", function($scope, Camera, $rootScope, $upload) {

  //     console.log("camera");
  //     $scope.getPhoto = function() {
  //       console.log('Getting camera');
  //       Camera.getPicture({
  //         quality: 75,
  //         targetWidth: 720,
  //         targetHeight: 720,
  //         saveToPhotoAlbum: false
  //       })
  //       .then(function(imageURI) {
  //         console.log(imageURI);
  //         $scope.lastPhoto = imageURI;

  //         //---Cloudinary----
  //         /* Uploading with Angular File Upload */

  //         $scope.$watch('files', function() {
  //           if (!$scope.files) return;

  //           $scope.files.forEach(function(file){
  //             $scope.upload = $upload.upload({
  //               url: "https://api.cloudinary.com/v1_1/" + $.cloudinary.config().cloud_name + "/upload",
  //               data: {upload_preset: $.cloudinary.config().upload_preset, context:'photo=' + $scope.title},
  //               file: file
  //             })

  //             console.log(upload)

  //             .progress(function (e) {
  //               file.progress = Math.round((e.loaded * 100.0) / e.total);
  //               file.status = "Uploading... " + file.progress + "%";
  //               if(!$scope.$$phase) {
  //                 $scope.$apply();
  //               }
  //             })
  //             .success(function (data, status, headers, config) {
  //               $rootScope.photos = $rootScope.photos || [];
  //               data.context = {custom: {photo: $scope.title}};
  //               file.result = data;
  //               $rootScope.photos.push(data);
  //               if(!$scope.$$phase) {
  //                 $scope.$apply();
  //               }
  //             })

  //             .error(function (data, status, headers, config) {
  //               console.log('error block');
  //             })
  //             upload(imageURI);
  //           });
  //         },

  //         function(err) {
  //           console.err(err);
  //         });
  //       })
  //     }
  // })


///-----Camera-----

  .controller("CameraCtrl", function($scope, Camera, $rootScope, $upload) {
          
          //---Cloudinary----
          /* Uploading with Angular File Upload */
          console.log('camera');

            var file = 'http://yjxd435wgma48foq911kjw11.wpengine.netdna-cdn.com/wp-content/uploads/google-logo.jpg'
            var cloud_name = 'hazzleapp'

            $scope.$watch('files', function() {
              if (!$scope.files) return;

            $scope.files.forEach(function(file){
              $scope.upload = $upload.upload({
                url: "https://api.cloudinary.com/v1_1/" + cloud_name + "/upload",
                file: file,
                api_key: '311441685958596',
                timestamp: '1315060510',
                signature: 'f4556941b33b7a04af78030f50586bc1cbaa7dce'
              })


              .progress(function (e) {
                file.progress = Math.round((e.loaded * 100.0) / e.total);
                file.status = "Uploading... " + file.progress + "%";
                if(!$scope.$$phase) {
                  $scope.$apply();
                }
              })
              .success(function (data, status, headers, config) {
                $rootScope.photos = $rootScope.photos || [];
                data.context = {custom: {photo: $scope.title}};
                file.result = data;
                $rootScope.photos.push(data);
                if(!$scope.$$phase) {
                  $scope.$apply();
                }
              })

              .error(function (data, status, headers, config) {
                console.log('error block');
              })
        });
    })
  })
>>>>>>> Stashed changes



