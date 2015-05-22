// public/js/controllers/NerdCtrl.js
angular.module('AddCtrl', []).controller('AddController', function($scope,$http,$location,$cookieStore) {

	$scope.formData = {};
	$scope.signUpBtnDisable = false;

    $scope.submit = function(){
    	
    	if($scope.userForm.$invalid) return false;
    	
    	else if(validateEmail($scope.userForm.emailId)==false){
    		$scope.signUpFailMessage = "Please provide a valid email address!!!";
    		return false;
    	}
    	else if($scope.userForm.fullName.length<3){
    		$scope.signUpFailMessage = "Your Full Name should contain atleast 3 characters!!!";
    		return false;
    	}
    		
    	else if($scope.userForm.password != $scope.userForm.rePassword){
    		$scope.signUpFailMessage = "Passwords are not Matching !!!";
    		return false;
    	}
    	
    	else if($scope.userForm.mobileNo.length!=10 || $scope.userForm.alternateNo.length!=10){
    		$scope.signUpFailMessage = "Mobile No. Or Alternate No. must contain 10 digits !!!";
    		return false;
    	}
    	
    	else{
    	
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
    		
    	}
		
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
    
    function validateEmail(email) {
    	
    	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    	if (!filter.test(email))  return false;
        else true;
    }
     
    
});    
      

