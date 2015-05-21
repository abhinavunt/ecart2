// public/js/controllers/NerdCtrl.js
angular.module('AddCtrl', []).controller('AddController', function($scope,$http,$location,$cookieStore) {

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
    
    
    $scope.login = function(){
    	
    	$http({
	   	    url: '/user/login', 
	   	    method: "POST",
	   	    params: {emailId: $scope.loginEmainId,password:$scope.loginPassword}
	   	 }).success(function(data) {
	   		 if(data.status=="pass"){
	   			$cookieStore.put('loggedIn',true);
	   			$cookieStore.remove('user');
		   		$cookieStore.put('user',data.user);
		   		$scope.loginFailMessage="";
		   		$location.path("/");
	   			
	   		 }else{
	   			$scope.loginFailMessage = data.message;
	   			
	   		 }
	   
	   	 }).error(function(data) {
	   		 console.log('Error: ' + data);
		 });
     }
    
});    
      

