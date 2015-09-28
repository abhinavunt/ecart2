// public/js/controllers/NerdCtrl.js
angular.module('GetItemCtrl', []).controller('GetItemController', function($scope,$http,$window,$stateParams,expandItemService,usSpinnerService) {
			
	 		$window.scrollTo(0, 50);
			$scope.brandsArray=[];
			$scope.getMoreItemBtn=true;
			$scope.lastItemDate="notAssigned";
			$scope.lastItemDateByBrand="notAssigned";
			$scope.itemLimit=8;
			$scope.showItemList=[];
			$scope.itemCount=0;
			$scope.category = $stateParams.category;
			$scope.catLevel = parseInt($stateParams.catLevel);
			$scope.showItemGrid=true;
			
			$scope.itemToExpand = expandItemService.getItem();
			expandItemService.setCategoryString($scope.category);
			expandItemService.setCategoryLevel($scope.catLevel);
			
			$scope.$watch('itemToExpand', function(item) {
				if(item.length>0){
					$scope.expandedItem = item[0];
					$scope.expandItemFlag= expandItemService.getExpandItemFlag();
				}
	        },true);
			
			
			
	       //Search Items
		   	$scope.searchItems = function(){
		   		usSpinnerService.spin('spinner-1');
		   		$http({
                      url: '/item/searchItemsDisplay',
                      method: "GET",
                      params: {category: $scope.category, lastItemDate:$scope.lastItemDate, limit:$scope.itemLimit, catLevel:$scope.catLevel}
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
                	   usSpinnerService.stop('spinner-1'); 
                	  
                  }).error(function(data) {
                          console.log('Error: ' + data);
                          usSpinnerService.stop('spinner-1'); 
                  });  
            	  
              };
              
            if(typeof($stateParams.menuObj)=='string'){
            	$scope.sideMenu = expandItemService.getMenuObject();
            }else{
            	$scope.sideMenu = $stateParams.menuObj;
            	expandItemService.setMenuObject($stateParams.menuObj);
			}
            
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
           			  catLevel:$scope.catLevel
           	  	 };
           	  
           	  	$http({
                     url: '/item/searchItemsByBrand',
                     method: "POST",
			         data: JSON.stringify(categoryData)
			      }).success(function(data) {
			    	  usSpinnerService.stop('spinner-1');
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
             
             if($scope.catLevel==1) $scope.getBreadcrumbsLevelOne();
             else $scope.getBreadcrumbsLevelTwo();
             
             $scope.searchItems();
             $scope.searchBrands();
});
