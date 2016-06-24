foodStream.controller('createController', ['$http', '$scope', '$location', 'Upload', function($http, $scope, $location, Upload){
  // console.log("create controller here!");

  //grab login token from localstorage
  var token = localStorage.getItem('token');
  var userId = localStorage.getItem('userId');

  //declare text field variables
  var title;
  var location;
  var startTime;
  var endTime;
  var description;
  var address;
  var lat;
  var lng;


  //point google places autocomplete to proper field
  var inputFrom = document.getElementById('create-post-location');

  //use google places autocomplete to input location addy & lat/long
  var autocompleteFrom = new google.maps.places.Autocomplete(inputFrom);
    google.maps.event.addListener(autocompleteFrom, 'place_changed', function() {
        var place = autocompleteFrom.getPlace();
        //set lat/lng/addy
        lat = place.geometry.location.lat();
        lng = place.geometry.location.lng();
        address = place.formatted_address;
          // console.log(lat, lng, address)
    });

  //use pickadate to get standardized date-times
  // starting time
  $(".create-start-na").pickadate({
  format: 'yyyy/mm/dd'});
  $(".create-start-time-na").pickatime({
  format: 'h:iA'});

  //ending time
  $(".create-end-na").pickadate({
  format: 'yyyy/mm/dd'});
  $(".create-end-time-na").pickatime({
  format: 'h:iA'});

  //click on the styled add pic div = click on hidden file input button
  $scope.addPic = function(){
    $('#file-input').click();
  }

  //declare photo upload check variable
  $scope.fileNameContents = false;
  //show that user has uploaded a file
  $scope.fileVerify = function(){
    if ($('#file-input').val() != ""){
      fileNameContents = true;
      return fileNameContents;
    }
  };

  //submit the post
  $scope.submitNewPost = function(file){
    //set post values
    title = $('.create-title').val();
    //create starting date for rails
    startDate = $('.create-start-na').val()
    startTime = $('.create-start-time-na').val();
    startString = startDate.concat(' ' + startTime);
    //create ending date for rails
    endDate = $('.create-end-na').val();
    endTime = $(".create-end-time-na").val();
    endString = endDate.concat(' ' + endTime);
    description = $('.create-description').val();

    //set form data
    var formData = new FormData();
    //only send the image if the user sets an image
    if(file != undefined){
    formData.append('post[post_image]', file);
    };
    formData.append('post[title]', title);
    formData.append('post[details]', description);
    formData.append('post[start_at]', startString);
    formData.append('post[end_at]', endString);
    formData.append('post[supplier_id]', userId);
    formData.append('post[address_string]', address);
    formData.append('post[latitude]', lat);
    formData.append('post[longitude]', lng);



    //send post values to rails to create a post!
    $http({
      method: 'POST',
      url:'https://sheltered-wildwood-38449.herokuapp.com/posts?token=' + token,
      data : formData,
      headers : {'Content-Type': undefined}
    }).then(function successCallback(response){
      console.log('new post was created');
      //set post id into LS so that we can migrate data to created view
      localStorage.setItem('postId', response.data.id)
      $location.path('/created')
    }, function errorCallback(response){
      console.log('post not created', response);
    });

  };//end of submit new post

}]);
