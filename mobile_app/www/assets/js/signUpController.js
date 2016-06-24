

foodStream.controller('signUpController', ['$http', '$scope', '$location', function($http, $scope, $location) {
    // console.log("signup ctrllr up")

  //grab user information for signup, put relevant data into localstorage
  $scope.submit = function() {
    //declare varibles
    $scope.email;
    $scope.password;
    $scope.organization;

    //send the data to the server
    $http({
      method: 'POST',
      url: "https://sheltered-wildwood-38449.herokuapp.com/users?user[email]=" + $scope.email + "&user[password]=" + $scope.password + "&user[organization]=" + $scope.organization
    }).then(function successCallback(response) {
          //go back to login page and wait for email
          alert('you have been signed up, please check your email to confirm your address')
          $location.path('/landing');
      }, function errorCallback(response) {
          console.log(response);
          console.log('user not posted');
          alert('That email address is invalid or already taken, please try again')
      });

  };//close submit function


//already have an account? click here so you aren't trapped in signup if you are an existing user
    $scope.backToLogin = function(){
      $location.path('/landing');
    }
}]);
