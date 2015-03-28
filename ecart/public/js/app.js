// public/js/app.js
app = angular.module('sampleApp', ['ngRoute','appRoutes','ngAnimate','MenuCtrl','CompleteOrderCtrl','UserCtrl','AdminOrderCtrl','AddCtrl','HeadCtrl','ItemCtrl','ShowItemCtrl','ngDialog','file-model','angularFileUpload','ngCookies']);
 
 
app.service('shoppingCartService', function($cookieStore) {
		var productList;
		var grandTotal;
		var orderId ='';
		 
		 
		if($cookieStore.get('productList')) productList = $cookieStore.get('productList');
		else productList = [];
		
		if($cookieStore.get('grandTotal')) grandTotal = $cookieStore.get('grandTotal');
		else grandTotal = 0;
		
		var addProduct = function(newObj) {
             productList.push(newObj);
             grandTotal = grandTotal + newObj.totalPrice;
             $cookieStore.put('productList',productList);
             $cookieStore.put('grandTotal',grandTotal);
         }
         var getProducts = function(){
             return productList;
         }
       
         var getGrandTotal = function(){
             return grandTotal;
         }
       
         var setQuantity = function(itemObj,plusMinus){
            
                if(plusMinus=="plus"){
                       for (var d=0;d<productList.length;d++) {
                            if (productList[d].productId == itemObj.productId && productList[d].quantity<9) {
                                   productList[d].quantity = productList[d].quantity+1;
                                   productList[d].totalPrice = parseInt(productList[d].totalPrice)+parseInt(productList[d].price);
                                   grandTotal = grandTotal+parseInt(productList[d].price);
                                   
                                   $cookieStore.put('productList',productList);
                                   $cookieStore.put('grandTotal',grandTotal);
                                   
                            }
                                   }
            
                     }else{
                             for (var d=0;d<productList.length;d++) {
                                   if (productList[d].productId == itemObj.productId && productList[d].quantity>1) {
                                          productList[d].quantity = productList[d].quantity-1;
                                          productList[d].totalPrice = parseInt(productList[d].totalPrice)-parseInt(productList[d].price);
                                          grandTotal = grandTotal-parseInt(productList[d].price);
                                          
                                          $cookieStore.put('productList',productList);
                                          $cookieStore.put('grandTotal',grandTotal);
                                   }
                             }
                     }
          }
        
         var emptyCart = function(){
               productList.length=0;
               grandTotal =0;
               $cookieStore.remove('productList');
               $cookieStore.remove('grandTotal');
         }
        
         var setOrderId = function(data){
               orderId = data;
         }
        
         var getOrderId = function(){
             return orderId;
         }
        
         var getQuantity = function(productId){
               for (var d=0;d<productList.length;d++) {
                 if (productList[d].productId == productId) {
                       return productList[d].quantity;
                       break;
                 }
               }
         }
       
         var removeProduct=function(item){
                var index=productList.indexOf(item);
                productList.splice(index,1);
                grandTotal = grandTotal - item.totalPrice;
                
                $cookieStore.put('productList',productList);
                $cookieStore.put('grandTotal',grandTotal);
         }
         return {
           addProduct: addProduct,
           getProducts: getProducts,
           getGrandTotal:getGrandTotal,
           removeProduct:removeProduct,
           setQuantity:setQuantity,
           getQuantity:getQuantity,
           getOrderId:getOrderId,
           setOrderId:setOrderId,
           emptyCart:emptyCart
 
         };
});

app.filter('unique', function() {
	   return function(collection, keyname) {
	      var output = [], 
	          keys = [];

	      angular.forEach(collection, function(item) {
	          var key = item[keyname];
	          if(keys.indexOf(key) === -1) {
	              keys.push(key);
	              output.push(item);
	          }
	      });
	      return output;
	   };
});



