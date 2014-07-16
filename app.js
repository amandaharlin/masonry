var app = angular.module('plunker', []);


app.controller('exampleCtrl', function($scope) {

});


app.controller('masonryCtrl', function($scope, $attrs, photoService) {


  console.log($scope, $attrs.src)

  photoService
    .query($attrs.src)
    .then(function(data) {
      $scope.pictures = data;
    })


});


app.directive('masonry', function() {
  return {
    restrict: 'E',
    template: '<div ng-repeat="p in pictures"><brick value="p"></brick></div>',
    replace: true,
    controller: 'masonryCtrl',
    scope: {
      src: '@'
    }
  };
});

app.directive('brick', function($compile) {
  return {
    restrict: 'E',
    templateUrl: 'brick.html',
    scope: {
      value: "="
    }
  };
});



app.factory('photoService', ["$http", "$q",
  function($http, $q) {

    function query(src) {

      var deferred = $q.defer();

      function toLargeFormat(p) {
        p.image = p.media.m.replace('_m', '_z');
      }

      function successCb(result) {
        this.photos = result.items;
        angular.forEach(this.photos, toLargeFormat);
        deferred.resolve(this.photos);
      }

      function errorCb() {
        deferred.reject('Could not retrieve json');
      }
      if (this.photos) {
        deferred.resolve(this.photos);
      } else {

        var url = 'http://www.flickr.com/services/feeds/' + src + '&lang=en-us&format=json&jsoncallback=JSON_CALLBACK',
          opts = {
            cache: true
          };

        $http
          .jsonp(url, opts)
          .success(successCb)
          .error(errorCb);
      }

      return deferred.promise;
    }

    function hasPhotos() {
      return !!this.photos;
    }

    return {
      query: query,
      hasPhotos: hasPhotos
    };
  }
]);