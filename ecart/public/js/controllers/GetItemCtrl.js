// public/js/controllers/NerdCtrl.js
angular.module('GetItemCtrl', []).controller('GetItemController', function($scope,$http,$stateParams,expandItemService) {
			$scope.brandsArray=[];
			
			$scope.itemToExpand = expandItemService.getItem();
			
			
			$scope.$watch('itemToExpand', function(item) {
				if(item.length>0){
					$scope.expandedItem = item[0];
					$scope.expandItemFlag= expandItemService.getExpandItemFlag();
		        }
	        },true);
			
	       //Search Items
		   	$scope.searchItems = function(category){
            	//Search Items
		   		   $scope.categoryTwoId = category;
		   		   $http({
                      url: '/item/searchItems',
                      method: "GET",
                      params: {category: category}
                   }).success(function(data) {
                          if(data.length==0){
                             $scope.showItemList = [];
                          }else{
                             $scope.showItemList = data;
                             expandItemService.setExpandItemFlag();
                       	  	 $scope.expandItemFlag=false;
                          }
                          
                          $scope.sideMenu = $stateParams.sideMenu;
                          
                  }).error(function(data) {
                          console.log('Error: ' + data);
                  });  
            	  
              };
              
            //Search Brands
  		   	$scope.searchBrands = function(category){
  		   		$scope.brandsArray=[];
              	   $http({
                        url: '/item/searchBrands',
                        method: "GET",
                        params: {category: category}
                     }).success(function(data) {
                    	 if(data.length==0){
                             $scope.showBrandList =[];
                            
                      }else{
                          $scope.showBrandList = data;
                      } 
                    	 
                     }).error(function(data) {
                            console.log('Error: ' + data);
                    });  
              	  
              };
              
              $scope.backToItems = function(){
            	  expandItemService.setExpandItemFlag();
            	  $scope.expandItemFlag=false;
              }
              
              $scope.searchItems($stateParams.category);
              $scope.searchBrands($stateParams.category);
              
              $scope.selectedBrand = function(brandName){
            	  
            	  if($scope.brandsArray.indexOf(brandName)!= -1){
            		  $scope.brandsArray.splice($scope.brandsArray.indexOf(brandName),1)
            	  }else{
            		  $scope.brandsArray.push(brandName);   
            	  }
            	  
            	  var categoryData = {
            			  category:$scope.brandsArray,
            			  categoryTwoId:$scope.categoryTwoId
            	  };
            	  
            	  $http({
                      url: '/item/searchItemsByBrand',
                      method: "POST",
			          data: JSON.stringify(categoryData),
			          headers: {'Content-Type': 'application/json'}
                   }).success(function(data) {
                	   $scope.showItemList = data;
                	   expandItemService.setExpandItemFlag();
                 	   $scope.expandItemFlag=false;
                   }).error(function(data) {
                          console.log('Error: ' + data);
                   });
            	  
              };
});
