// public/js/controllers/NerdCtrl.js
angular.module('ExpandItemCtrl', []).controller('ExpandItemController', function($scope,$http,$stateParams,expandItemService,shoppingCartService) {
	
	 if(typeof($stateParams.menuObj)=='string'|| typeof($stateParams.itemObj)=='string'||typeof($stateParams.brandList)=='string'){
     	$scope.sideMenu = expandItemService.getMenuObject();
     	$scope.itemObject = expandItemService.getItemObject();
     	
     }else{
     	$scope.sideMenu = $stateParams.menuObj;
     	$scope.itemObject = $stateParams.itemObj;
     	expandItemService.setMenuObject($stateParams.menuObj);
     	expandItemService.setItemObject($stateParams.itemObj);
     	
	 }
	 
	 $scope.products = shoppingCartService.getProducts();
     
     $scope.$watch('products', function() {
     if($scope.products.length>0){
   	  var productId = $scope.amount.selected.productId;
         $scope.qnt = shoppingCartService.getQuantity(productId)+" item in Cart";
     }},true);
     
     $scope.$watch('amount.selected', function() {
     if($scope.products.length>0){
     var productId = $scope.amount.selected.productId;
         $scope.qnt = shoppingCartService.getQuantity(productId)+" item in Cart";
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
        
         var productId = $scope.amount.selected.productId;
         $scope.qnt = shoppingCartService.getQuantity(productId)+" item in Cart";
        
	 };
  
	 $scope.initQnt = function(){
	 if($scope.products.length>0){
		 var productId = $scope.amount.selected.productId;
		      $scope.qnt = shoppingCartService.getQuantity(productId)+" item in Cart";
		 }
	 };
	 
	 
	 
	 $scope.counterPlus = function(){
		if($scope.products.length>0){
	    var itemObj = $scope.amount.selected;
	         shoppingCartService.setQuantity(itemObj,"plus");
	         var productId = $scope.amount.selected.productId;
	         $scope.qnt = shoppingCartService.getQuantity(productId)+" item in Cart";
		}     
	  };
	 
	 
	 $scope.counterMinus = function(){
	 
		     var itemObj = $scope.amount.selected;
	         shoppingCartService.setQuantity(itemObj,"minus");
	         var productId = $scope.amount.selected.productId;
	         $scope.qnt = shoppingCartService.getQuantity(productId)+" item in Cart";
	  };
	 
	 
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
	 
	 
});
