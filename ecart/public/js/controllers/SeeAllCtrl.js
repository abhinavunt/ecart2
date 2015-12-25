// all latest Items
angular.module('AllLatestProdsCtrl', []).controller('AllLatestProdsController',['$scope','$http','$state','$stateParams','usSpinnerService', function($scope,$http,$state,$stateParam,usSpinnerService) {
	
	$scope.itemLimit=40;
	$scope.searchCriteria="latestItems";
	$scope.noLatestItemFlag=false;
	
	//Search Items
   	$scope.searchAllLatestItems = function(){
   		usSpinnerService.spin('spinner-1');
   		$http({
              url: '/item/seeAllProducts',
              method: "GET",
              params: {limit:$scope.itemLimit, searchCriteria:$scope.searchCriteria}
           }).success(function(data) {
        	  if(data.items.length==0){
        		 $scope.noLatestItemFlag=true;
        	  }else{
        		  $scope.noLatestItemFlag=false;
        		  $scope.itemListObj = data.items;
        	  }
        	  
        	  usSpinnerService.stop('spinner-1'); 
          }).error(function(data) {
                  console.log('Error: ' + data);
                  usSpinnerService.stop('spinner-1'); 
          });  
    	  
      };
      
      $scope.searchAllLatestItems();
}]);


//all Offer Items
angular.module('AllOfferProdsCtrl', []).controller('AllOfferProdsController',['$scope','$http','$state','$stateParams','usSpinnerService', function($scope,$http,$state,$stateParam,usSpinnerService) {
	
	$scope.itemLimit=40;
	$scope.itemsToSkip=0;
	$scope.itemsToSkipCount=1;
	$scope.searchCriteria="offerItems";
	$scope.noOfferItemFlag=false;
	$scope.getMoreItemBtn=true;
	
	//Search Items
   	$scope.searchAllOfferItems = function(){
   		
   		$http({
              url: '/item/seeAllProducts',
              method: "GET",
              params: {limit:$scope.itemLimit, searchCriteria:$scope.searchCriteria,itemsToSkip:$scope.itemsToSkip}
           }).success(function(data) {
        	   if(data.items.length==0){
        		   $scope.noOfferItemFlag=true;
        	   }else{
        		   $scope.noOfferItemFlag=false;
        		   if($scope.itemsToSkip==0){
            		   $scope.itemCount=data.itemCount;
            		   $scope.offerItemList=[];
            	   }
        		   
        		   $scope.offerItemList = $scope.offerItemList.concat(data.items);
            	   
            	   if($scope.offerItemList.length<$scope.itemCount){
            		   $scope.getMoreItemBtn=false;
            		   $scope.itemsToSkip = $scope.itemsToSkipCount * $scope.itemLimit;
            		   $scope.itemsToSkipCount = $scope.itemsToSkipCount+1;
            		   $scope.lastItemDate = $scope.offerItemList[$scope.offerItemList.length-1].createdAt;
            	   }
            	   else{
            		   $scope.getMoreItemBtn=true;
            		   
            	   }
        	   }
        	   usSpinnerService.stop('spinner-1'); 
        	   usSpinnerService.stop('spinner-loadMoreOffer');
        	  
          }).error(function(data) {
                  console.log('Error: ' + data);
                  usSpinnerService.stop('spinner-1'); 
          });  
    	  
      };
      
      $scope.searchAllOffers = function(){
    	  usSpinnerService.spin('spinner-1');
    	  $scope.searchAllOfferItems();
    	  
      }
      
      $scope.loadMoreOffers = function(){
    	  usSpinnerService.spin('spinner-loadMoreOffer');
    	  $scope.searchAllOfferItems();
      }
      
      $scope.searchAllOffers();
	
}]);




