// public/js/controllers/NerdCtrl.js
angular.module('HeadCtrl', []).controller('HeadController', function($scope,$http,$state,$location,$cookieStore,ngDialog,shoppingCartService,menuItemService,expandItemService) {
 
       $scope.tagline = 'Nothing beats a pocket protector!';
       $scope.products = shoppingCartService.getProducts();
       $scope.user = $cookieStore.get('user');
      
       
       //User Login
       if($cookieStore.get('loggedIn')==true){
    	  $scope.showLogIn = false;
    	  $scope.showLogOut = true;
    	  $scope.welcomeMessage = "Welcome "+$cookieStore.get('user').fullName;
       }else{
    	  $cookieStore.put('loggedIn',false);
    	  $scope.showLogIn = true;
    	  $scope.showLogOut = false;  
       }
     
       $scope.login = function() {
           
	   	$http({
	   	    url: '/user/login', 
	   	    method: "POST",
	   	    params: {emailId: $scope.emailId,password:$scope.password}
	   	 }).success(function(data) {
	   		 if(data.status=="pass"){
	   			$cookieStore.put('loggedIn',true);
	   			$cookieStore.remove('user');
		   		$cookieStore.put('user',data.user);
	   			$scope.welcomeMessage = "Welcome "+$cookieStore.get('user').fullName;
	   			$scope.loginFailMessage="";
	   			$scope.showLogIn = false;
	   			$scope.showLogOut = true;
	   			$scope.user = data.user;
	   			
	   		 }else{
	   			$scope.loginFailMessage = data.message;
	   			
	   		 }
	   
	   	 }).error(function(data) {
	   		 console.log('Error: ' + data);
			});
	    };
	    
	  //User Log Out
	  $scope.logout = function(){
		  $cookieStore.put('loggedIn',false);
		  $scope.showLogIn = true;
		  $scope.showLogOut = false;
		  $cookieStore.remove('user');
		  $scope.welcomeMessage =''; 
		  $location.path("/");
		  
	  }
      
       //month list for payment gateway page
       var months = [{"selectMonth":"01(Jan)"},{"selectMonth":"02(Fab)"},{"selectMonth":"03(Mar)"},
                     {"selectMonth":"04(Aprl)"},{"selectMonth":"05(May)"},{"selectMonth":"06(Jun)"},
                     {"selectMonth":"07(Jul)"},{"selectMonth":"08(Aug)"},{"selectMonth":"09(Sep)"},
                     {"selectMonth":"10(Oct)"},{"selectMonth":"11(Nov)"},{"selectMonth":"12(Dec)"}];
       $scope.monthList = months;
      
      
      
       // year list for payment gateway page
       var currentTime = new Date();
       var year = currentTime.getFullYear();
       var years = [{"selectYear":year}];
       for(var i=0;i<20;i++) {
              year = year+1;
              yearEntry = {"selectYear":year};
              years.push(yearEntry);
              }
       $scope.yearList = years;
      
      
      
       $scope.showCart = function() {
             
              $scope.grandTotal = shoppingCartService.getGrandTotal();
              var dialog = ngDialog.open({
             template: 'views/shoppingCart.html',
             scope: $scope,
             className: 'ngdialog-theme-default'
           });
       };
       
       $scope.counterPlus = function(itemObj){
           shoppingCartService.setQuantity(itemObj,"plus");
           $scope.grandTotal = shoppingCartService.getGrandTotal();
          
       };
       
       $scope.counterMinus = function(itemObj){
           shoppingCartService.setQuantity(itemObj,"minus");
           $scope.grandTotal = shoppingCartService.getGrandTotal();
       };
      
      
       $scope.removeFromCart = function(item) {
              shoppingCartService.removeProduct(item);
              $scope.grandTotal = shoppingCartService.getGrandTotal();
       };
       
       $scope.checkForReviw = function(){
    	  
    	  if($cookieStore.get('loggedIn')==false){
    		 
    		 var dialog = ngDialog.open({
    	            template: 'views/loginOrSignup.html',
    	            scope: $scope,
    	            className: 'ngdialog-theme-default'
    	          });
    		}else{
    			
    			$location.path("/reviewOrder");
    		}
       }
       
       $scope.quantityList = [{quantity:1 },
                              {quantity:2 },
                              {quantity:3 },
                              {quantity:4 },
                              {quantity:5 },
                              {quantity:6 },
                              {quantity:7 },
                              {quantity:8 },
                              {quantity:9 }];
       
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

         

       };
       
      
       $scope.liveSearch = function(){
	           if($scope.keyWord!=''){
	                  $http({
	                      url: '/item/liveSearch',
	                      method: "POST",
	                      data: {keyWord:$scope.keyWord},
	                      headers: {'Content-Type': 'application/json'}
	                    }).success(function (data, status, headers, config) {
	                        
	                         if(data.length==0){
	                           $scope.liveResultList = [];
	                   }else{
	                           $scope.liveResultList = data;
	                           $scope.showLiveSearchTable=true;
	                   }
	                    }).error(function (data, status, headers, config) {
	                  
	                    });  
	             }else{
	            	$scope.liveResultList = {};
	                 $scope.showLiveSearchTable=false; 
	             }
	           
	           
	      }
       
       $scope.expandItem = function(item){
    	   
    	   var categoryTwoId = item.categoryTwoId;
    	   var sideMenu;
    	   
    	   expandItemService.setExpandItemFlag(true);
     	   expandItemService.setItem(item);
    	   
    	   for(var i=0;i<menuItemService.getMenu().length;i++){
    		   if(menuItemService.getMenu()[i]._id==item.categoryZeroId){
    			   sideMenu = menuItemService.getMenu()[i];
    		   }
    	    }
    	   
    	   $scope.showLiveSearchTable=false;
    	   $scope.keyWord ="";
    	   $state.go('searchItems', {category:categoryTwoId,sideMenu:sideMenu},{reload: true});
       }

      
       $scope.submitOrder = function() {
    	 var finalOrderObject = {
    			 fullName: $cookieStore.get('user').fullName,
                 emailId : $cookieStore.get('user').emailId,
                 mobileNo : $cookieStore.get('user').mobileNo,
                 alternateNo : $cookieStore.get('user').alternateNo,
                 address : $cookieStore.get('user').address,
                 date : new Date(),
                 grandTotal: $cookieStore.get('grandTotal'),
                 order: $scope.products
    	  }
    	 
    	$http({
		   url: '/order/submitOrder',
		   method: "POST",
		   data: angular.toJson(finalOrderObject),
		   headers: {'Content-Type': 'application/json'}
		 }).success(function (data, status, headers, config) {
		        shoppingCartService.setOrderId(data);
		        shoppingCartService.emptyCart();
		        $location.path("/completeOrder");
		 }).error(function (data, status, headers, config) {
		
		 });
       };
      
});
