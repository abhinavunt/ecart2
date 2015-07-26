// public/js/controllers/NerdCtrl.js
angular.module('GetItemCtrl', []).controller('GetItemController', function($scope,$http,$window,$stateParams,expandItemService) {
			
	 		$window.scrollTo(0, 50);
			$scope.brandsArray=[];
			
			$scope.itemToExpand = expandItemService.getItem();
			expandItemService.setCategoryString($stateParams.category);
			
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
                      url: '/item/searchItemsDisplay',
                      method: "GET",
                      params: {category: category}
                   }).success(function(data) {
                          if(data.length==0){
                        	  if(expandItemService.getExpandItemFlag()==true){
                         		 $scope.expandItemFlag=true;
                         		 $scope.showBackButton=false;
                         		 $scope.showBrandPanel=false;
                         		 
                         	 }else{
                         		 $scope.showItemList = [];
                                  expandItemService.setExpandItemFlag();
                            	  	 $scope.expandItemFlag=false;
                            	  	 $scope.showBackButton=true;
                            	  	 $scope.showBrandPanel=true;
                         	 }
                          }else{
                        	  
                        	 if(expandItemService.getExpandItemFlag()==true){
                        		 $scope.expandItemFlag=true;
                        		 $scope.showBackButton=false;
                        		 $scope.showBrandPanel=false;
                        		 
                        	 }else{
                        		 $scope.showItemList = data;
                                 expandItemService.setExpandItemFlag();
                           	  	 $scope.expandItemFlag=false;
                           	  	 $scope.showBackButton=true;
                           	  	 $scope.showBrandPanel=true;
                        	 }
                             
                          }
                          
                         
                         // console.log(JSON.stringify($scope.sideMenu));
                          
                  }).error(function(data) {
                          console.log('Error: ' + data);
                  });  
            	  
              };
              
            if(typeof($stateParams.menuObj)=='string'){
            	$scope.sideMenu = expandItemService.getMenuObject();
            }else{
            	$scope.sideMenu = $stateParams.menuObj;
            	expandItemService.setMenuObject($stateParams.menuObj);
			}
            
            
           $scope.getBreadcrumbs = function(){
            	outer_loop: 
	        	for(var i=0;i<$scope.sideMenu.sub.length;i++){
	        		for(var j=0;j<$scope.sideMenu.sub[i].supersub.length;j++){
	        			if($scope.sideMenu.sub[i].supersub[j]._id==$stateParams.category){
	        				$scope.catName = $scope.sideMenu.name;
	        				$scope.subCatName = $scope.sideMenu.sub[i].name;
	        				$scope.supSubCatName = $scope.sideMenu.sub[i].supersub[j].name;
	        				break outer_loop;
	        			}
	        		}
	        	}
            }
            
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
            	  expandItemService.setExpandItemFlag(false);
            	  $scope.expandItemFlag=false;
              }
              
             $scope.sideMenuSearchItems = function(category){
            	  expandItemService.setExpandItemFlag(false);
            	  $scope.searchItems(category);
            	  $scope.searchBrands(category);
             }
              
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
             
             $scope.getBreadcrumbs();
             $scope.searchItems($stateParams.category);
             $scope.searchBrands($stateParams.category);
});
