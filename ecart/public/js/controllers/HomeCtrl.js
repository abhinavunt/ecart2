// public/js/controllers/NerdCtrl.js
angular.module('HomeCtrl', []).controller('HomeController', function($scope,$http) {
	$scope.latestItemShow = [];
	$scope.offerItemShow = [];
	$scope.startIndex = 0;
	$scope.endIndex = 4;
	
	$scope.getLatestItems = function(){
		
		$http.get('/item/getLatestItems')
		.success(function(data) {
				
			$scope.latestItemList = data.latestItems;
			if($scope.latestItemList.length<$scope.endIndex){
				for(var i=$scope.startIndex;i<$scope.latestItemList.length;i++){
					$scope.latestItemShow.push($scope.latestItemList[i]);
				}
			}else{
				for(var i=$scope.startIndex;i<$scope.endIndex;i++){
					$scope.latestItemShow.push($scope.latestItemList[i]);
				}
			}
		}).error(function(data) {
				console.log('Error: ' + data);
		});
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
	
	
	
	
	$scope.next = function(){
		$scope.startIndex = $scope.startIndex+4;
		$scope.endIndex = $scope.endIndex+4;
		$scope.latestItemShow.splice(0,$scope.latestItemShow.length);
		
		for(var i=$scope.startIndex;i<$scope.endIndex;i++){
			$scope.latestItemShow.push($scope.latestItemList[i]);
		}
		
	}
	
	$scope.previous = function(){
		$scope.startIndex = $scope.startIndex-1;
		$scope.endIndex = $scope.endIndex-1;
		$scope.latestItemShow.splice(0,$scope.latestItemShow.length);
		
		for(var i=$scope.startIndex;i<$scope.endIndex;i++){
			$scope.latestItemShow.push($scope.latestItemList[i]);
		}	
		
	}
	
	$scope.getLatestItems();
	$scope.getOfferItems();
	
	
      
});
