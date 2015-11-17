// public/js/controllers/NerdCtrl.js
angular.module('UserCtrl', []).controller('UserController',['$scope','$http','$state','ngDialog','$cookieStore', function($scope,$http,$state,ngDialog,$cookieStore) {
	
	$scope.user = {};
	
	$scope.limitPerPage = 10;
	$scope.user = $cookieStore.get('user');
	
	$scope.orderHistory = function(){
		$scope.firstOrderDate ="notAssigned";
		$scope.lastOrderDate ="notAssigned";
		
		$http({
            url: '/user/orderHistory',
            method: "GET",
            params:{emailId: $scope.user.emailId, firstDate: $scope.firstOrderDate, lastDate: $scope.lastOrderDate, limit:$scope.limitPerPage}
		
         }).success(function(data) {

        	 $scope.orderlist = data.items;
        	 if(data.items.length==0){
        		 $scope.noDataFound=true;
        	 }else{
        		 $scope.totalRecords = data.totalRecords; 
            	 if(data.items.length>0 && data.items.length<=$scope.limitPerPage){
            		 $scope.fromOrderNo = 1;
            		 $scope.toOrderNo = data.items.length;
            		 $scope.hideToFrom=false;
            	 }else if(data.items.length>0 && data.items.length>$scope.limitPerPage){
            		 $scope.fromOrderNo = 1;
            		 $scope.toOrderNo = $scope.limitPerPage;
            		 $scope.hideToFrom=false;
            	 }else if(data.items.length==0){
            		 $scope.hideToFrom=true;
            	 }
            	 
            	 if($scope.totalRecords>$scope.fromOrderNo+($scope.limitPerPage-1)) $scope.disableNextButton =false;
            	 else $scope.disableNextButton =true; 
            	 
            	 $scope.disablePrevButton =true;
            	 
            	 $scope.firstOrderDate = data.items[0].date;
            	 $scope.lastOrderDate = data.items[data.items.length-1].date;
            	 $scope.noDataFound=false;
        	 }
        	 
         
         
        	 $state.go('userPortal.orderHistory',{reload: true}); 
         
         }).error(function(data) {
			console.log('Error: ' + data);
		 });
	
	}
	
	$scope.nextPage = function(){
		
		$http({
            url: '/user/orderHistory',
            method: "GET",
            params: {emailId: $scope.user.emailId, firstDate: "notAssigned", lastDate: $scope.lastOrderDate, limit:$scope.limitPerPage}
         }).success(function(data) {
        	 $scope.orderlist = data.items;
        	 
        	 if(data.items.length<=$scope.limitPerPage){
        		 $scope.fromOrderNo = $scope.fromOrderNo + $scope.limitPerPage;
        		 $scope.toOrderNo = $scope.toOrderNo + data.items.length;
        	 }else if(data.items.length>$scope.limitPerPage){
        		 $scope.fromOrderNo = $scope.fromOrderNo + $scope.limitPerPage;
        		 $scope.toOrderNo = $scope.toOrderNo+$scope.limitPerPage;
        	 }
        	 
        	 if($scope.toOrderNo<$scope.totalRecords) $scope.disableNextButton =false;
        	 else $scope.disableNextButton =true;
        	 
        	 $scope.disablePrevButton = false;
        	 $scope.firstOrderDate = data.items[0].date;
        	 $scope.lastOrderDate = data.items[data.items.length-1].date;
        	 
         }).error(function(data) {
			console.log('Error: ' + data);
		 });
	}
	
	$scope.previousPage = function(){
		
		$http({
            url: '/user/orderHistory',
            method: "GET",
            params: {emailId: $scope.user.emailId, firstDate: $scope.firstOrderDate , lastDate: "notAssigned", limit:$scope.limitPerPage}
         }).success(function(data) {
        	 $scope.orderlist = data.items;
        	 
        	 if($scope.toOrderNo - $scope.fromOrderNo+1 == $scope.limitPerPage){
        		 $scope.fromOrderNo = $scope.fromOrderNo - $scope.limitPerPage;
        		 $scope.toOrderNo = $scope.toOrderNo - $scope.limitPerPage; 
        	 }else if($scope.toOrderNo - $scope.fromOrderNo+1 < $scope.limitPerPage){
        		 $scope.toOrderNo = $scope.fromOrderNo - 1;
        		 $scope.fromOrderNo = $scope.fromOrderNo - $scope.limitPerPage;
        	 }
        	 
        	 if($scope.fromOrderNo == 1) $scope.disablePrevButton =true;
        	 else $scope.disablePrevButton =false;
        	 
        	 $scope.disableNextButton =false;
        	 $scope.firstOrderDate = data.items[0].date;
        	 $scope.lastOrderDate = data.items[data.items.length-1].date;
         
         }).error(function(data) {
			console.log('Error: ' + data);
		 });
	}
	
	$scope.personalInfo = function(){
		
		$scope.firstOrderDate ="notAssigned";
		$scope.lastOrderDate ="notAssigned";
		
		
		
		$state.go('userPortal.personalInfo',{reload: true});
			
	}
	
	$scope.editInformation = function(){
		
		$scope.fullNameEnable = $scope.mobileNoEnable = $scope.hideSaveCancel = $scope.alternateNoEnable = $scope.passwordEnable = $scope.addressEnable = $scope.editInfolink = true;
		$scope.editUserPassMessage="";
	}
	
	$scope.cancel= function(){
		
		$scope.fullNameEnable = $scope.mobileNoEnable = $scope.hideSaveCancel = $scope.alternateNoEnable = $scope.passwordEnable = $scope.addressEnable = $scope.editInfolink = false;
	}
	
	$scope.save = function(){
			
		if( typeof($scope.user.fullName)=='undefined'||$scope.user.fullName==''||
	        typeof($scope.user.mobileNo)=='undefined'||$scope.user.mobileNo==''||
			typeof($scope.user.address)=='undefined'||$scope.user.address==''||
			typeof($scope.user.password)=='undefined'||$scope.user.password=='')
    	{
    		$scope.editUserFailMessage = "Required(*) field/(s) are missing !!!";
    		return false;
    	}
    	
    	else if($scope.user.fullName.length<3){
    		$scope.editUserFailMessage = "Your Full Name should contain atleast 3 characters!!!";
    		return false;
    	}
    	
    	else if(isNaN($scope.user.mobileNo)||isNaN($scope.user.alternateNo)){
    		
    		$scope.editUserFailMessage = "Mobile No. Or Alternate No. must be digits !!!";
    		return false;
    	}
    	
    	else if($scope.user.mobileNo.length!=10 || $scope.user.alternateNo.length!=10){
    		$scope.editUserFailMessage = "Mobile No. Or Alternate No. must contain 10 digits !!!";
    		return false;
    	}
    	
    	else{
    	
    	var userData ={
    			_id : $cookieStore.get('user')._id,
				fullName : $scope.user.fullName,
				emailId : $cookieStore.get('user').emailId,
				password : $scope.user.password,
				mobileNo : $scope.user.mobileNo,
				alternateNo : $scope.user.alternateNo,
				address : $scope.user.address
		};
		
		$http({
            url: '/user/editUser',
            method: "POST",
            data: JSON.stringify(userData),
            headers: {'Content-Type': 'application/json'}
          }).success(function (data, status, headers, config) {
        	  if(data.status=="failed"){
        		$scope.editUserFailMessage = data.message;  
        	  }else{
        		$cookieStore.remove('user');
		   		$cookieStore.put('user',data.user);
		   		$scope.editUserFailMessage="";
		   		$scope.hideSaveCancel=false;
		   		$scope.editUserPassMessage="Information has been saved Successfully !!!";
		   		$scope.fullNameEnable = $scope.mobileNoEnable = $scope.hideSaveCancel = $scope.alternateNoEnable = $scope.passwordEnable = $scope.addressEnable = $scope.editInfolink = false;
		   		if($cookieStore.get('editUserFlip')==false) $cookieStore.put('editUserFlip',true);
		   		else $cookieStore.put('editUserFlip',false);
		   	}
        	  
          }).error(function (data, status, headers, config) {
              
          });
    		
    	}
		
    
	}
	
	$scope.showOrder = function(orderObj){
		$scope.orderObject = orderObj;
		var dialog = ngDialog.open({
		      template: 'views/userTemplates/showOrder.html',
		      scope: $scope,
		      className: 'ngdialog-theme-default'
		});
	}
	
	$scope.expenseChart = function(){
		
		$scope.firstOrderDate ="notAssigned";
		$scope.lastOrderDate ="notAssigned";
		
		$state.go('userPortal.expenseChart',{reload: true});
	}
	
	
}]);
