foodStream.controller('claimedController', ['$http', '$scope', '$location', function($http, $scope, $location) {

  //get the ID of the post you just clicked
  var postId = localStorage.getItem('postId');
  //get the user token
  var token = localStorage.getItem('token');
  //get the user ID
  var userId  = localStorage.getItem('userId');



  //grab the post user supplier and claimant ID plus title of clicked post and go to chat
  $scope.goToChat = function(postId, supplierId, claimantId, title){
    localStorage.setItem('postId', postId);
    localStorage.setItem('chatSupplierId', supplierId);
    localStorage.setItem('chatClaimantId', claimantId);
    localStorage.setItem('chatPostTitle', title)
    $location.path('/chat');
  }

  //set directions variable
  $scope.directionsLink;

  //get the post info
  $http.get(
   'https://sheltered-wildwood-38449.herokuapp.com/posts/'+postId+'.json?token='+token).then(function successCallback(response){
    // console.log(response.data);

    $scope.post = response.data;

    //use callback lat/long to display google map of post location
    var marker;
    var myLatLng;
    //set map latLng w/callback info
    myLatlng = new google.maps.LatLng($scope.post.latitude, $scope.post.longitude);
    var mapOptions = {
      zoom: 13,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    //render map
    var map = new google.maps.Map(document.getElementById("claimed-map"),
      mapOptions);
    //set marker
    var image = { url: './assets/images/foodstream_logo_marker.png', scaledSize: new google.maps.Size(40, 40)};
    var marker = new google.maps.Marker({
      position: myLatlng,
      title:"Food Is here",
      icon: image
    });
    //render marker
    marker.setMap(map);

    //set directions link
    $scope.directionsLink = 'https://maps.google.com?saddr=Current+Location&daddr='+$scope.post.latitude+','+$scope.post.longitude;
    console.log($scope.directionsLink);

  }, function errorCallback(response){
    console.log('hate');
  });

  //add event to calendar via email
  $scope.addToCalendar = function(){
    $http.post('https://sheltered-wildwood-38449.herokuapp.com/posts/'+postId+'/send_ical?token='+token).then(function successCallback(response){
      alert('event sent to email');
    }, function errorCallback(response){
      console.log('event not sent', response);
      alert('there was an error, this event was not sent to email');
    });
  };

  //go home
   $scope.goHome = function(){
     $location.path('/home');
   }

//remove the user's claim from a post....the if/else is from  previous iteration but it works so it's there for now
 $scope.removePost = function(claimantId, supplierId){
  //  console.log(claimantId, supplierId)
   //if the user is the supplier, delete the post
   if(supplierId  == userId){
     $http.delete('https://sheltered-wildwood-38449.herokuapp.com/posts/'+postId+'.json?token='+token).then(function successCallback(response){
      //  console.log('post deleted')
       $location.path('/home')
     }, function errorCallback(response){
       console.log('not deleted')
     })
   }
     //if the user is the claimant, remove their claim
    else if(claimantId == userId){
       var param = JSON.stringify({claimed:'false', claimant_id: 'null'})
       $http.put('https://sheltered-wildwood-38449.herokuapp.com/posts/'+postId+'.json?token='+token, param).then(function successCallback(response){
        //  console.log('UNCLAIMED');
         $location.path('/home')
       }, function errorCallback(response){
         console.log('not unclaimed');
       });
     }
  }

}]);
