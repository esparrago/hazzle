angular.module('starter.controllers', [])

.config(function($compileProvider){
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
})

//-----Login-----

  .controller("LoginController", function($scope, $firebaseAuth, $state, $firebaseArray) {

    var ref = new Firebase("https://esparrago-test.firebaseio.com/users");
    var auth = $firebaseAuth(ref);

    var usersref = new Firebase("https://esparrago-test.firebaseio.com/users");
    var users = $firebaseArray(usersref);



    $scope.login = function (user){

      auth.$authWithOAuthPopup('facebook').then(function (authData) {

        scope: "email,user_likes",

        console.log("Login/Logged in as:" + authData.uid);
        console.log(authData);
        console.log(authData.facebook.displayName);
        $state.go('home.venues');
        console.log(users);
        console.log(authData.facebook.email);

        // if (users.filter(function(e) { return e.$id == authData.uid; }).length > 0) {

        //   console.log('si funciono!!!');

        // }

        // else {

        //   console.log('funciono y no esta en base de datos!!!');
        // }

        if (users.filter(function(e) { return e.$id == authData.uid; }).length > 0) {

          console.log('El usuario existe');

        }

        else {


          console.log('usuario No existe');
//-----------  Agregar Usuario
        
        ref.child(authData.uid).set({
          // email: authData.facebook.email,
          displayName: authData.facebook.displayName,
        });

        }


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
      console.log($scope.chatModel.text);
      // $add on a synchronized array is like Array.push() except it saves to Firebase!
      $scope.messages.$add($scope.chatModel);
    };
  })



//-----Camera-----

  .controller("CameraCtrl", function($scope, Camera, $http, Cloudinary, $timeout, $ionicLoading, Auth, $firebaseArray, $firebaseObject) {

      console.log('imagen, ' + $scope.imageUrl);
      

      var userData = $scope.auth.$getAuth();
      var user = userData.facebook.id;
      $scope.user = userData.facebook.id;
      console.log('camera/' + user);
      console.log('uservar, ' + user);
      var ref = new Firebase("https://esparrago-test.firebaseio.com/users/" + userData.uid);
      $scope.users = $firebaseArray(ref);
      console.log($scope.users);
      console.log(ref);
      $scope.userImages = $firebaseArray(ref.child('images'));
      console.log($scope.userImages);


      $ionicLoading.show({
        template: 'Loading...',
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
      
      // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.
      $timeout(function () {
        $ionicLoading.hide();
      }, 500);

      console.log("camera");
      $scope.getPhoto = function() {
        console.log('Getting camera');
        var userData = $scope.auth.$getAuth();
        var user = userData.facebook.id;
        console.log('getPhoto - ' + user)
        Camera.getPicture({
          destinationType: navigator.camera.DestinationType.DATA_URL,
          quality: 60,
          targetWidth: 720,
          targetHeight: 720,
          saveToPhotoAlbum: false
        })

        .then(function(imageURI) {
          //console.log(imageURI),
          $scope.lastPhoto = imageURI,
          console.log('then - ' + user);


        //cloudinary

          (function () {
            console.log('subiendo');
            console.log('subiendo, ' + user);
            $ionicLoading.show({
              template: 'Loading...',
              content: 'Loading',
              animation: 'fade-in',
              showBackdrop: true,
              maxWidth: 200,
              showDelay: 0
            });
            //console.log('subiendo'+imageURI);
            Cloudinary.uploadImage(imageURI, user)

              .success(function (response) {
                console.log('SUCCESSFUL POST TO CLOUDINARY');
                console.log(response.url);
                console.log(response.secure_url);
                $scope.imgId=response.public_id;
                $scope.imageUrl=response.secure_url;
                var imageBytes=response.bytes;
                $scope.imageBytes = Math.ceil(imageBytes / 1000);
                $scope.userUid = "facebook:" + user;
                console.log($scope.userUid);
//--------------//add Img Url to firebase

                if ($scope.userImages){
                  console.log('Ya hay imagenes!');
                  $scope.userImages.$add({ url: $scope.imageUrl})
                    .then(function(ref) {
                      var id = ref.key();
                      console.log("added record with id " + id);
                      list.$indexFor(id); // returns location in the array
                    });
                }
                else {
                  console.log('no existen imagenes');
                  $scope.users.$add({
                    images:{ 
                      url: $scope.imageUrl
                    }
                  });
                }

                $ionicLoading.hide();
              })

              .error(function(error) {
                console.log('ERROR POSTING TO CLOUDINARY');
                console.error('getPhoto error', error);
                $ionicLoading.hide();
              })
          })(),

          function (error) {
            console.error('getPhoto error', error);
          };

        }); //.then
      }; //getPhoto
  })

  .controller("MyprofileCtrl", function($scope, Auth, $firebaseArray) {

    var userData = $scope.auth.$getAuth();
    $scope.user = userData.uid;
    console.log('chat/' + $scope.user);
    $scope.userid = userData.facebook.id;
    $scope.me = userData.facebook;
    console.log($scope.user);


    var ref = new Firebase("https://esparrago-test.firebaseio.com/users/" + $scope.user + "/images");
    // create a synchronized array
    // click on `index.html` above to see it used in the DOM!
    $scope.images = $firebaseArray(ref);
    console.log($scope.images);
  })



.controller("MyimagesCtrl", function($scope, Auth, $firebaseObject, $stateParams) {

    var imgid = $stateParams.imgid;
    $scope.imgid = imgid; 

    var userData = $scope.auth.$getAuth();
    $scope.user = userData.uid;
    console.log('chat/' + $scope.user);
    $scope.userid = userData.facebook.id;
    $scope.me = userData.facebook;
    console.log($scope.user);

    var href = ("https://esparrago-test.firebaseio.com/users/" + $scope.user + "/images" + $scope.imgid);

    var ref = new Firebase("https://esparrago-test.firebaseio.com/users/" + $scope.user + "/images/" + $scope.imgid);
    // create a synchronized array
    // click on `index.html` above to see it used in the DOM!
    $scope.image = $firebaseObject(ref);
    console.log(href);
    console.log($scope.image);
  })




.controller("AllusersCtrl", function($scope, Auth, $firebaseArray) {


    var ref = new Firebase("https://esparrago-test.firebaseio.com/users");
    // create a synchronized array
    // click on `index.html` above to see it used in the DOM!
    $scope.users = $firebaseArray(ref);
    console.log($scope.users);
  })


.controller("OtherusersCtrl", function($scope, Auth, $firebaseObject, $stateParams, $firebaseArray) {

    var userid = $stateParams.userid;
    $scope.fbuser = userid; 
    
    console.log(userid);
  

    var useruid = 'facebook:' + userid;
    console.log(useruid);

    var ref = new Firebase("https://esparrago-test.firebaseio.com/users/"+ useruid);
    // create a synchronized array
    // click on `index.html` above to see it used in the DOM!
    var user = $firebaseObject(ref);
    $scope.user = user;

    var imgref = new Firebase("https://esparrago-test.firebaseio.com/users/"+ useruid+"/images");
    // create a synchronized array
    // click on `index.html` above to see it used in the DOM!
    $scope.images = $firebaseArray(imgref);
    console.log($scope.images);


  })

.controller('GeoCtrl', function($scope, $ionicLoading, Fsapi, $http, $firebaseArray) {


  $scope.search_venue = {value: ''};


  $scope.$watch(function () {

      return $scope.search_venue.value; 
    }, function (newValue, oldValue) {
      if (newValue === oldValue || !newValue) return;
      //console.log('text: ' + newValue);
    });

  $scope.showOnlybars = function(name) {
    return  ! (name === 'Bar' || name ==='Brewery' || name ==='Lounge' || name === 'Night Market' || name ==='Nightclub' || name ==='Other Nightlife' || name === 'Speakeasy' || name ==='Strip Club' || name ==='Bowling Alley' || name === 'Tapas Restaurant' || name === 'Restaurant');
  }

  $scope.search = function(){

    console.log($scope.search_venue.value);

    navigator.geolocation.getCurrentPosition(function(position) {

      var lat =  position.coords.latitude;
      var lon =  position.coords.longitude;
      console.log("coords: " + lat + " , " + lon);

      $scope.city = "Bogota";
      $scope.ll = lat+","+lon;

      //------Request------
      
      Fsapi.get({ near: $scope.city, query: $scope.search_venue.value, ll: $scope.ll }, function (placesResult) {
        console.log("funciono");
        console.log(placesResult.response.venues);
        $scope.venues = placesResult.response.venues;
      }); 
    })
  }

  $scope.add_venue = function(info){

    console.log(info.name);

    $scope.db_venuesModel = {
      name: info.name,
      id: info.id,
      address: info.location.formattedAddress[0],
    };

    console.log($scope.db_venuesModel);

    var ref = new Firebase("https://esparrago-test.firebaseio.com/venues");
    $scope.db_venues = $firebaseArray(ref);
    $scope.db_venues.$add($scope.db_venuesModel);


  }
})


.controller('venuesListCtrl', function($scope, $ionicLoading, Fsapi, $http, $firebaseArray) {

  var ref = new Firebase("https://esparrago-test.firebaseio.com/venues");
  $scope.db_venues = $firebaseArray(ref);
})

.controller('venuesProfileCtrl', function($scope,$stateParams,$firebaseObject) {

  var venueName = $stateParams.venueName;

  var ref = new Firebase("https://esparrago-test.firebaseio.com/venues/"+venueName);
  $scope.db_venue = $firebaseObject(ref);
  console.log(venueName);
  console.log($scope.db_venue);

});
