// public/js/controllers/NerdCtrl.js
angular.module('HomeCtrl', []).controller('HomeController', function($scope,$http) {
	$scope.latestItemShow = [];
	$scope.startIndex = 0;
	$scope.endIndex = 4;
	
	$http.get('/item/getLatestItems')
	.success(function(data) {
			
		$scope.latestItemList = data;
		for(var i=$scope.startIndex;i<$scope.endIndex;i++){
			$scope.latestItemShow.push($scope.latestItemList[i]);
		}
	
	}).error(function(data) {
			console.log('Error: ' + data);
	});
	
	
	$scope.next = function(){
		$scope.startIndex = $scope.startIndex+1;
		$scope.endIndex = $scope.endIndex+1;
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
      
});
