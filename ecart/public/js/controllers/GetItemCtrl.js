// public/js/controllers/NerdCtrl.js
angular.module('GetItemCtrl', []).controller('GetItemController', function($scope,$http,$window,$stateParams,expandItemService) {
			
	 		$window.scrollTo(0, 50);
			$scope.brandsArray=[];
			$scope.getMoreItemBtn=true;
			$scope.lastItemDate="notAssigned";
			$scope.lastItemDateByBrand="notAssigned";
			$scope.itemLimit=8;
			$scope.showItemList=[];
			$scope.itemCount=0;
			$scope.category = $stateParams.category;
			$scope.showItemGrid=true;
			
			$scope.itemToExpand = expandItemService.getItem();
			expandItemService.setCategoryString($scope.category);
			
			$scope.$watch('itemToExpand', function(item) {
				if(item.length>0){
					$scope.expandedItem = item[0];
					$scope.expandItemFlag= expandItemService.getExpandItemFlag();
				}
	        },true);
			
			
			
	       //Search Items
		   	$scope.searchItems = function(){
		   		
		   		$scope.categoryTwoId = $scope.category;
		   		$http({
                      url: '/item/searchItemsDisplay',
                      method: "GET",
                      params: {category: $scope.category, lastItemDate:$scope.lastItemDate, limit:$scope.itemLimit}
                   }).success(function(data) {
                	   if(data.items.length==0){
                		   $scope.showItemGrid=false;
                	   }else{
                		   $scope.showItemGrid=true;
                		   if($scope.lastItemDate=="notAssigned"){
                    		   $scope.itemCount=data.itemCount;
                    		   $scope.showItemList=[];
                    	   }
                    	   
                    	   $scope.showItemList = $scope.showItemList.concat(data.items);
                    	   $scope.lastItemDate = $scope.showItemList[$scope.showItemList.length-1].createdAt;
                    	   
                    	   if($scope.showItemList.length<$scope.itemCount) $scope.getMoreItemBtn=false;
                    	   else $scope.getMoreItemBtn=true;   
                	   }
                	   
                	  
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
	        			if($scope.sideMenu.sub[i].supersub[j]._id==$scope.category){
	        				$scope.catName = $scope.sideMenu.name;
	        				$scope.subCatName = $scope.sideMenu.sub[i].name;
	        				$scope.supSubCatName = $scope.sideMenu.sub[i].supersub[j].name;
	        				break outer_loop;
	        			}
	        		}
	        	}
            }
            
            //Search Brands
  		   	$scope.searchBrands = function(){
  		   		$scope.brandsArray=[];
              	   $http({
                        url: '/item/searchBrands',
                        method: "GET",
                        params: {category: $scope.category}
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
            	  $scope.category = category;
            	  expandItemService.setExpandItemFlag(false);
            	  $scope.searchItems();
            	  $scope.searchBrands();
             }
             
             $scope.searchItemsByBrand = function(){
            	 var categoryData = {
           			  category:$scope.brandsArray,
           			  categoryTwoId:$scope.categoryTwoId,
           			  lastItemDateByBrand:$scope.lastItemDateByBrand, 
           			  limit:$scope.itemLimit
           	  	 };
           	  
           	  	$http({
                     url: '/item/searchItemsByBrand',
                     method: "POST",
			         data: JSON.stringify(categoryData)
			      }).success(function(data) {
               	   	 
			    	  if($scope.lastItemDateByBrand=="notAssigned"){
	           		   $scope.itemCount=data.itemCount;
	           		   $scope.showItemList=[];
	           	   	  }
               	   
               	      $scope.showItemList = $scope.showItemList.concat(data.items);
               	      $scope.lastItemDateByBrand = $scope.showItemList[$scope.showItemList.length-1].createdAt;
               	   
               	      if($scope.showItemList.length<$scope.itemCount) $scope.getMoreItemBtn=false;
               	      else $scope.getMoreItemBtn=true;
			    	  
               	  }).error(function(data) {
                         console.log('Error: ' + data);
                  }); 
             }
              
             $scope.selectedBrand = function(brandName){
            	  
            	  if($scope.brandsArray.indexOf(brandName)!= -1) $scope.brandsArray.splice($scope.brandsArray.indexOf(brandName),1)
            	  else $scope.brandsArray.push(brandName);
            	  if($scope.brandsArray.length>0){
            		  $scope.lastItemDateByBrand="notAssigned";
                	  $scope.searchItemsByBrand();   
            	  }else{
            		  $scope.lastItemDate="notAssigned";
            		  $scope.searchItems(); 
            	  }
            	  
            	 
             };
             
             $scope.loadMoreItems = function(){
            	if($scope.brandsArray.length>0) $scope.searchItemsByBrand();
            	else $scope.searchItems();
             }
             
             $scope.getBreadcrumbs();
             $scope.searchItems();
             $scope.searchBrands();
});
