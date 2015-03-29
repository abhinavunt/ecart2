// public/js/controllers/NerdCtrl.js
angular.module('GetItemCtrl', []).controller('GetItemController', function($scope,$http,$stateParams) {
			$scope.brandsArray=[];
			
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
                          }
                          
                          $scope.sideMenu = $stateParams.sideMenu;
                          
                  }).error(function(data) {
                          console.log('Error: ' + data);
                  });  
            	  
              };
              
            //Search Brands
  		   	$scope.searchBrands = function(category){
              	
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
                   }).error(function(data) {
                          console.log('Error: ' + data);
                   });
            	  
              };
});
