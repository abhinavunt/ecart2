// public/js/controllers/NerdCtrl.js
angular.module('GetItemCtrl', []).controller('GetItemController',['$scope','$http','$window','$stateParams','expandItemService','usSpinnerService','itemService','menuItemService', function($scope,$http,$window,$stateParams,expandItemService,usSpinnerService,itemService,menuItemService) {
			
		    $window.scrollTo(0, 50);
			$scope.brandsArray=[];
			$scope.getMoreItemBtn=true;
			$scope.lastItemDate="notAssigned";
			$scope.lastItemDateByBrand="notAssigned";
			$scope.itemLimit=40;
			$scope.itemsToSkip=0;
			$scope.itemsToSkipCount=1;
			$scope.showItemList=[];
			$scope.itemCount=0;
			$scope.category = $stateParams.category;
			expandItemService.setCategoryLevel(parseInt($stateParams.catLevel));
			$scope.catLevel = expandItemService.getCategoryLevel();
			$scope.showItemGrid=true;
			
			
			
			//$scope.itemToExpand = expandItemService.getItem();
			
			expandItemService.setCategoryString($scope.category);
			expandItemService.setCategoryLevel($scope.catLevel);
			
			$scope.sortCriteriaList = [{'criteria':'Default','value':1},{'criteria':'Alphabetically (A-Z)','value':2},{'criteria':'Price (Low to High)','value':3},{'criteria':'Price (High to Low)','value':4}];
			$scope.selectedSortCriteriaObj = $scope.sortCriteriaList[itemService.getSortCriteria()-1];
			$scope.selectedSortCriteriaVal = $scope.sortCriteriaList[itemService.getSortCriteria()-1].value;
			
			/*$scope.$watch('itemToExpand', function(item) {
				if(item.length>0){
					$scope.expandedItem = item[0];
					$scope.expandItemFlag= expandItemService.getExpandItemFlag();
				}
	        },true);*/
			
			
			
	       //Search Items
		   	$scope.searchItems = function(){
		   		
		   		usSpinnerService.spin('spinner-1');
		   		$http({
                      url: '/item/searchItemsDisplay',
                      method: "GET",
                      params: {category: $scope.category, itemsToSkip:$scope.itemsToSkip, limit:$scope.itemLimit, catLevel:$scope.catLevel, sortCriteriaVal:$scope.selectedSortCriteriaVal, lastItemDate:$scope.lastItemDate}
                   }).success(function(data) {
                	   if(data.items.length==0){
                		   $scope.showItemGrid=false;
                	   }else{
                		   $scope.showItemGrid=true;
                		   if($scope.itemsToSkip==0){
                    		   $scope.itemCount=data.itemCount;
                    		   $scope.showItemList=[];
                    	   }
                		   
                		   
                    	   
                    	   $scope.showItemList = $scope.showItemList.concat(data.items);
                    	   //$scope.lastItemDate = $scope.showItemList[$scope.showItemList.length-1].createdAt;
                    	   
                    	   
                    	   if($scope.showItemList.length<$scope.itemCount){
                    		   $scope.getMoreItemBtn=false;
                    		   $scope.itemsToSkip = $scope.itemsToSkipCount * $scope.itemLimit;
                    		   $scope.itemsToSkipCount = $scope.itemsToSkipCount+1;
                    		   $scope.lastItemDate = $scope.showItemList[$scope.showItemList.length-1].createdAt;
                    	   }
                    	   else{
                    		   $scope.getMoreItemBtn=true;
                    		   
                    	   }
                	   }
                	   usSpinnerService.stop('spinner-1'); 
                	  
                  }).error(function(data) {
                          console.log('Error: ' + data);
                          usSpinnerService.stop('spinner-1'); 
                  });  
            	  
              };
              
              $scope.getBreadcrumbsLevelOne = function(){
  	           	for(var i=0;i<$scope.sideMenu.sub.length;i++){
  	        		if($scope.sideMenu.sub[i]._id==$scope.category){
          				$scope.catName = $scope.sideMenu.name;
          				$scope.subCatName = $scope.sideMenu.sub[i].name;
          				$scope.subCatId = $scope.sideMenu.sub[i]._id;
          				break;
  	        		}
  	        	}
  	         }
  	       
  		     $scope.getBreadcrumbsLevelTwo = function(){
  		    	    outer_loop: 
  		        	for(var i=0;i<$scope.sideMenu.sub.length;i++){
  		        		for(var j=0;j<$scope.sideMenu.sub[i].supersub.length;j++){
  		        			if($scope.sideMenu.sub[i].supersub[j]._id==$scope.category){
  		        				$scope.catName = $scope.sideMenu.name;
  		        				$scope.subCatName = $scope.sideMenu.sub[i].name;
  		        				$scope.subCatId = $scope.sideMenu.sub[i]._id;
  		        				$scope.supSubCatName = $scope.sideMenu.sub[i].supersub[j].name;
  		        				$scope.supSubCatId = $scope.sideMenu.sub[i].supersub[j]._id;
  		        				break outer_loop;
  		        			}
  		        		}
  		        	}
  		      }
              
            $scope.getSideMenuObject = function(){
            	
            	if(typeof($stateParams.menuObj)=='string'){
                	$scope.catLevelZeroId = menuItemService.getCatLevelZeroId();
            		
                	$http.get('/menu/menulist').success(function(data) {
                		$scope.menuObject = data;
                		for(var i=0;i<$scope.menuObject.length;i++){
                			if($scope.menuObject[i]._id==$scope.catLevelZeroId){
                				$scope.sideMenu = $scope.menuObject[i];
                				break;
                			}
                		}
                		$scope.getBreadCrumeVal();
                	}).error(function(data) {
                			
                	});
                	
                }else{
                	
                	$scope.sideMenu = $stateParams.menuObj;
                	menuItemService.setCatLevelZeroId($scope.sideMenu._id);
                	$scope.getBreadCrumeVal();
                	//expandItemService.setMenuObject($stateParams.menuObj);
    			}
            	
            	
            }
              
            
            
	        
           
           
            
            //Search Brands
  		   	$scope.searchBrands = function(){
  		   		$scope.brandsArray=[];
              	   $http({
                        url: '/item/searchBrands',
                        method: "GET",
                        params: {category: $scope.category, catLevel:$scope.catLevel}
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
           
              
            
             
             $scope.searchItemsByBrand = function(){
            	 usSpinnerService.spin('spinner-1');
            	 var categoryData = {
           			  category:$scope.brandsArray,
           			  categoryId:$scope.category,
           			  lastItemDateByBrand:$scope.lastItemDateByBrand, 
           			  limit:$scope.itemLimit,
           			  catLevel:$scope.catLevel,
           			  itemsToSkip:$scope.itemsToSkip,
					  sortCriteriaVal:$scope.selectedSortCriteriaVal
           	  	 };
            	 
            	 $http({
                     url: '/item/searchItemsByBrand',
                     method: "POST",
			         data: JSON.stringify(categoryData)
			      }).success(function(data) {

               	   if(data.items.length==0){
               		   $scope.showItemGrid=false;
               	   }else{
               		   $scope.showItemGrid=true;
               		   if($scope.itemsToSkip==0){
                   		   $scope.itemCount=data.itemCount;
                   		   $scope.showItemList=[];
                   	   }
               		   
               		   
                   	   
                   	   $scope.showItemList = $scope.showItemList.concat(data.items);
                   	   //$scope.lastItemDate = $scope.showItemList[$scope.showItemList.length-1].createdAt;
                   	   
                   	   
                   	   if($scope.showItemList.length<$scope.itemCount){
                   		   $scope.getMoreItemBtn=false;
                   		   $scope.itemsToSkip = $scope.itemsToSkipCount * $scope.itemLimit;
                   		   $scope.itemsToSkipCount = $scope.itemsToSkipCount+1;
                   		   $scope.lastItemDate = $scope.showItemList[$scope.showItemList.length-1].createdAt;
                   	   }
                   	   else{
                   		   $scope.getMoreItemBtn=true;
                   		   
                   	   }
               	   }
               	   usSpinnerService.stop('spinner-1'); 
               	  
			      }).error(function(data) {
                         console.log('Error: ' + data);
                  }); 
             }
              
             $scope.selectedBrand = function(brandName){
            	
            	  if($scope.brandsArray.indexOf(brandName)!= -1) $scope.brandsArray.splice($scope.brandsArray.indexOf(brandName),1)
            	  else $scope.brandsArray.push(brandName);
            	  if($scope.brandsArray.length>0){
            		  $scope.itemsToSkip=0;
                 	  $scope.itemsToSkipCount=1;
            		  $scope.lastItemDateByBrand="notAssigned";
                	  $scope.searchItemsByBrand();   
            	  }else{
            		  $scope.itemsToSkip=0;
                 	  $scope.itemsToSkipCount=1;
                 	  $scope.lastItemDate="notAssigned";
            		  $scope.searchItems();
            	  }
             };
             
             $scope.selectedSortCriteria = function(sortCriteriaObj){
            	 $scope.selectedSortCriteriaVal = sortCriteriaObj.value;
            	 itemService.setSortCriteria(sortCriteriaObj.value);
            	 $scope.selectedSortCriteriaObj = $scope.sortCriteriaList[itemService.getSortCriteria()-1];
            	 $scope.selectedSortCriteriaVal = $scope.sortCriteriaList[itemService.getSortCriteria()-1].value;
            	 
            	 if($scope.brandsArray.length>0){
           		  $scope.itemsToSkip=0;
                	  $scope.itemsToSkipCount=1;
           		  $scope.lastItemDateByBrand="notAssigned";
               	  $scope.searchItemsByBrand();   
           	  }else{
           		  $scope.itemsToSkip=0;
                	  $scope.itemsToSkipCount=1;
                	  $scope.lastItemDate="notAssigned";
           		  $scope.searchItems();
           	  }
             }
             
             $scope.loadMoreItems = function(){
            	if($scope.brandsArray.length>0) $scope.searchItemsByBrand();
            	else $scope.searchItems();
             }
             
             $scope.getBreadCrumeVal = function(){
            	 if($scope.catLevel==1) $scope.getBreadcrumbsLevelOne();
                 else $scope.getBreadcrumbsLevelTwo();
            	 $scope.searchBrands();
             }
             
             $scope.getSideMenuObject();
             $scope.searchItems();
             
}]);
