// public/js/controllers/NerdCtrl.js
angular.module('AddCtrl', []).controller('AddController', function($scope,$http,$location) {

	$scope.formData = {};
	$scope.signUpBtnDisable = false;

    $scope.submit = function(){
    	
    	var userData ={
    		
    			fullName : $scope.userForm.fullName,
    			emailId : $scope.userForm.emailId,
    			password : $scope.userForm.password,
    			mobileNo : $scope.userForm.mobileNo,
    			alternateNo : $scope.userForm.alternateNo,
    			address : $scope.userForm.address
    			
    	};
    	
    	
    	$http({
            url: '/user/addUser',
            method: "POST",
            data: JSON.stringify(userData),
            headers: {'Content-Type': 'application/json'}
          }).success(function (data, status, headers, config) {
        	  $location.path("/");
        	  $scope.signUpBtnDisable = true;
            }).error(function (data, status, headers, config) {
              
            });
    
    	
    	
    };
    
});    
      

