// public/js/controllers/NerdCtrl.js
angular.module('HomeCtrl', []).controller('HomeController', function($scope,$http) {
	$scope.latestItemShow = [];
	$scope.offerItemShow = [];
	$scope.startIndex = 0;
	$scope.endIndex = 3;
	$scope.addItemsIndex = 4;
	$scope.lastLatestItemDate ="notAssigned";
	$scope.maxLimit = 6;
	$scope.latestItemsMaxLimit=0;
	
	$scope.getLatestItems = function(){
		
		
		$http({
            url: '/item/getLatestItems',
            method: "GET",
            params: {lastLatestItemDate:$scope.lastLatestItemDate,limitPerSlide:(2*$scope.addItemsIndex)}
         }).success(function(data) {
				
			$scope.latestItemList = data.latestItems;
			$scope.lastLatestItemDate=$scope.latestItemList[$scope.latestItemList.length-1].createdAt;
			
			if($scope.latestItemList.length<$scope.endIndex){
				for(var i=$scope.startIndex;i<$scope.latestItemList.length;i++){
					$scope.latestItemShow.push($scope.latestItemList[i]);
				}
			}else{
				for(var i=$scope.startIndex;i<=$scope.endIndex;i++){
					$scope.latestItemShow.push($scope.latestItemList[i]);
				}
			}
			
			$scope.previousLatestItemsBtn =true;
			if($scope.latestItemList.length<=$scope.endIndex+1) $scope.nextLatestItemsBtn =true;
			
			console.log($scope.latestItemList.length);
			
		}).error(function(data) {
				console.log('Error: ' + data);
		});
	}
	
	$scope.nextLatestItems = function(){
		$scope.startIndex = $scope.startIndex+$scope.addItemsIndex;
		$scope.endIndex = $scope.endIndex +($scope.latestItemList.length - $scope.startIndex);
		
		$scope.previousLatestItemsBtn =false;
		$scope.latestItemsMaxLimit = $scope.latestItemsMaxLimit+1;
		
		$scope.latestItemShow.splice(0,$scope.latestItemShow.length);
		for(var i=$scope.startIndex;i<=$scope.endIndex;i++){
			$scope.latestItemShow.push($scope.latestItemList[i]);
		}
		
		if((($scope.latestItemList.length - $scope.startIndex)<$scope.addItemsIndex)|| $scope.latestItemsMaxLimit==$scope.maxLimit){
			 $scope.nextLatestItemsBtn =true;
		}else{
			
			$http({
	            url: '/item/getLatestItems',
	            method: "GET",
	            params: {lastLatestItemDate:$scope.lastLatestItemDate,limitPerSlide:$scope.addItemsIndex}
	         }).success(function(data) {
	        	if(data.latestItems.length==0){
	        		$scope.nextLatestItemsBtn =true;
	        	}else{
	        		for(var i=0;i<data.latestItems.length;i++){
		        		$scope.latestItemList.push(data.latestItems[i]);
		        	}	
	        	}
	        	
	        	console.log($scope.latestItemList.length);
	         
	         }).error(function(data) {
					console.log('Error: ' + data);
	         });
		}
	}
	
	$scope.previousLatestItems = function(){
		
		var recentStrIndex = $scope.startIndex;
		
		$scope.endIndex =  $scope.startIndex-1;
		$scope.startIndex = $scope.startIndex-$scope.addItemsIndex;
		$scope.latestItemsMaxLimit = $scope.latestItemsMaxLimit-1;
		
		$scope.latestItemShow.splice(0,$scope.latestItemShow.length);
		for(var i=$scope.startIndex;i<=$scope.endIndex;i++){
			$scope.latestItemShow.push($scope.latestItemList[i]);
		}
		
		if($scope.latestItemList.length>(2*$scope.addItemsIndex)){
			for(var j=$scope.latestItemList.length-1;j>=recentStrIndex;j--){
				$scope.latestItemList.pop();
			}
		}
		
		if($scope.startIndex!=0) $scope.previousLatestItemsBtn =false;
		else $scope.previousLatestItemsBtn =true;
		$scope.nextLatestItemsBtn =false;
		
		console.log($scope.latestItemList.length);
		
		
	}
	
	
	$scope.getOfferItems = function(){
		
		$http.get('/item/getOfferItems')
		.success(function(data) {
				
			$scope.offerItemList = data.offerItems;
			if($scope.offerItemList.length<$scope.endIndex){
				for(var i=$scope.startIndex;i<$scope.offerItemList.length;i++){
					$scope.offerItemShow.push($scope.offerItemList[i]);
				}
			}else{
				for(var i=$scope.startIndex;i<$scope.endIndex;i++){
					$scope.offerItemShow.push($scope.offerItemList[i]);
				}
			}
			
		
		}).error(function(data) {
				console.log('Error: ' + data);
		});
	}
	

	$scope.getLatestItems();
	$scope.getOfferItems();
});
