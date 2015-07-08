angular.module('RegisteredUsersCtrl', []).controller('RegisteredUsersController', function($scope,$http) {
	$scope.showItemList=[{"itemPerPage":"10 Users/Page","value":10},{"itemPerPage":"20 Users/Page","value":20},{"itemPerPage":"30 Users/Page","value":30}]
	$scope.limitPerPage = $scope.showItemList[0].value;
	$scope.firstUserDate = "notAssigned";
	$scope.lastUserDate = "notAssigned";
	$scope.keyword = "";
	
	$scope.searchUsers = function(){
		
		$http({
            url: '/user/getUsers',
            method: "GET",
            params:{keyword: $scope.keyword, firstDate: $scope.firstUserDate, lastDate: $scope.lastUserDate, limit:$scope.limitPerPage}
    	
         }).success(function(data) {
        	
        	 if(data.users.length==0){
        		 $scope.userlist = [];
        		 $scope.noDataFound=true;
        		 $scope.hideToFrom=true;
        	 }else{
    			 $scope.userlist = data.users;
        		 $scope.totalRecords = data.totalRecords; 
            	 if(data.users.length>0 && data.users.length<=$scope.limitPerPage){
            		 $scope.fromOrderNo = 1;
            		 $scope.toOrderNo = data.users.length;
            		 $scope.hideToFrom=false;
            	 }else if(data.users.length>0 && data.users.length>$scope.limitPerPage){
            		 $scope.fromOrderNo = 1;
            		 $scope.toOrderNo = $scope.limitPerPage;
            		 $scope.hideToFrom=false;
            	 }
            	 
            	 if($scope.totalRecords>$scope.fromOrderNo+($scope.limitPerPage-1)) $scope.disableNextButton =false;
            	 else $scope.disableNextButton =true; 
            	 
            	 $scope.disablePrevButton =true;
            	 $scope.firstUserDate = data.users[0].createdAt;
            	 $scope.lastUserDate = data.users[data.users.length-1].createdAt;
            	 $scope.noDataFound=false;
        	 }
         }).error(function(data) {
    			console.log('Error: ' + data);
    	 });
    }
	
	$scope.nextPage = function(){
		//alert($scope.keyword +" "+$scope.firstUserDate +" "+$scope.lastUserDate +" "+$scope.limitPerPage )
		$http({
			url: '/user/getUsers',
            method: "GET",
            params:{keyword: $scope.keyword, firstDate: "notAssigned", lastDate: $scope.lastUserDate, limit:$scope.limitPerPage}
         }).success(function(data) {
        	 $scope.userlist = data.users;
        	 
        	 if(data.users.length<=$scope.limitPerPage){
        		 $scope.fromOrderNo = $scope.fromOrderNo + $scope.limitPerPage;
        		 $scope.toOrderNo = $scope.toOrderNo + data.users.length;
        		
        	 }else if(data.users.length>$scope.limitPerPage){
        		 $scope.fromOrderNo = $scope.fromOrderNo + $scope.limitPerPage;
        		 $scope.toOrderNo = $scope.toOrderNo+$scope.limitPerPage;
        	 }
        	 
        	 if($scope.toOrderNo<$scope.totalRecords) $scope.disableNextButton =false;
        	 else $scope.disableNextButton =true;
        	 
        	 $scope.disablePrevButton = false;
        	 $scope.firstUserDate = data.users[0].createdAt;
        	 $scope.lastUserDate = data.users[data.users.length-1].createdAt;
        	 
         }).error(function(data) {
			console.log('Error: ' + data);
		 });
	}
	
	$scope.previousPage = function(){
		
		 $http({
			url: '/user/getUsers',
            method: "GET",
            params:{keyword: $scope.keyword, firstDate:$scope.firstUserDate, lastDate:"notAssigned", limit:$scope.limitPerPage}
         }).success(function(data) {
        	 $scope.userlist = data.users;
        	 
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
        	 $scope.firstUserDate = data.users[0].createdAt;
        	 $scope.lastUserDate = data.users[data.users.length-1].createdAt;
         
         }).error(function(data) {
			console.log('Error: ' + data);
		 });
	}
	
    
    $scope.searchUserByKeyword = function(keyword){
    	$scope.keyword = keyword;
    	$scope.firstUserDate = "notAssigned";
    	$scope.lastUserDate = "notAssigned";
    	$scope.searchUsers();
	}
	
	$scope.showItemCriteria = function(showCriteria){
		$scope.limitPerPage = showCriteria.value;
		$scope.firstUserDate = "notAssigned";
    	$scope.lastUserDate = "notAssigned";
    	$scope.searchUsers();
	}
	
	$scope.searchUsers();
	
});