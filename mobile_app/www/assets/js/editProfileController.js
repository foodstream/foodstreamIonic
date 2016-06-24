foodStream.controller('editProfileController', ['$http', '$scope', '$location', 'logged', 'Upload', function($http, $scope, $location, logged, Upload){
  // console.log('edit ctrlr here');

  //get login token out of localstorage
  $scope.userToken = localStorage.getItem('token');
  //get userId out of localstorage
  userId = localStorage.getItem('userId');
  // console.log($scope.userToken)

  //declare input value variables
  $scope.first;
  $scope.last;
  $scope.email;
  $scope.org;
  $scope.userLocation;
  $scope.userDescription;
  $scope.myRating = 0;
  var lat;
  var lng;

  //allow user to logout
  $scope.logout = function(){
    //log them out of the server
    $http.get('https://sheltered-wildwood-38449.herokuapp.com/sessions/logout?token='+$scope.userToken).then(function successCallback(){
      // console.log('logged out');
      //clear everything out of LS on success to log them out of the angular app
      localStorage.clear();
      $location.path('/landing');
    }, function errorCallback(){
      console.log('not logged out');
      //they arent logged out of the server but we can still 'log them out' on our end by deleting LS
      localStorage.clear();
      $location.path('/landing');
    });

  };//close logout function



  //get user info to migrate onto page
  $http.get('https://sheltered-wildwood-38449.herokuapp.com/users/'+userId+'.json?token='+$scope.userToken).then(function success(response){
    //migrate response data to page
    $scope.first = response.data.first_name;
    $scope.last = response.data.last_name;
    $scope.email = response.data.email;
    $scope.org = response.data.organization;
    $scope.userLocation = response.data.address_string;
    $scope.userDescription = response.data.description;
    $scope.profilePic = response.data.profile_image;
    $scope.myRating = Math.round(response.data.average_rating);

    // console.log(response);
  }, function error(response){
    console.log('GET failed', response);
  });

  //conert server response to stars for ratings
  $scope.starConverter = function(){
    // console.log(Math.round($scope.myRating));
    for (var i = 1; i <= Math.round($scope.myRating); i++){
      // $(".edit-profile-rating").append();
      // console.log("star");
    };
  };

  //click on hidden image submit button to upload photo
  $scope.addImage = function(){
    $('#file-input-edit-profile').click();
  }

  //point google places autocomplete to the proper field
  var inputFrom = document.getElementById('edit-profile-location-input');

  //use google places autocomplete to input location addy & lat/long
  var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom);
      google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
          var place = autocompleteFrom.getPlace();
          //set lat/lng
          lat = place.geometry.location.lat();
          lng = place.geometry.location.lng();
          $scope.userLocation = place.formatted_address;
            // console.log(lat, lng, $scope.userLocation)
      });

  //click on the submit div to click hidden submit button
  $scope.submitProfile = function(){
    $('#edit-profile-submit-btn').click();
  };

  //grab the profile info field info and send it
  $scope.submitEdit = function(file){
    //render profile info as form data
    var formData = new FormData();
    //if there's no new file, don't send any data
    if( file != undefined){
      formData.append('user[profile_image]', file);
    };
    formData.append('user[first_name]', $scope.first);
    formData.append('user[last_name]', $scope.last);
    formData.append('user[description]', $scope.userDescription);
    formData.append('user[email]', $scope.email);
    formData.append('user[organization]', $scope.org);
    formData.append('user[address_string]', $scope.userLocation);
    //if there's no updated lat/long, don't send it
    if(lat != undefined){
      formData.append('user[latitude]', lat);
    };
    if(lng != undefined){
      formData.append('user[longitude]', lng);
    }

    //send the updated profile to rails on submit
    $http({
      method: 'PUT',
      url:'https://sheltered-wildwood-38449.herokuapp.com/users/'+userId+'?token='+$scope.userToken,
      data: formData,
      headers : {'Content-Type': undefined}
    }).then(function success(response){
        // console.log("edited successfully", response);
        localStorage.setItem('email', response.data.email);
        $location.path('/home');
      }, function error(response){
        // console.log("edit profile failed");
        // console.log(response);
        // alert('edit failed');
        $location.path('/home');
      });

  };//close submitEdit function

  $scope.fileVerify = function(){
    if ($('#file-input-edit-profile').val() != ""){
      fileNameContents = true;
      return fileNameContents;
    }
  };

}]);
