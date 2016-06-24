foodStream.controller('createdController', ['$http', '$scope','$location', function($http, $scope, $location){

  //get the id of the created post out of LS
  var postId = localStorage.getItem('postId');
  //get token out of LS
  var token = localStorage.getItem('token');


  //go to chat and set variables needed by chat controller
  $scope.goToChat = function(postId, supplierId, claimantId){
    console.log(postId, supplierId, claimantId, $scope.post.title)
    localStorage.setItem('postId', postId);
    localStorage.setItem('chatSupplierId', supplierId);
    localStorage.setItem('chatClaimantId', claimantId);
    localStorage.setItem('chatPostTitle', $scope.post.title);
    $location.path('/chat');
  };


  //set variable for review
  $scope.claimerId;

  //get post information
  $http.get('https://sheltered-wildwood-38449.herokuapp.com/posts/'+postId+'.json?token='+token).then(function successCallback(response){
    $scope.post = response.data;
    // console.log($scope.post)
    $scope.claimerId = response.data.claimant_id;

    //use callback lat/long to display google map of post location
    var marker;
    var myLatLng;
    //set map latLng w/callback info
    myLatlng = new google.maps.LatLng($scope.post.latitude, $scope.post.longitude);
    var mapOptions = {
      zoom: 16,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    //render map
    var map = new google.maps.Map(document.getElementById("created-post-gmap"),
      mapOptions);
    //set marker
    var image = { url: './assets/images/foodstream_logo_marker.png', scaledSize: new google.maps.Size(100, 100)};
    var marker = new google.maps.Marker({
      position: myLatlng,
      title:"Food Is here",
      icon: image
    });
    //render marker
    marker.setMap(map);

    //set directions link
    $scope.directionsLink = 'https://maps.google.com?saddr=Current+Location&daddr='+$scope.post.latitude+','+$scope.post.longitude;

  }, function errorCallback(response){
    console.log('not get?', response);
  });

  //send calendar event to user
  $scope.addToCalendar = function(){
    $http.post('https://sheltered-wildwood-38449.herokuapp.com/posts/'+postId+'/send_ical?token='+token).then(function successCallback(response){
      alert('event sent to email');
    }, function errorCallback(response){
      console.log('event not sent', response);
    })
  }

  //go home
  $scope.goHome = function(){
    $location.path('/home');
  };

  //go to edit post
  $scope.goEdit = function(){
    $location.path('/editPost');
  };

  //delete post
  $scope.deletePost = function(){
    $http.delete('https://sheltered-wildwood-38449.herokuapp.com/posts/'+postId+'.json?token='+token).then(function successCallback(response){
      // console.log('deleted', response);
      localStorage.removeItem('createdPostId');
      $location.path('/home');
    }, function errorCallback(response){
      console.log('not delete?', response);
      localStorage.removeItem('createdPostId');

      $location.path('/home');
    });
  };

  //set variables for review modal
  modalShow = false;
  $scope.claimerRating = 0;
  userId = localStorage.getItem("userId");

  //allow supplier to mark the post as completed by completing a review of the transaction
  $scope.markComplete = function(){
      console.log($scope.post.claimed);
      $http.put('https://sheltered-wildwood-38449.herokuapp.com/posts/'+postId+'.json?token='+token, {completed:true}).then(function successCallback(response){
        // console.log('post completed successfully', response);
      }, function errorCallback(response){
        console.log('post not marked as completed');
      });

      $http.put('https://sheltered-wildwood-38449.herokuapp.com/users/' + $scope.claimerId + '.json?token=' + token + "&user[ratings_attributes][][rating]=" + $scope.claimerRating + "&user[ratings_attributes][][reviewer_id]=" + userId + "&user[ratings_attributes][][reviewed_id]=" + $scope.claimerId)
        .then(function successCallback(response){
          // console.log('review submitted!');
        }, function errorCallback(response){
          console.log("review didn't submit");
        });

      $location.path('/home');

      // console.log($scope.claimerRating);
  };
}]);
