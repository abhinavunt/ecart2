// public/js/app.js
app = angular.module('sampleApp', ['ngRoute','appRoutes','MenuCtrl','AdminChartCtrl','HomeCtrl','CompleteOrderCtrl','UserCtrl','RegisteredUsersCtrl','AdminOrderCtrl','AddCtrl','HeadCtrl','ItemCtrl','GetItemCtrl','ShowItemCtrl','ExpandItemCtrl','AdminFeedbackCtrl','ReviewOrderCtrl','PaymentGatewayCtrl','ConsolidatedItemsCtrl','AllLatestProdsCtrl','AllOfferProdsCtrl','ngDialog','file-model','angularFileUpload','ngCookies','googlechart','infinite-scroll','ngAnimate','angularSpinner','matchMedia']);
 
 
app.service('shoppingCartService',['$cookieStore', function($cookieStore) {
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
               $cookieStore.put('grandTotal',0);
               $cookieStore.put('productList',[]);
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
}]);

app.service('expandItemService',['$cookieStore', function($cookieStore) {
	
	var itemObjectList=[];
	var expandItemFlag;
	var menuObject;
	
	var getItem = function(){
		return itemObjectList;
	}
	
	var getExpandItemFlag = function(){
		return expandItemFlag;
	}
	
	var setExpandItemFlag = function(value){
		expandItemFlag=value;
		itemObjectList.splice(0,itemObjectList.length);
	}
	
	var setItem = function(item){
		itemObjectList.push(item);
	}
	
	var setMenuObject = function(menuObj){
		$cookieStore.put('menuObj',menuObj);
	}
	
	var getMenuObject = function(){
		return $cookieStore.get('menuObj');
	}
	
	var getItemObject = function(){
		return $cookieStore.get('itemObj');
	}
	
	var setItemObject = function(itemObj){
		$cookieStore.put('itemObj',itemObj);
	}
	
	var getCategoryString = function(){
		return $cookieStore.get('categoryStr');
	}
	
	var setCategoryString = function(category){
		$cookieStore.put('categoryStr',category);
	}
	
	var getReturnState = function(){
		return $cookieStore.get('retState');
	}
	
	var setReturnState = function(retState){
		$cookieStore.put('retState',retState);
	}
	
	var setCategoryLevel = function(catLevel){
		
		$cookieStore.put('catLevel',catLevel);
	}
	
	var getCategoryLevel = function(){
		return $cookieStore.get('catLevel');
	}
	
	return {
		getItem:getItem,
		setItem:setItem,
		getMenuObject:getMenuObject,
		setMenuObject:setMenuObject,
		getItemObject:getItemObject,
		setItemObject:setItemObject,
		getCategoryString:getCategoryString,
		setCategoryString:setCategoryString,
		getExpandItemFlag:getExpandItemFlag,
		setExpandItemFlag:setExpandItemFlag,
		getReturnState:getReturnState,
		setReturnState:setReturnState,
		getCategoryLevel:getCategoryLevel,
		setCategoryLevel:setCategoryLevel
		
	};
	
}]);

app.service('menuItemService',['$cookieStore', function($cookieStore) {

	var menuObject;
	var darkOutVal='darkOut';
	
	var setMenu = function(menuObj){
		menuObject = menuObj;
	}
	
	var getMenu = function(){
		return menuObject;
	}
	
	var setCatLevelZeroId = function(id){
		
		$cookieStore.put('catLevelZeroId',id);
	}
	
	var getCatLevelZeroId = function(){
		return $cookieStore.get('catLevelZeroId');
	}
	
	var setDarkOutVal = function(darkOut){
		darkOutVal = darkOut;
	}
	
	var getDarkOutVal = function(){
		return darkOutVal;
	}
	
	return {
		setMenu:setMenu,
		getMenu:getMenu,
		getDarkOutVal:getDarkOutVal,
		setDarkOutVal:setDarkOutVal,
		getCatLevelZeroId:getCatLevelZeroId,
		setCatLevelZeroId:setCatLevelZeroId
	};
}]);

app.service('itemService', function() {
	
	var sortCriteriaVal = 1;
	
	var getSortCriteria = function(){
		return sortCriteriaVal;
	}
	
	var setSortCriteria = function(sortCriteria){
		sortCriteriaVal = sortCriteria;
	}
	
	return {
		getSortCriteria:getSortCriteria,
		setSortCriteria:setSortCriteria
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


app.directive('myDocumentClick', ['$document',function($document) {
	  return {
	    restrict: 'A',
	    link: function(scope, element, attrs) {
	      $document.bind('click', function(event) {
		    	if(angular.element(event.target).hasClass('liveSearchShow')||angular.element(event.target).attr('id')=='itemLiveSearch') angular.element('.liveResultList').show();
		        else angular.element('.liveResultList').hide();
	      	 })
	        }
	      };
	  }
 ]);

	



