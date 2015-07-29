angular.module('starter.services', [])

//------------- ## Autentication ## -----------------------
  
  .factory("Auth", ["$firebaseAuth", "$rootScope",
    function ($firebaseAuth, $rootScope) {
      var ref = new Firebase(firebaseUrl);
      return $firebaseAuth(ref);
  }])


//------------- ## 4squareapi (search) ## -----------------------

  .factory('Fsapi', ['$resource',
    function ($resource) {
      var requestParms = {
        clientId: "DO5JJHGXBODWHZUZ2W45T0S35PKJH3MCLC1SKF5U4X3VF4YA",
        clientSecret: "GF0PDCNGEKSU2GI4ANGBGBKTEUU0G3E3QYPO5YWFXRV33GY5",
        version: "20131230"
      }
   
      var requestUri = 'https://api.foursquare.com/v2/venues/:action';

      return $resource(requestUri,
      {
          action: 'search',
          client_id: requestParms.clientId,
          client_secret: requestParms.clientSecret,
          v: requestParms.version,
          venuePhotos: '1',
          callback: 'JSON_CALLBACK'
      },
      {
          get: { method: 'JSONP' }
      })
  }])



  //------------- ## 4squareapi (Explore) ## -----------------------

  .factory('Fsapi_explore', ['$resource',
    function ($resource) {
      var requestParms = {
        clientId: "DO5JJHGXBODWHZUZ2W45T0S35PKJH3MCLC1SKF5U4X3VF4YA",
        clientSecret: "GF0PDCNGEKSU2GI4ANGBGBKTEUU0G3E3QYPO5YWFXRV33GY5",
        version: "20131230"
      }
   
      var requestUri = 'https://api.foursquare.com/v2/venues/:action';

      return $resource(requestUri,
      {
          action: 'explore',
          client_id: requestParms.clientId,
          client_secret: requestParms.clientSecret,
          v: requestParms.version,
          venuePhotos: '1',
          callback: 'JSON_CALLBACK'
      },
      {
          get: { method: 'JSONP' }
      })
  }])


//------------- ## Camera ## -----------------------

  .factory('Camera', ['$q', function($q) {
   
    return {
      getPicture: function(options) {
        var q = $q.defer();
        
        navigator.camera.getPicture(function(result) {
          // Do any magic you need
          q.resolve(result);
        }, function(err) {
          q.reject(err);
        }, options);
        
        return q.promise;
      }
    }
  }])

  //------------- ## Cloudinary-Info ## -----------------------

  .factory('CloudinaryConfig', function() {

    var cloudName = 'hazzleapp';
    var url = 'https://api.cloudinary.com/v1_1/'+ cloudName +'/image/upload';
    var apiKey = '311441685958596';
    var secret = 'l28qacTLOHZd-0Bi4vMPy5DL214';

    // Cloudinary needs a SHA1-hashed signature to authenticate uploads
    var getSignature = function(timestamp, userid) {
      // info on CryptoJS at https://code.google.com/p/crypto-js/#SHA-1
      // the docs leave out that you need to use toString to get the actual hash
      return CryptoJS.SHA1( 'folder=' + userid + '&' + 'timestamp=' + timestamp + '' + secret).toString();
    };

    return {
      cloudName: cloudName,
      url: url,
      apiKey: apiKey,
      secret: secret,
      getSignature: getSignature
    };
  })


  //------------- ## Cloudinary-Request ## -----------------------

  .factory('Cloudinary', ['$http', 'CloudinaryConfig', function($http, CloudinaryConfig, Auth) {

    // Upload image to Cloudinary storage
    // api docs at http://cloudinary.com/documentation/upload_images#remote_upload
    var uploadImage = function(imageURI, user) {
      var timestamp = +new Date();
      var userid = 'user_' + user;
      // console.log('ABOUT TO POST IMAGE TO CLOUDINARY');
      // console.log(timestamp);
      // console.log(CloudinaryConfig.getSignature(timestamp));
      // console.log('services URI'+ imageURI);
      console.log(user);

      // return a promise to get url from cloudinary
      return $http.post(CloudinaryConfig.url, {
        // need to specify base64 encoding (see http://stackoverflow.com/questions/24014937/uploading-base64-hashed-image-to-cloudinary
        // and http://en.wikipedia.org/wiki/Data_URI_scheme#JavaScript)
        file:'data:image/jpg;base64,'+ imageURI,
        api_key: CloudinaryConfig.apiKey,
        folder: userid,
        timestamp: timestamp,
        signature: CloudinaryConfig.getSignature(timestamp,userid)
      });
    };

    return {
      uploadImage: uploadImage
    };

  }]);


