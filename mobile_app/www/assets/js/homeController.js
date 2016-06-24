foodStream.controller('homeController', ['$http', '$scope', '$location', 'geoLocationService', function($http, $scope, $location, geolocation){

  //get user token out of ls
  var token = localStorage.getItem('token');
  //get userID out of ls
  var userId = localStorage.getItem('userId');
  $scope.userId = userId;


  //define post variables
  $scope.posts;

  $scope.loadingIcon = true;

  //get user's posts.
  $http({
    method: 'GET',
    url:' https://sheltered-wildwood-38449.herokuapp.com/posts.json?token='+token
  }).then(function successCallback(response){
    // console.log(response.data);
    //set data for ng-repeat
    $scope.posts = response.data;
    $scope.loadingIcon = false;
  }, function errorCallback(response){
    // console.log(response)
    $scope.loadingIcon = false;
    $(".home-content-wrapper").append("<div class = 'search-error-message'>Sorry, an error occurred.</div>");
  });

  //declare filter variable for post filters
  $scope.filters = {};

  //see all posts where user is claimant
  $scope.seeClaimed = function(){
    $scope.filters = {};
    $scope.filters.claimant_id = userId;

  };

  //see all posts where user is supplier
  $scope.seeProvided = function(){
    $scope.filters = {};
    $scope.filters.supplier_id = userId;
  };

  //go to the chat
  $scope.goToChat = function(chatId, claimantId, supplierId, postTitle){
    // console.log(chatId, claimantId, supplierId, postTitle)
    localStorage.setItem('postId', chatId);
    localStorage.setItem('chatClaimantId', claimantId);
    localStorage.setItem('chatSupplierId', supplierId);
    localStorage.setItem('chatPostTitle', postTitle);
    $location.path('/chat');
  }

  //get the ID of the post a user wants more details on, and take them to claimed if they are the claimer and created if they are the supplier
  $scope.detailsId = function(postId, supplierId, claimantId){
    // console.log(postId, supplierId, claimantId)
    localStorage.setItem('postId', postId);
    if(supplierId == userId){
      $location.path('/created');
    }else if(claimantId == userId){
      $location.path('/claimed');
    }
  };

  //migrate user to search page
  $scope.search = function(){
    $location.path('/results');
  }

  //migrate user to create post page
  $scope.createPost = function(){
    $location.path('/create');
  };

}]);
