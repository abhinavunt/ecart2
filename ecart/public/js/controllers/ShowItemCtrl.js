// public/js/controllers/NerdCtrl.js
angular.module('ShowItemCtrl', []).controller('ShowItemController',['$scope','$http','$state','shoppingCartService','expandItemService','menuItemService', function($scope,$http,$state,shoppingCartService,expandItemService,menuItemService) {
			
              
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
            	  	 var priceVal;
            	  	 if(amountObj.OfferCheck==true)  priceVal = amountObj.OfferPrice;
                     else priceVal = amountObj.Price;
                    
                     var cartEntry = {
                                  
                                  itemName: itemObj.name,
                                  brand: itemObj.brand,
                                  amount: amountObj.Amount,
                                  price: priceVal,
                                  quantity: quantityObj.quantity,
                                  totalPrice: quantityObj.quantity*priceVal,
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
                  $scope.qnt = shoppingCartService.getQuantity(productId);
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
            
              
              $scope.expandItem = function(item,retState){
               var sideMenu;
           	   expandItemService.setItem(item);
           	   if(retState!='getPreSet')expandItemService.setReturnState(retState);
           	   
           	   for(var i=0;i<menuItemService.getMenu().length;i++){
           		   if(menuItemService.getMenu()[i]._id==item.categoryZeroId){
           			   sideMenu = menuItemService.getMenu()[i];
           		   }
           	    }
           	   
           	   expandItemService.setCategoryString(item.categoryTwoId);
           	   $state.go('expandItem',{itemObj:item,menuObj:sideMenu});
              }
              
              $scope.expandItemFromSearch = function(item,sideMenu,retState){
            	 
            	  expandItemService.setItem(item);
              	  expandItemService.setReturnState(retState);
            	  $state.go('expandItem',{itemObj:item,menuObj:sideMenu},{reload: true});  
              }
              
              
             
              function getById(arr, id) {
                     for (var d=0;d<arr.length;d++) {
                    if (arr[d].productId == id) {
                    return true;
                    break;
              }
                   }
                     return false;
              }
              
           
}]);
