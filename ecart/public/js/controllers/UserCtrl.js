// public/js/controllers/NerdCtrl.js
angular.module('UserCtrl', []).controller('UserController', function($scope,$http,$state,$cookieStore) {
	
	$scope.user = {};
	$scope.firstOrderDate ="notAssigned";
	$scope.lastOrderDate ="notAssigned";
	$scope.limitPerPage = 10;
	
	$scope.orderHistory = function(){
		
		$scope.user = $cookieStore.get('user');
		$http({
            url: '/user/orderHistory',
            method: "GET",
            params:{emailId: $scope.user.emailId, firstDate: $scope.firstOrderDate, lastDate: $scope.lastOrderDate, limit:$scope.limitPerPage}
		
         }).success(function(data) {

        	 $scope.orderlist = data.items;
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
         
         
        	 $state.go('userPortal.orderHistory',{reload: true}); 
         
         }).error(function(data) {
			console.log('Error: ' + data);
		 });
	
	}
	
	$scope.nextPage = function(){
		
		
		$http({
            url: '/order/orderList',
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
		
		var parameter;
		if($scope.searchCriteriaVal==4){
			parameter = {limit: $scope.orderPerPg,firstDate:$scope.firstOrderDate,lastDate:"notAssigned",searchCriteriaVal:$scope.searchCriteriaVal,criteriaYear:$scope.criteriaYear, criteriaMonth:$scope.criteriaMonth};
		}else{
			parameter = {limit: $scope.orderPerPg,firstDate:$scope.firstOrderDate,lastDate:"notAssigned",searchCriteriaVal:$scope.searchCriteriaVal};
		}
		
		$http({
            url: '/order/orderList',
            method: "GET",
            params: parameter
         }).success(function(data) {
        	 $scope.orderlist = data.items;
        	 
        	 if($scope.toOrderNo - $scope.fromOrderNo+1 == $scope.orderPerPg){
        		 $scope.fromOrderNo = $scope.fromOrderNo - $scope.orderPerPg;
        		 $scope.toOrderNo = $scope.toOrderNo - $scope.orderPerPg; 
        	 }else if($scope.toOrderNo - $scope.fromOrderNo+1 < $scope.orderPerPg){
        		 $scope.toOrderNo = $scope.fromOrderNo - 1;
        		 $scope.fromOrderNo = $scope.fromOrderNo - $scope.orderPerPg;
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


	$scope.expenseChart = function(){
		
		$scope.firstOrderDate ="notAssigned";
		$scope.lastOrderDate ="notAssigned";
		
		$state.go('userPortal.expenseChart',{reload: true});
	}
	
	
});
