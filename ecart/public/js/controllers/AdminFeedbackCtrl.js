angular.module('AdminFeedbackCtrl',[]).controller('AdminFeedbackController', function($scope,$http) {
	
	$scope.showFeedbackList=[{"feedbackPerPage":"10 Feedbacks/Page","value":10},{"feedbackPerPage":"20 Feedbacks/Page","value":20},{"feedbackPerPage":"30 Feedbacks/Page","value":30}]
	$scope.limitPerPage = $scope.showFeedbackList[0].value;
	$scope.firstFeedbackDate = "notAssigned";
	$scope.lastFeedbackDate = "notAssigned";
	
	
	$scope.searchFeedbacks = function(){
		 
		$http({
            url: '/admin/getFeedbacks',
            method: "GET",
            params:{firstDate: $scope.firstFeedbackDate, lastDate: $scope.lastFeedbackDate, limit:$scope.limitPerPage}
    	
         }).success(function(data) {
        	 
        	 if(data.feedbacks.length==0){
        		 $scope.feedbacklist = [];
        		 $scope.noDataFound=true;
        		
        	 }else{
    			 $scope.feedbacklist = data.feedbacks;
        		 $scope.totalRecords = data.totalRecords; 
            	 if(data.feedbacks.length>0 && data.feedbacks.length<=$scope.limitPerPage){
            		 $scope.fromFeedbackNo = 1;
            		 $scope.toFeedbackNo = data.feedbacks.length;
            	 }else if(data.feedbacks.length>0 && data.feedbacks.length>$scope.limitPerPage){
            		 $scope.fromFeedbackNo = 1;
            		 $scope.toFeedbackNo = $scope.limitPerPage;
            	 }
            	 
            	 if($scope.totalRecords>$scope.fromFeedbackNo+($scope.limitPerPage-1)) $scope.disableNextButton =false;
            	 else $scope.disableNextButton =true; 
            	 
            	 $scope.disablePrevButton =true;
            	 $scope.firstFeedbackDate = data.feedbacks[0].createdAt;
            	 $scope.lastFeedbackDate = data.feedbacks[data.feedbacks.length-1].createdAt;
            	 $scope.noDataFound=false;
        	 }
         }).error(function(data) {
    			console.log('Error: ' + data);
    	 });
    }
	
	$scope.nextPage = function(){
		//alert($scope.keyword +" "+$scope.firstFeedbackDate +" "+$scope.lastFeedbackDate +" "+$scope.limitPerPage )
		$http({
			url: '/user/getUsers',
            method: "GET",
            params:{keyword: $scope.keyword, firstDate: "notAssigned", lastDate: $scope.lastFeedbackDate, limit:$scope.limitPerPage}
         }).success(function(data) {
        	 $scope.feedbacklist = data.users;
        	 
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
        	 $scope.firstFeedbackDate = data.users[0].createdAt;
        	 $scope.lastFeedbackDate = data.users[data.users.length-1].createdAt;
        	 
         }).error(function(data) {
			console.log('Error: ' + data);
		 });
	}
	
	$scope.previousPage = function(){
		
		 $http({
			url: '/user/getUsers',
            method: "GET",
            params:{keyword: $scope.keyword, firstDate:$scope.firstFeedbackDate, lastDate:"notAssigned", limit:$scope.limitPerPage}
         }).success(function(data) {
        	 $scope.feedbacklist = data.users;
        	 
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
        	 $scope.firstFeedbackDate = data.users[0].createdAt;
        	 $scope.lastFeedbackDate = data.users[data.users.length-1].createdAt;
         
         }).error(function(data) {
			console.log('Error: ' + data);
		 });
	}
	
    
    $scope.searchUserByKeyword = function(keyword){
    	$scope.keyword = keyword;
    	$scope.firstFeedbackDate = "notAssigned";
    	$scope.lastFeedbackDate = "notAssigned";
    	$scope.searchUsers();
	}
	
	$scope.showItemCriteria = function(showCriteria){
		$scope.limitPerPage = showCriteria.value;
		$scope.firstFeedbackDate = "notAssigned";
    	$scope.lastFeedbackDate = "notAssigned";
    	$scope.searchUsers();
	}
	
	$scope.searchFeedbacks();
});
