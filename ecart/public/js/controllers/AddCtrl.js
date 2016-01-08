// public/js/controllers/NerdCtrl.js
angular.module('AddCtrl', []).controller('AddController',['$scope','$http','$location','$state','ngDialog','$cookieStore','usSpinnerService', function($scope,$http,$location,$state,ngDialog,$cookieStore,usSpinnerService) {

	$scope.formData = {};
	$scope.signUpBtnDisable = false;
	$scope.step1block = false;
	$scope.step2block = true;

    $scope.submit = function(checkout){
    	
    	$scope.signUpFailMessage="";
    	
    	if( typeof($scope.userForm.fullName)=='undefined'||$scope.userForm.fullName==''||
	        typeof($scope.userForm.emailId)=='undefined'||$scope.userForm.emailId==''||
			typeof($scope.userForm.mobileNo)=='undefined'||$scope.userForm.mobileNo==''||
			typeof($scope.userForm.address)=='undefined'||$scope.userForm.address==''||
			typeof($scope.userForm.password)=='undefined'||$scope.userForm.password==''||
			typeof($scope.userForm.rePassword)=='undefined'||$scope.userForm.rePassword=='')
    	{
    		$scope.signUpFailMessage = "Required(*) field/(s) are missing !!!";
    		return false;
    	}
    	
    	else if(validateEmail($scope.userForm.emailId)==false){
    		$scope.signUpFailMessage = "Please provide a valid email address!!!";
    		return false;
    	}
    	else if($scope.userForm.fullName.length<3){
    		$scope.signUpFailMessage = "Your Full Name should contain atleast 3 characters!!!";
    		return false;
    	}
    		
    	else if(($scope.userForm.password).trim() != ($scope.userForm.rePassword).trim()){
    		$scope.signUpFailMessage = "Passwords are not Matching !!!";
    		return false;
    	}
    	
    	else if(isNaN($scope.userForm.mobileNo)||isNaN($scope.userForm.alternateNo)){
    		
    		$scope.signUpFailMessage = "Mobile No. Or Alternate No. must be digits !!!";
    		return false;
    	}
    	
    	else if($scope.userForm.mobileNo.length!=10 || $scope.userForm.alternateNo.length!=10){
    		$scope.signUpFailMessage = "Mobile No. Or Alternate No. must contain 10 digits !!!";
    		return false;
    	}
    	
    	else{
    	usSpinnerService.spin('spinner-signup');
    	var userData ={
			
				fullName : $scope.userForm.fullName,
				emailId : $scope.userForm.emailId,
				password : $scope.userForm.password.trim(),
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
        	  usSpinnerService.stop('spinner-signup');
        	  if(data.status=="failed"){
        		  $scope.signUpFailMessage = data.message;  
        	  }else{
        		
        		$cookieStore.put('loggedIn',true);
        		//$cookieStore.put('headerTab',data.headerTab);
        		//$cookieStore.put('headerTabUrl',data.routeUrl);
        		$cookieStore.put('userType',data.role);
	   			$cookieStore.remove('user');
		   		$cookieStore.put('user',data.user);
		   		$scope.loginFailMessage="";
		   		
		   		if(checkout=='checkout') {
		   			
		   			$state.go("reviewOrder");
		   		}
		   		else $state.go("home");
        	}
        	  
          }).error(function (data, status, headers, config) {
              
          });
    		
    	}
		
    };
    
    $scope.guestCheckout = function(){
    	
    	$scope.guestCheckoutFailMessage="";
    	
    	if( typeof($scope.userForm.fullName)=='undefined'||$scope.userForm.fullName==''||
    		typeof($scope.userForm.mobileNo)=='undefined'||$scope.userForm.mobileNo==''||
			typeof($scope.userForm.address)=='undefined'||$scope.userForm.address=='')
			
    	{
    		$scope.guestCheckoutFailMessage = "Required(*) field/(s) are missing !!!";
    		return false;
    	}
    	
    	else if($scope.userForm.fullName.length<3){
    		$scope.guestCheckoutFailMessage = "Your Full Name should contain atleast 3 characters!!!";
    		return false;
    	}
    		
    	else if(isNaN($scope.userForm.mobileNo)){
    		
    		$scope.guestCheckoutFailMessage = "Mobile No. must be digits !!!";
    		return false;
    	}
    	
    	else if($scope.userForm.mobileNo.length!=10){
    		$scope.guestCheckoutFailMessage = "Mobile No. must contain 10 digits !!!";
    		return false;
    	}
    	
    	else{
    		
    		guestData = {
    				fullName : $scope.userForm.fullName,
    				emailId : "Not Applicable",
    				mobileNo : $scope.userForm.mobileNo,
    				alternateNo : "Not Applicable",
    				address : $scope.userForm.address
    		}
    		
    		$cookieStore.put('guest',guestData);
    		$scope.guestCheckoutFailMessage="";
    		$state.go("reviewOrder");
    	}
    	
    	
    }
    
    $scope.login = function(checkout){
    	$scope.loginFailMessage="";
    	if(typeof($scope.loginEmainId)=='undefined'||$scope.loginEmainId==''||
    	   typeof($scope.loginPassword)=='undefined'||$scope.loginPassword=='')
    	{
    		$scope.loginFailMessage = "Required(*) field/(s) are missing !!!";
    		return false;
    	}
    	
    	else if(validateEmail($scope.loginEmainId)==false){
    		$scope.loginFailMessage = "Please provide a valid email address!!!";
    		return false;
    	}
    	
    	else{
    		usSpinnerService.spin('spinner-login');
    		$http({
    	   	    url: '/user/login', 
    	   	    method: "POST",
    	   	    params: {emailId: $scope.loginEmainId,password:$scope.loginPassword}
    	   	 }).success(function(data) {
    	   		usSpinnerService.stop('spinner-login');
    	   		 if(data.status=="pass"){
    	   			
    	   			$cookieStore.put('loggedIn',true);
    	   			$cookieStore.put('userType',data.role);
    	   			//$cookieStore.put('headerTab',data.headerTab);
    	   			//$cookieStore.put('headerTabUrl',data.routeUrl);
    	   			$cookieStore.put('authKey',data.key);
    	   			$cookieStore.remove('user');
    		   		$cookieStore.put('user',data.user);
    		   		$scope.loginFailMessage="";
    		   		if(checkout=='checkout') {
    		   			
    		   			$state.go("reviewOrder");
    		   		}
    		   		else $state.go("home");
    		   		
    		   		
    		   	}else{
    	   			$scope.loginFailMessage = data.message;
    	   			
    	   		}
    	   
    	   	 }).error(function(data) {
    	   		 console.log('Error: ' + data);
    		 });
    	}
     };
     
     $scope.forgotPasswordOpen = function(){
     	$scope.regisEmailId="";
     	$scope.pwddRecvrFailMessage="";
     	$scope.step1block = false;
    	$scope.step2block = true;
    	$scope.tempPswd = "";
   	 	$scope.newPswd = "";
   	 	$scope.confirmNewPswd = "";
    	
     	
     	var dialog = ngDialog.open({
   	      template: 'views/forgotPassword.html',
   	      scope: $scope,
   	      className: 'ngdialog-theme-mini'
   	    });
     	
     };
     
     $scope.sendRegisteredEmail = function(regisEmailId){
     	$scope.regisEmailId = regisEmailId;
     	if(typeof($scope.regisEmailId)=='undefined'||$scope.regisEmailId==''){
     		$scope.pwddRecvrFailMessage = "Required(*) field/(s) are missing !!!";
     		return false;
     	}
     	    	
     	else if(validateEmail($scope.regisEmailId)==false){
     		$scope.pwddRecvrFailMessage = "Please provide a valid email address!!!";
     		return false;
     	}else{
     		usSpinnerService.spin('spinner-pswRecovery');
     		var registeredEmailObj = {emailId:$scope.regisEmailId};
     		
     		$http({
                 url: '/user/validateRegisteredEmail',
                 method: "POST",
                 data: JSON.stringify(registeredEmailObj),
                 headers: {'Content-Type': 'application/json'}
               }).success(function (data, status, headers, config) {
            	  usSpinnerService.stop('spinner-pswRecovery');
             	  if(data.status=="fail") $scope.pwddRecvrFailMessage = data.message;
             	  else{
             		  $scope.step1block = true;
             		  $scope.step2block = false; 
             	  }
             	  
               }).error(function (data, status, headers, config) {
                   
               });
     	}
     }
     
    $scope.settingNewPassword = function(tempPswd,newPswd,confirmNewPswd){
    	
    	 $scope.tempPswd = tempPswd.trim();
    	 $scope.newPswd = newPswd.trim();
    	 $scope.confirmNewPswd = confirmNewPswd.trim();
    	 
    	 if( typeof($scope.tempPswd)=='undefined'||$scope.tempPswd==''||
	         typeof($scope.newPswd)=='undefined'||$scope.newPswd==''||
			 typeof($scope.confirmNewPswd)=='undefined'||$scope.confirmNewPswd=='')
    	 {
    	    		$scope.pwddRecvrFailMessage = "Required(*) field/(s) are missing !!!";
    	    		return false;
    	 }
    	 
    	 else if($scope.newPswd != $scope.confirmNewPswd){
	    		$scope.pwddRecvrFailMessage = "New Password and Confirm New Password are not Matching !!!";
	    		return false;
    	 }else{
    		 
    		var changePasswordObj = {
    			 emailId : $scope.regisEmailId,
    			 tempPswd : $scope.tempPswd,
				 newPswd : $scope.newPswd
			};
    		 
    		 $http({
                 url: '/user/changeUserPassword',
                 method: "POST",
                 data: JSON.stringify(changePasswordObj),
                 headers: {'Content-Type': 'application/json'}
               }).success(function (data, status, headers, config) {
            	 if(data.status=="fail"){
            		 $scope.pwddRecvrFailMessage = data.message; 
            	 }else if(data.status=="pass"){
            		ngDialog.closeAll(); 
            	 }  
            	   
               }).error(function (data, status, headers, config) {
                   
               });
    	 }
    }
    
    function validateEmail(email) {
    	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    	if (!filter.test(email))  return false;
        else true;
    };
     
    
}]);    
      

