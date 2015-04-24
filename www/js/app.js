// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js



// Global URL
var firebaseUrl = "https://esparrago-test.firebaseio.com";


angular.module('starter', ['ionic', 'firebase', 'starter.services', 'starter.controllers', 'starter.directives','starter.filters','cloudinary'])

.run(function($ionicPlatform,$state,$rootScope,$location,Auth,$ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    ionic.Platform.fullScreen();

    $rootScope.firebaseUrl = firebaseUrl;

    Auth.$onAuth(function (authData) {
      if (authData) {
          console.log("appjs/Logged in as:", authData.uid);
           $state.go('home.venues');
      }
      else {
          console.log("appjs/Not Logged");
          $ionicLoading.hide();
          $location.path('/login');
      }
    });

    $rootScope.logout = function () {
      console.log("Logging out from the app");
      Auth.$unauth();
    }

    $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
      // We can catch the error thrown when the $requireAuth promise is rejected
      // and redirect the user back to the home page
      if (error === "AUTH_REQUIRED") {
          $location.path("/login");
      }
    });

  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider


  .state('login',{
        url:'/login',
        templateUrl:'templates/login.html',
        controller: 'LoginController',
        resolve: {
          // controller will not be loaded until $waitForAuth resolves
          // Auth refers to our $firebaseAuth wrapper in the example above
          "currentAuth": ["Auth",
              function (Auth) {
                  // $waitForAuth returns a promise so the resolve waits for it to complete
                  return Auth.$waitForAuth();
          }]
        }
    })

  .state('home', {
    url: "/home",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'HomeCtrl',
    resolve: {
        // controller will not be loaded until $requireAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth",
            function (Auth) {
                // $requireAuth returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $stateChangeError (see above)
                return Auth.$requireAuth();
      }]
    }
  })

    .state('home.venues', {
      url: "/venues",
      views: {
        'menuContent': {
          templateUrl: "templates/venues.html",
          controller: 'venuesCtrl'
        }
      }
    })

  .state('home.chat', {
    url: "/chat",
    views: {
      'menuContent': {
        templateUrl: "templates/chat.html",
        controller: 'ChatCtrl'
      }
    }
  })

  .state('home.single', {
    url: "/venues/:venuesTitle",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'venuesCtrl'
      }
    }
  })

  .state('home.camera', {
    url: "/camera",
    views: {
      'menuContent': {
        templateUrl: "templates/camera.html",
        controller: 'CameraCtrl'
      }
    }
  })

  .state('home.me', {
    url: "/user/:userid",
    views: {
      'menuContent': {
        templateUrl: "templates/profile/me.html",
        controller: 'MyprofileCtrl'
      }
    }
  })

  .state('home.allusers', {
    url: "/allusers",
    views: {
      'menuContent': {
        templateUrl: "templates/profile/allusers.html",
        controller: 'AllusersCtrl'
      }
    }
  })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('login');
});
