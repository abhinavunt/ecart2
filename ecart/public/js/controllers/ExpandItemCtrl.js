// public/js/controllers/NerdCtrl.js
angular.module('ExpandItemCtrl', []).controller('ExpandItemController',['$scope','$http','$window','$state','$stateParams','expandItemService','shoppingCartService','menuItemService', function($scope,$http,$window,$state,$stateParams,expandItemService,shoppingCartService,menuItemService) {
	$window.scrollTo(0, 50);
	$scope.addItemsIndex = 5;
		
	$scope.itemSameCatShow = [];
	$scope.startIndex = 0;
	$scope.endIndex = 4;
	$scope.lastSameCatItemDate ="notAssigned";
	$scope.maxLimit = 6;
	$scope.itemSameCatMaxLimit=0;
	
	$scope.itemSameBrdShow = [];
	$scope.startIndexBrd = 0;
	$scope.endIndexBrd = 4;
	$scope.lastSameBrdItemDate ="notAssigned";
	$scope.maxLimitBrd = 6;
	$scope.itemSameBrdMaxLimit=0;
	
	
	
	$scope.getSideMenuObject = function(){
		if(typeof($stateParams.menuObj)=='string'|| typeof($stateParams.itemObj)=='string'){
	     	//$scope.sideMenu = expandItemService.getMenuObject();
	     	$scope.itemObject = expandItemService.getItemObject();
	     	
	     	
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
	     	$scope.itemObject = $stateParams.itemObj;
	     	//expandItemService.setMenuObject($stateParams.menuObj);
	     	expandItemService.setItemObject($stateParams.itemObj);
	     	$scope.getBreadCrumeVal();
	     }
	}
		
	 
	
	 $scope.categoryStr = expandItemService.getCategoryString();
	 $scope.catLevel = expandItemService.getCategoryLevel();
	 $scope.products = shoppingCartService.getProducts();
	 $scope.returnState =expandItemService.getReturnState();
	
	 $scope.getBreadcrumbsLevelTwo = function(){
     	for(var i=0;i<$scope.sideMenu.sub.length;i++){
     		for(var j=0;j<$scope.sideMenu.sub[i].supersub.length;j++){
     			if($scope.sideMenu.sub[i].supersub[j]._id==$scope.categoryStr){
     				$scope.catName = $scope.sideMenu.name;
     				$scope.subCatName = $scope.sideMenu.sub[i].name;
     				$scope.subCatId = $scope.sideMenu.sub[i]._id;
     				$scope.supSubCatName = $scope.sideMenu.sub[i].supersub[j].name;
     				$scope.supSubCatId = $scope.sideMenu.sub[i].supersub[j]._id;
     				break;
     			}
     		}
     	}
     }
	 
	 $scope.getBreadcrumbsLevelOne = function(){
	     	for(var i=0;i<$scope.sideMenu.sub.length;i++){
	     		if($scope.sideMenu.sub[i]._id==$scope.categoryStr){
     				$scope.catName = $scope.sideMenu.name;
     				$scope.subCatName = $scope.sideMenu.sub[i].name;
     				$scope.subCatId = $scope.sideMenu.sub[i]._id;
     				break;
	     		}
	     	}
	  }
	 
	 $scope.getBreadCrumeVal = function(){
		
		 if($scope.catLevel==1) $scope.getBreadcrumbsLevelOne();
		 else $scope.getBreadcrumbsLevelTwo(); 
	 }
	
	 
	
     
    $scope.$watch('products', function() {
     if($scope.products.length>0){
   	  var productId = $scope.selectedItemObj.productId;
         $scope.selectedQnt = shoppingCartService.getQuantity(productId)+" item in Cart";
     }},true);
     
     $scope.$watch('selectedItemObj', function() {
     if($scope.products.length>0){
     var productId = $scope.selectedItemObj.productId;
         $scope.selectedQnt = shoppingCartService.getQuantity(productId)+" item in Cart";
     }},true);
	 
	 $scope.quantityList = [{quantity:1 },
                            {quantity:2 },
                            {quantity:3 },
                            {quantity:4 },
                            {quantity:5 },
                            {quantity:6 },
                            {quantity:7 },
                            {quantity:8 },
                            {quantity:9 }];
	 
	 $scope.addToCart = function(amountObj,quantityObj,itemObj){
         
         var cartEntry = {
                      
                      itemName: itemObj.name,
                      brand: itemObj.brand,
                      amount: amountObj.Amount,
                      price: amountObj.Price,
                      quantity: quantityObj.quantity,
                      totalPrice: quantityObj.quantity*amountObj.Price,
                      productId: amountObj.productId,
                      imageId:itemObj.imageId
                     
         };
        
         shoppingCartService.addProduct(cartEntry);
        
         var productId = $scope.selectedItemObj.productId;
         $scope.selectedQnt = shoppingCartService.getQuantity(productId)+" item in Cart";
        
	 };
  
	 $scope.initQnt = function(){
	 if($scope.products.length>0){
		 var productId = $scope.selectedItemObj.productId;
		      $scope.selectedQnt = shoppingCartService.getQuantity(productId)+" item in Cart";
		 }
	 };
	 
	 
	 
	 $scope.counterPlus = function(){
		if($scope.products.length>0){
	    var itemObj = $scope.selectedItemObj;
	         shoppingCartService.setQuantity(itemObj,"plus");
	         var productId = $scope.selectedItemObj.productId;
	         $scope.selectedQnt = shoppingCartService.getQuantity(productId)+" item in Cart";
		}     
	  };
	 
	 
	 $scope.counterMinus = function(){
	 
		     var itemObj = $scope.selectedItemObj;
	         shoppingCartService.setQuantity(itemObj,"minus");
	         var productId = $scope.selectedItemObj.productId;
	         $scope.selectedQnt = shoppingCartService.getQuantity(productId)+" item in Cart";
	  };
	  
	  
	 $scope.returnToPreviousPage = function(){
		 if($scope.returnState=='B2S') $state.go('searchItems',{category:$scope.categoryStr,catLevel:$scope.catLevel, menuObj:$scope.sideMenu})
		 else $state.go('home');
	}
	 
	 
	 $scope.isSelected = function(itemObj){
	         var shoppingCart = shoppingCartService.getProducts();
	         var itemsFound = getById(shoppingCart,itemObj.productId);
	         if (itemsFound) {
	           return true;
	   } else {
	           return false;
	   }
	 };
	 
	 function getById(arr, id) {
        for (var d=0;d<arr.length;d++) {
	        if (arr[d].productId == id) {
	        return true;
	        break;
		  }
	    }
	         return false;
	  }
	 
	 
 	
	 
	$scope.getProductFromSameCat= function(){
		console.log("catLevel is:-"+$scope.catLevel);
		$http({
             url: '/item/itemFromSameCategory',
             method: "GET",
             params: {category: $scope.categoryStr,catLevel:$scope.catLevel, excludeItemId:$scope.itemObject._id, lastSameCatItemDate:$scope.lastSameCatItemDate, limitPerSlide:(2*$scope.addItemsIndex)}
          }).success(function(data) {
        	
        	  	if(data.itemSameCat.length==0){
        	  		$scope.showItemsSameCatPanel=false;
        	  		$scope.previousSameCatItemsBtn =true;
        	  		$scope.nextSameCatItemsBtn =true;
        	  	}else{
        	  		$scope.showItemsSameCatPanel=true;
        	  		$scope.itemSameCatList = data.itemSameCat;
        	  		$scope.lastSameCatItemDate=$scope.itemSameCatList[$scope.itemSameCatList.length-1].createdAt;
    	  			
    	  			if($scope.itemSameCatList.length<=$scope.endIndex){
    	  				for(var i=$scope.startIndex;i<$scope.itemSameCatList.length;i++){
    	  					$scope.itemSameCatShow.push($scope.itemSameCatList[i]);
    	  				}
    	  			}else{
    	  				for(var i=$scope.startIndex;i<=$scope.endIndex;i++){
    	  					$scope.itemSameCatShow.push($scope.itemSameCatList[i]);
    	  				}
    	  			}
    	  			
    	  			$scope.previousSameCatItemsBtn =true;
    	  			if($scope.itemSameCatList.length<=$scope.endIndex+1) $scope.nextSameCatItemsBtn =true;
        	  	}
		  }).error(function(data) {
              console.log('Error: ' + data);
          });
		 
	 }
	
	$scope.nextItemsSameCat = function(){
		
		$scope.startIndex = $scope.startIndex+$scope.addItemsIndex;
		$scope.endIndex = $scope.endIndex +($scope.itemSameCatList.length - $scope.startIndex);
		
		$scope.previousSameCatItemsBtn =false;
		$scope.itemSameCatMaxLimit = $scope.itemSameCatMaxLimit+1;
		
		$scope.itemSameCatShow.splice(0,$scope.itemSameCatShow.length);
		for(var i=$scope.startIndex;i<=$scope.endIndex;i++){
			$scope.itemSameCatShow.push($scope.itemSameCatList[i]);
		}
		
		if((($scope.itemSameCatList.length - $scope.startIndex)<$scope.addItemsIndex)|| $scope.itemSameCatMaxLimit==$scope.maxLimit){
			 $scope.nextSameCatItemsBtn =true;
		}else{
			
			$http({
	            url: '/item/itemFromSameCategory',
	            method: "GET",
	            params: {category: $scope.categoryStr,catLevel:$scope.catLevel, excludeItemId:$scope.itemObject._id, lastSameCatItemDate:$scope.lastSameCatItemDate, limitPerSlide:$scope.addItemsIndex}
	         }).success(function(data) {
	 
	        	if(data.itemSameCat.length==0){
	        		$scope.nextSameCatItemsBtn =true;
	        	}else{
	        		for(var i=0;i<data.itemSameCat.length;i++){
		        		$scope.itemSameCatList.push(data.itemSameCat[i]);
		        	}
	        		$scope.lastSameCatItemDate=$scope.itemSameCatList[$scope.itemSameCatList.length-1].createdAt;
	        	}
	         }).error(function(data) {
					console.log('Error: ' + data);
	         });
		}
		
		
	}
	
	$scope.previousItemsSameCat = function(){
		
		var recentStrIndex = $scope.startIndex;
		
		$scope.endIndex =  $scope.startIndex-1;
		$scope.startIndex = $scope.startIndex-$scope.addItemsIndex;
		$scope.itemSameCatMaxLimit = $scope.itemSameCatMaxLimit-1;
		
		$scope.itemSameCatShow.splice(0,$scope.itemSameCatShow.length);
		for(var i=$scope.startIndex;i<=$scope.endIndex;i++){
			$scope.itemSameCatShow.push($scope.itemSameCatList[i]);
		}
		
		if($scope.itemSameCatList.length>$scope.endIndex+$scope.addItemsIndex){
			for(var j=$scope.itemSameCatList.length-1;j>=(recentStrIndex+$scope.addItemsIndex);j--){
				$scope.itemSameCatList.pop();
			}
			$scope.lastSameCatItemDate=$scope.itemSameCatList[recentStrIndex+$scope.addItemsIndex-1].createdAt;
		}
		
		if($scope.startIndex!=0) $scope.previousSameCatItemsBtn =false;
		else $scope.previousSameCatItemsBtn =true;
		$scope.nextSameCatItemsBtn =false;
	}
	
	
	
	
	$scope.getProductFromSameBrd= function(){
		
		$http({
             url: '/item/itemFromSameBrand',
             method: "GET",
             params: {brand: $scope.itemObject.brand, excludeItemId:$scope.itemObject._id, lastSameBrdItemDate:$scope.lastSameBrdItemDate, limitPerSlide:(2*$scope.addItemsIndex)}
          }).success(function(data) {
        	
        	  	if(data.itemSameBrd.length==0){
        	  		$scope.showItemsSameBrdPanel=false;
        	  		$scope.previousSameBrdItemsBtn =true;
        	  		$scope.nextSameBrdItemsBtn =true;
	      	  	}else{
	      	  		$scope.showItemsSameBrdPanel=true;
		      	  	$scope.itemSameBrdList = data.itemSameBrd;
		  			$scope.lastSameBrdItemDate=$scope.itemSameBrdList[$scope.itemSameBrdList.length-1].createdAt;
		  			
		  			if($scope.itemSameBrdList.length<=$scope.endIndexBrd){
		  				for(var i=$scope.startIndexBrd; i<$scope.itemSameBrdList.length;i++){
		  					$scope.itemSameBrdShow.push($scope.itemSameBrdList[i]);
		  				}
		  			}else{
		  				for(var i=$scope.startIndexBrd;i<=$scope.endIndexBrd;i++){
		  					$scope.itemSameBrdShow.push($scope.itemSameBrdList[i]);
		  				}
		  			}
		  			
		  			$scope.previousSameBrdItemsBtn =true;
		  			if($scope.itemSameBrdList.length<=$scope.endIndexBrd+1) $scope.nextSameBrdItemsBtn =true;
	      	  	}
        	  	
		  }).error(function(data) {
              console.log('Error: ' + data);
          });
		 
	 }
	
	$scope.nextItemsSameBrd = function(){
		
		$scope.startIndexBrd = $scope.startIndexBrd + $scope.addItemsIndex;
		$scope.endIndexBrd = $scope.endIndexBrd +($scope.itemSameBrdList.length - $scope.startIndexBrd);
		
		$scope.previousSameBrdItemsBtn =false;
		$scope.itemSameBrdMaxLimit = $scope.itemSameBrdMaxLimit+1;
		
		$scope.itemSameBrdShow.splice(0,$scope.itemSameBrdShow.length);
		for(var i=$scope.startIndexBrd; i<=$scope.endIndexBrd; i++){
			$scope.itemSameBrdShow.push($scope.itemSameBrdList[i]);
		}
		
		if((($scope.itemSameBrdList.length - $scope.startIndexBrd)<$scope.addItemsIndex)|| $scope.itemSameBrdMaxLimit==$scope.maxLimitBrd){
			 $scope.nextSameBrdItemsBtn =true;
		}else{
			
			$http({
	            url: '/item/itemFromSameBrand',
	            method: "GET",
	            params: {brand: $scope.itemObject.brand, excludeItemId:$scope.itemObject._id, lastSameBrdItemDate:$scope.lastSameBrdItemDate, limitPerSlide:(2*$scope.addItemsIndex)}
	         }).success(function(data) {
	        	if(data.itemSameBrd.length==0){
	        		$scope.nextSameBrdItemsBtn =true;
	        	}else{
	        		for(var i=0;i<data.itemSameBrd.length;i++){
		        		$scope.itemSameBrdList.push(data.itemSameBrd[i]);
		        	}
	        		$scope.lastSameBrdItemDate=$scope.itemSameBrdList[$scope.itemSameBrdList.length-1].createdAt;
	        	}
	         }).error(function(data) {
					console.log('Error: ' + data);
	         });
		}
		
		
	}
	
	$scope.previousItemsSameBrd = function(){
		
		var recentStrIndex = $scope.startIndexBrd;
		
		$scope.endIndexBrd =  $scope.startIndexBrd-1;
		$scope.startIndexBrd = $scope.startIndexBrd-$scope.addItemsIndex;
		$scope.itemSameBrdMaxLimit = $scope.itemSameBrdMaxLimit-1;
		
		$scope.itemSameBrdShow.splice(0,$scope.itemSameBrdShow.length);
		for(var i=$scope.startIndexBrd;i<=$scope.endIndexBrd;i++){
			$scope.itemSameBrdShow.push($scope.itemSameBrdList[i]);
		}
		
		if($scope.itemSameBrdList.length>$scope.endIndexBrd+$scope.addItemsIndex){
			for(var j=$scope.itemSameBrdList.length-1;j>=(recentStrIndex+$scope.addItemsIndex);j--){
				$scope.itemSameBrdList.pop();
			}
			$scope.lastSameBrdItemDate=$scope.itemSameBrdList[recentStrIndex+$scope.addItemsIndex-1].createdAt;
		}
		
		if($scope.startIndexBrd!=0) $scope.previousSameBrdItemsBtn =false;
		else $scope.previousSameBrdItemsBtn =true;
		$scope.nextSameBrdItemsBtn =false;
	}
	
	 $scope.getSideMenuObject();
	 
	 $scope.getProductFromSameCat();
	 $scope.getProductFromSameBrd();
}]);
