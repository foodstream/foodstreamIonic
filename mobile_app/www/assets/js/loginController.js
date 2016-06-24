foodStream.controller('loginController', ['$http', '$scope', '$location', 'logged', function($http, $scope, $location, logged){

  //log in
  $scope.submitLogin = function(){
    // console.log('click');
    // console.log($scope.username);
    // console.log($scope.password);
    $http.post( 'https://sheltered-wildwood-38449.herokuapp.com/sessions/login?email='+$scope.username+'&password='+$scope.password
    ).then(function successCallback(response){
      //set required values into LS
      localStorage.setItem('token',response.data.token);
      localStorage.setItem('userId', response.data.id);
      localStorage.setItem('email', response.data.email);
      logged.token = response.data.token;
      $location.path('/home');
    }, function errorCallback(response){
      console.log('not post?', response)
      alert('that is not a valid username/password')
    });
  }//end of submit login

  $scope.submitSignup = function(){
    // console.log('click!!');
    $location.path('/signUp')
  }

}]);
