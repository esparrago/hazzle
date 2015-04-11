// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'firebase','com.hazzle.starter.services','com.hazzle.starter.controllers', 'starter.controllers', 'starter.directives','starter.filters'])

.run(function($ionicPlatform,$state,$rootScope,userSession) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

   $rootScope.$on('$firebaseSimpleLogin:login', function(event, user) {
       userSession.user=user;
       $state.go('home.venues');
       console.log(user);
   });

   $rootScope.$on('$firebaseSimpleLogin:error', function(event, error) {
        console.log('Error logging user in: ', error);
   });

   $rootScope.$on('$firebaseSimpleLogin:logout', function(event) {
         $state.go('login');
   });

  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider


  .state('login',{
        url:'/login',
        templateUrl:'templates/login.html',
        controller: 'LoginController'
    })

  .state('home', {
    url: "/home",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'HomeCtrl'
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
        controller: 'chatCtrl'
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


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('login');
});
