// public/js/controllers/NerdCtrl.js
angular.module('HomeCtrl', []).controller('HomeController', function($scope,$http) {
	$scope.latestItemShow = [];
	$scope.offerItemShow = [];
	$scope.startIndex = 0;
	$scope.endIndex = 3;
	$scope.addItemsIndex = 4;
	$scope.lastLatestItemDate ="notAssigned";
	
	$scope.getLatestItems = function(){
		
		$http({
            url: '/item/getLatestItems',
            method: "GET",
            data: $scope.lastLatestItemDate
         }).success(function(data) {
				
			$scope.latestItemList = data.latestItems;
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
			
		}).error(function(data) {
				console.log('Error: ' + data);
		});
	}
	
	$scope.nextLatestItems = function(){
		$scope.startIndex = $scope.startIndex+$scope.addItemsIndex;
		$scope.endIndex = $scope.endIndex +($scope.latestItemList.length - $scope.startIndex);
		$scope.previousLatestItemsBtn =false;
		
		$scope.latestItemShow.splice(0,$scope.latestItemShow.length);
		for(var i=$scope.startIndex;i<=$scope.endIndex;i++){
			$scope.latestItemShow.push($scope.latestItemList[i]);
		}
		
		if(($scope.latestItemList.length - $scope.startIndex)<$scope.addItemsIndex){
			 $scope.nextLatestItemsBtn =true;
		}else{
			
		}
		
		
		
		
	}
	
	$scope.previousLatestItems = function(){
		$scope.startIndex = $scope.startIndex-1;
		$scope.endIndex = $scope.endIndex-1;
		$scope.latestItemShow.splice(0,$scope.latestItemShow.length);
		
		for(var i=$scope.startIndex;i<$scope.endIndex;i++){
			$scope.latestItemShow.push($scope.latestItemList[i]);
		}	
		
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
