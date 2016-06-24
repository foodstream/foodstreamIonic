//initiate angular app
var foodStream = angular.module("foodStream", ['ngRoute', 'ngFileUpload']);


//this controller shows an icon in the header upon user login and deals with routing in the app header
foodStream.controller('appController', ['$http', '$scope', '$location', 'logged', function($http, $scope, $location, logged){

  //create a variable that changes when user is logged in for ng-show
  $scope.logged = logged.pic;

  //get login token out of localstorage
  $scope.userToken = localStorage.getItem('token');
  //get userId out of localstorage
  userId = localStorage.getItem('userId');
  $scope.first;
  //check and see if user is logged in...if they are, show a user icon in the header that is a link to the edit-profile page
  if($scope.logged === true){
    $http.get('https://sheltered-wildwood-38449.herokuapp.com/users/'+userId+'.json?token='+$scope.userToken).then(function success(response){
          // console.log(response);
          $scope.first = response.data.first_name;
          $scope.last = response.data.last_name;
          $scope.email = response.data.email;
          $scope.org = response.data.organization;
          $scope.pic = response.data.profile_image
      }, function error(response){
        console.log('GET failed in appController');
    });
  };

  //when you click on the user icon, you go to the edit profile page...
  $scope.goToProfile = function(){
    $location.path('/editProfile');
  };
  //when you click on the foodstram logo, you go home
  $scope.goHome = function(){
    $location.path('/home');
  };

}]);


//this factory checks for a token, and if there is one tells the routing to let the user see more than just login/landing
foodStream.factory('logged', function($rootScope){
  //create an empty object for the factory to return values
 var logged = {}
 //get the token
 var userToken = localStorage.getItem('token');
 //if there is a token, return true for the header pic and site unlock
 if(userToken != null){
     logged.token = userToken;
     logged.pic = true;
    //  console.log(logged.pic);
   }

 return logged;
});

//this factory is used to find the user's geolocation in lat/long when needed
//from http://www.proccli.com/2013/10/angularjs-geolocation-service/
foodStream.factory("geoLocationService", ['$q', '$window', '$rootScope', function ($q, $window, $rootScope) {
    return function () {
        var deferred = $q.defer();

        if (!$window.navigator) {
            $rootScope.$apply(function() {
                deferred.reject(new Error("Geolocation is not supported"));
            });
        } else {
            $window.navigator.geolocation.getCurrentPosition(function (position) {
                $rootScope.$apply(function() {
                    deferred.resolve(position);
                });
            }, function (error) {
                $rootScope.$apply(function() {
                    deferred.reject(error);
                });
            });
        }
        return deferred.promise;
    }
}]);


//this module locks down any routes not marked as public access unless there is a token present in the logged factory.
angular.module('foodStream').run(function($rootScope, $location, $route, logged) {
    //tell route provider which routes are public
    var routesOpenToPublic = [];
    angular.forEach($route.routes, function(route, path) {
        // push route onto routesOpenToPublic if it has a truthy publicAccess value
        route.publicAccess && (routesOpenToPublic.push(path));
    });

    //allow user to use non-public routes only if token present
    $rootScope.$on('$routeChangeStart', function(event, nextLoc, currentLoc) {

        var closedToPublic = (-1 === routesOpenToPublic.indexOf($location.path()));
        if(closedToPublic && logged.token == undefined) {
            $location.path('/login');
        };
    });
});



//routing
foodStream.config(function($routeProvider){

  //check to see if the device is mobile
//   var _isNotMobile = (function() {
//     var check = false;
//     (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
//     return !check;
// })();
  $routeProvider
    .when('/landing', {
      //if the device is not mobile, take them to a page that tells them to use a mobile device
      // templateUrl: (_isNotMobile )? 'views/notMobile.html':'views/login.html',
      // controller: (_isNotMobile )?'MyHomeCtrl':'loginController',
      templateUrl: 'views/login.html',
      controller: 'loginController',
      publicAccess : true
    })

    .when('/signUp', {
      templateUrl : '/views/signup.html',
      controller : 'signUpController',
      publicAccess : true
    })

    .when('/editProfile', {
      templateUrl : '/views/editprofile.html',
      controller : 'editProfileController'
    })

    .when('/create', {
      templateUrl : '/views/create.html',
      controller : 'createController'
    })

    .when('/created', {
      templateUrl : '/views/created.html',
      controller : 'createdController'
    })

    .when('/home', {
      templateUrl : '/views/home.html',
      controller : 'homeController'
    })

    .when('/details', {
      templateUrl : '/views/postdetail.html',
      controller : 'detailController'
    })

    .when('/results', {
      templateUrl : '/views/searchresults.html',
      controller : 'resultsController'
    })

    .when('/claimed', {
      templateUrl : '/views/claimed.html',
      controller : 'claimedController'
    })

    .when('/profile', {
      templateUrl : '/views/profile.html',
      controller : 'profileController'
    })

    .when('/chat', {
      templateUrl : '/views/chat.html',
      controller: 'chatController'
    })

    .when('/profilePublic', {
      templateUrl : '/views/publicprofile.html',
      controller : 'publicProfileController'
    })

    .when('/editPost', {
      templateUrl : '/views/editpost.html',
      controller : 'editPostController'
    })

    .otherwise({
      redirectTo: '/landing'
    });

});
