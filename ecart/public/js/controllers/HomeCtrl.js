// public/js/controllers/NerdCtrl.js
angular.module('HomeCtrl', []).controller('HomeController', function($scope,$http,usSpinnerService) {
	
	$scope.addItemsIndex = 5;
	
	//latestItems
	$scope.latestItemShow = [];
	$scope.startIndex = 0;
	$scope.endIndex = 4;
	$scope.lastLatestItemDate ="notAssigned";
	$scope.maxLimit = 6;
	$scope.latestItemsMaxLimit=0;
	
	//offerItems
	$scope.offerItemShow = [];
	$scope.startIndexOff = 0;
	$scope.endIndexOff = 4;
	$scope.lastOfferItemDate ="notAssigned";
	$scope.maxLimitOff = 6;
	$scope.offerItemsMaxLimit=0;
	$scope.showLatestItemsLoading = true;
	$scope.showOfferItemsLoading = true;
	
	$scope.getLatestItems = function(){
		usSpinnerService.spin('spinner-2');
		$http({
            url: '/item/getLatestItems',
            method: "GET",
            params: {lastLatestItemDate:$scope.lastLatestItemDate,limitPerSlide:(2*$scope.addItemsIndex)}
         }).success(function(data) {
        	 usSpinnerService.stop('spinner-2');
        	 $scope.showLatestItemsLoading = false;
        	 if(data.latestItems.length==0){
 				$scope.showLatestItemsPanel=false;
 				$scope.noLatestItemAvaiable=true;
 			}else{
        		 $scope.noLatestItemAvaiable=false;
        		 $scope.showLatestItemsPanel=true;
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
        	 }
			
		
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
	        		$scope.lastLatestItemDate=$scope.latestItemList[$scope.latestItemList.length-1].createdAt;
	        	}
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
		
		if($scope.latestItemList.length>$scope.endIndex+$scope.addItemsIndex){
			for(var j=$scope.latestItemList.length-1;j>=(recentStrIndex+$scope.addItemsIndex);j--){
				$scope.latestItemList.pop();
			}
			$scope.lastLatestItemDate=$scope.latestItemList[recentStrIndex+$scope.addItemsIndex-1].createdAt;
		}
		
		if($scope.startIndex!=0) $scope.previousLatestItemsBtn =false;
		else $scope.previousLatestItemsBtn =true;
		$scope.nextLatestItemsBtn =false;
	}
	
	
	$scope.getOfferItems = function(){
		usSpinnerService.spin('spinner-3');
		$http({
            url: '/item/getOfferItems',
            method: "GET",
            params: {lastOfferItemDate:$scope.lastOfferItemDate,limitPerSlide:(2*$scope.addItemsIndex)}
         }).success(function(data) {
        	 usSpinnerService.stop('spinner-3');
        	 $scope.showOfferItemsLoading = false;
			if(data.offerItems.length==0){
				$scope.showOfferListPanel=false;
 				$scope.noOfferItemAvaiable=true;
			}else{
				$scope.noOfferItemAvaiable=false;
				$scope.showOfferListPanel=true;
				$scope.offerItemList = data.offerItems;
				$scope.lastOfferItemDate=$scope.offerItemList[$scope.offerItemList.length-1].createdAt;
				
				if($scope.offerItemList.length<$scope.endIndexOff){
					for(var i=$scope.startIndexOff;i<$scope.offerItemList.length;i++){
						$scope.offerItemShow.push($scope.offerItemList[i]);
					}
				}else{
					for(var i=$scope.startIndexOff;i<=$scope.endIndexOff;i++){
						$scope.offerItemShow.push($scope.offerItemList[i]);
					}
				}
				
				$scope.previousOfferItemsBtn =true;
				if($scope.offerItemList.length<=$scope.endIndexOff+1) $scope.nextOfferItemsBtn =true;	
			}	
			
			
		}).error(function(data) {
				console.log('Error: ' + data);
		});
	}
	
	$scope.nextOfferItems = function(){
		
		$scope.startIndexOff = $scope.startIndexOff+$scope.addItemsIndex;
		$scope.endIndexOff = $scope.endIndexOff +($scope.offerItemList.length - $scope.startIndexOff);
		$scope.previousOfferItemsBtn =false;
		$scope.offerItemsMaxLimit = $scope.offerItemsMaxLimit+1;
		$scope.offerItemShow.splice(0,$scope.offerItemShow.length);
		
		for(var i=$scope.startIndexOff;i<=$scope.endIndexOff;i++){
			$scope.offerItemShow.push($scope.offerItemList[i]);
		}
		
		if((($scope.offerItemList.length - $scope.startIndexOff)<$scope.addItemsIndex)|| $scope.offerItemsMaxLimit==$scope.maxLimitOff){
			 $scope.nextOfferItemsBtn =true;
		}else{
			
			$http({
	            url: '/item/getOfferItems',
	            method: "GET",
	            params: {lastOfferItemDate:$scope.lastOfferItemDate,limitPerSlide:$scope.addItemsIndex}
	         }).success(function(data) {
	        	if(data.offerItems.length==0){
	        		$scope.nextOfferItemsBtn =true;
	        	}else{
	        		for(var i=0;i<data.offerItems.length;i++){
		        		$scope.offerItemList.push(data.offerItems[i]);
		        	}
	        		$scope.lastOfferItemDate=$scope.offerItemList[$scope.offerItemList.length-1].createdAt;
	        	}
	         }).error(function(data) {
					console.log('Error: ' + data);
	         });
		}
	}
	
	$scope.previousOfferItems = function(){
		
		var recentStrIndex = $scope.startIndexOff;
		$scope.endIndexOff =  $scope.startIndexOff-1;
		$scope.startIndexOff = $scope.startIndexOff-$scope.addItemsIndex;
		$scope.offerItemsMaxLimit = $scope.offerItemsMaxLimit-1;
		$scope.offerItemShow.splice(0,$scope.offerItemShow.length);
		
		for(var i=$scope.startIndexOff;i<=$scope.endIndexOff;i++){
			$scope.offerItemShow.push($scope.offerItemList[i]);
		}
		
		if($scope.offerItemList.length>$scope.endIndexOff+$scope.addItemsIndex){
			for(var j=$scope.offerItemList.length-1;j>=(recentStrIndex+$scope.addItemsIndex);j--){
				$scope.offerItemList.pop();
			}
			$scope.lastOfferItemDate=$scope.offerItemList[recentStrIndex+$scope.addItemsIndex-1].createdAt;
		}
		
		if($scope.startIndexOff!=0) $scope.previousOfferItemsBtn =false;
		else $scope.previousOfferItemsBtn =true;
		$scope.nextOfferItemsBtn =false;
	}
	

	$scope.getLatestItems();
	$scope.getOfferItems();
});
