foodStream.controller('editPostController', ['$http', '$scope', '$location', function($http, $scope, $location){
  // console.log('你好！我叫edit post controller!');

  //get user token for API auth
  var token = localStorage.getItem('token');
  //get the id of the post to edit out of LS
  var postId = localStorage.getItem('postId');

  //get the info for the post you want to edit
  $http.get('https://sheltered-wildwood-38449.herokuapp.com/posts/'+postId+'.json?token='+token).then(function successCallback(response){
    // console.log(response.data);
    //migrate data onto page
    $scope.postPic = response.data.post_image;
    $scope.title = response.data.title;
    $scope.location = response.data.address_string;
    //chop up the start date string to place the date and time in separate fields
    var startArr = response.data.start_at.split(' ');
    $('.edit-post-start-na').val(startArr[0]) ;
    $('.edit-post-start-time-na').val(startArr[1]) ;
    //chop up the end date string to place the date and time in separate fields
    var endArr = response.data.end_at.split(' ');
    $('.edit-post-end-na').val(endArr[0]);
    $('.edit-post-end-time-na').val(endArr[1]) ;
    $scope.description = response.data.details;
  }, function errorCallback(response){
    console.log('not get?', response);
  });

  //click on styled add image div = click on hidden file upload button
  $scope.addImage = function(){
    $('#file-input-edit-post').click();
  }


  //point google places autocomplete to correct field
  var inputFrom = document.getElementById('edit-post-location-ga');
  var lat;
  var lng;
  //use google places autocomplete to input location addy & lat/long
  var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom);
    google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
        var place = autocompleteFrom.getPlace();
        //set lat, lng and address
        lat = place.geometry.location.lat();
        lng = place.geometry.location.lng();
        address = place.formatted_address;
          // console.log(lat, lng, address)
    });

  //declare variable for grabbing location value w/jquery
  var location;

  //date/time picker for start time
  $(".edit-post-start-na").pickadate({
  format: 'yyyy/mm/dd'});
  $(".edit-post-start-time-na").pickatime({
  format: 'h:iA'});
  var startDate;
  var startTime;

  //date/time picker for end time
  $(".edit-post-end-na").pickadate({
  format: 'yyyy/mm/dd'});
  $(".edit-post-end-time-na").pickatime({
  format: 'h:iA'});
  var endDate;
  var endTime;

  //edit post function
  $scope.editPost = function(file){

    //set input variables
    title = $scope.title;
    location = $('#edit-post-location-ga').val();
    startDate = $('.edit-post-start-na').val();
    startTime = $('.edit-post-start-time-na').val();
    var startString = startDate.concat(' ' + startTime);
    endDate = $('.edit-post-end-na').val();
    endTime = $('.edit-post-end-time-na').val();
    var endString = endDate.concat(' ' + endTime);
    description = $scope.description;
    address = $('#edit-post-location-ga').val();

    // console.log($scope.title, location, startString, endString, $scope.description, lat, lng, file, address);

    //create new formdata to send to server
    var formData = new FormData();
      //if there is no file don't send anything to server
      if(file != undefined){
        formData.append('post[post_image]', file);
      };
      formData.append('post[title]', title);
      formData.append('post[details]', description);
      formData.append('post[start_at]', startString);
      formData.append('post[end_at]', endString);
      formData.append('post[address_string]', address);
      //if there is no lat/lng, dont send anything to server
      if(lat != undefined){
        formData.append('post[latitude]', lat);
      };
      if(lng != undefined){
        formData.append('post[longitude]', lng);
      };

    //send post values to rails to create a post!
    $http({
      method: 'PUT',
      url:'https://sheltered-wildwood-38449.herokuapp.com/posts/'+postId+'?token=' + token,
      data : formData,
      headers : {'Content-Type': undefined}
    }).then(function successCallback(response){
      //set the id of the post on success callback so that the info can be displayed on the created page
      localStorage.setItem('createdPostId', response.data.id);
      $location.path('/created');
    }, function errorCallback(response){
      console.log('post not created', response);
    });
  };//end of edit post function
}])
