// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'firebase','com.htmlxprs.starter.services','com.htmlxprs.starter.controllers', 'starter.controllers', 'starter.directives','starter.filters'])

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

   // $rootScope.$on('$firebaseSimpleLogin:login', function(event, user) {
   //     userSession.user=user;
   //     $state.go('app.venues');
   // });

   // $rootScope.$on('$firebaseSimpleLogin:error', function(event, error) {
   //      console.log('Error logging user in: ', error);
   // });

   // $rootScope.$on('$firebaseSimpleLogin:logout', function(event) {
   //       $state.go('app.venues');
   // });

  });
})



.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider


  .state('login',{
        url:'/login',
        templateUrl:'templates/login.html',
        controller: 'LoginController'
    })

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })

  .state('app.browse', {
    url: "/browse",
    views: {
      'menuContent': {
        templateUrl: "templates/browse.html"
      }
    }
  })
    .state('app.venues', {
      url: "/venues",
      views: {
        'menuContent': {
          templateUrl: "templates/venues.html",
          controller: 'venuesCtrl'
        }
      }
    })

  .state('app.single', {
    url: "/venues/:venuesTitle",
    views: {
      'menuContent': {
        templateUrl: "templates/playlist.html",
        controller: 'venuesCtrl'
      }
    }

  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('app/venues');
});
